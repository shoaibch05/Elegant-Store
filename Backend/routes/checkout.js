const express = require('express');
const router = express.Router();
const db = require('../db'); 
const { v4: uuidv4 } = require('uuid');

const checkoutCart = (req, res) => {
    const { userId, cartItems } = req.body;
    console.log('Received checkout request:', req.body); 
    const transactionId = uuidv4(); // Generate a unique transaction ID

    // Validate cartItems
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: 'No items in the cart.' });
    }

    // Prepare the SQL insert query
    const insertSql = "INSERT INTO sale (User_id, product_id, transaction_id) VALUES ?";
    const values = cartItems.map(item => [userId, item.productId, transactionId]);

    db.beginTransaction((transactionErr) => {
        if (transactionErr) {
            console.error('Error starting transaction:', transactionErr);
            return res.status(500).json({ success: false, message: 'Checkout failed' });
        }

        // Execute the SQL insert query within a transaction
        db.query(insertSql, [values], (insertError, results) => {
            if (insertError) {
                return db.rollback(() => {
                    console.error('Error during checkout insert:', insertError);
                    res.status(500).json({ success: false, message: 'Checkout failed' });
                });
            }

            // Deduct stock quantity for each product
            const updatePromises = cartItems.map(item => {
                return new Promise((resolve, reject) => {
                    const updateSql = 'UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0';
                    db.query(updateSql, [item.productId], (updateError, updateResults) => {
                        if (updateError) {
                            reject(updateError);
                        } else {
                            resolve(updateResults);
                        }
                    });
                });
            });

            Promise.all(updatePromises)
                .then(() => {
                    // Clear the cart for the user
                    const deleteSql = "DELETE FROM cart WHERE user_id = ?";
                    db.query(deleteSql, [userId], (deleteError) => {
                        if (deleteError) {
                            return db.rollback(() => {
                                console.error('Error clearing cart after checkout:', deleteError);
                                res.status(500).json({ success: false, message: 'Checkout completed, but failed to clear the cart' });
                            });
                        }

                        // Commit the transaction if all steps succeeded
                        db.commit((commitError) => {
                            if (commitError) {
                                return db.rollback(() => {
                                    console.error('Error committing transaction:', commitError);
                                    res.status(500).json({ success: false, message: 'Checkout failed during commit' });
                                });
                            }

                            // Respond with success and transaction ID
                            res.json({ success: true, message: 'Checkout successful', transactionId });
                        });
                    });
                })
                .catch(updateError => {
                    db.rollback(() => {
                        console.error('Error during checkout transaction:', updateError);
                        res.status(500).json({ success: false, message: 'Checkout failed' });
                    });
                });
        });
    });
};

router.post('/', checkoutCart);

module.exports = router;
