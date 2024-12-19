const express = require("express");
const router = express.Router();
const db = require("../db");
const { v4: uuidv4 } = require("uuid"); // Import UUID library

// Get all sales data
router.get("/", (req, res) => {
  const sql = `
  SELECT sale.id, sale.sale_date_time, products.Name AS product_name, products.Price AS UnitPrice, users.Name AS name, users.Email, sale.quantity, sale.Price, sale.address, sale.transaction_id FROM sale JOIN products ON sale.product_id = products.id JOIN users ON sale.User_id = users.id
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sales data:", err);
      return res.status(500).json({ error: "Failed to fetch sales data" });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const {
    userId,
    productId,
    quantity,
    variant,
    size,
    address,
    unitPrice,
    paymentMethod,
    cardDetails,
  } = req.body;
  let Price = quantity * unitPrice;
  const transactionId = uuidv4(); // Generate a unique transaction ID

  db.beginTransaction((transactionErr) => {
    if (transactionErr) {
      console.error("Error starting transaction:", transactionErr);
      return res.status(500).json({ error: "Transaction error" });
    }

    // Step 1: Insert the sale record with the generated transaction ID
    const insertSaleSql = `
            INSERT INTO sale (User_id, product_id, quantity, address, Price, payment_method, card_details, variant, Size, transaction_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    db.query(
      insertSaleSql,
      [
        userId,
        productId,
        quantity,
        address,
        Price,
        paymentMethod,
        JSON.stringify(cardDetails),
        variant,
        size,
        transactionId, // Include the transactionId in the sale record
      ],
      (insertErr, insertResults) => {
        if (insertErr) {
          return db.rollback(() => {
            console.error("Error adding sale record:", insertErr);
            res.status(500).json({ error: "Failed to record sale" });
          });
        }

        // Step 2: Decrement stock for the purchased product
        const updateStockSql = `
                UPDATE products 
                SET stock = stock - ? 
                WHERE id = ? AND stock >= ?
            `;
        db.query(
          updateStockSql,
          [quantity, productId, quantity],
          (updateErr, updateResults) => {
            if (updateErr || updateResults.affectedRows === 0) {
              return db.rollback(() => {
                console.error(
                  "Error decrementing stock:",
                  updateErr || "Insufficient stock"
                );
                res.status(500).json({
                  error: "Failed to update stock or insufficient stock",
                });
              });
            }

            // Step 3: Commit transaction if both steps succeeded
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", commitErr);
                  res.status(500).json({ error: "Transaction commit error" });
                });
              }

              // Respond with the transaction ID
              res.status(200).json({
                message: "Sale recorded successfully",
                transactionId: transactionId, // Include the transaction ID in the response
                saleId: insertResults.insertId,
              });
            });
          }
        );
      }
    );
  });
});

module.exports = router;
