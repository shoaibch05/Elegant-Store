const express = require("express");
const router = express.Router();
const db = require("../db"); // Assuming you have a database connection set up here

// Check if the product is already in the cart
router.post("/check", (req, res) => {
  const { userId, productId } = req.body;
  const query =
    "SELECT quantity FROM cart WHERE user_id = ? AND product_id = ?";

  db.query(query, [userId, productId], (err, results) => {
    if (err) {
      console.error("Error checking cart:", err);
      return res.status(500).json({ message: "Error checking cart" });
    }

    if (results.length > 0) {
      // Product exists in cart, return the current quantity
      res.json({ exists: true, quantity: results[0].quantity });
    } else {
      // Product doesn't exist in the cart
      res.json({ exists: false });
    }
  });
});

// Add to cart (if product doesn't exist, add it)
router.post("/add", (req, res) => {
  const { userId, productId, quantity } = req.body;
  const query =
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";

  db.query(query, [userId, productId, quantity], (err, results) => {
    if (err) {
      console.error("Error adding product to cart:", err);
      return res.status(500).json({ message: "Error adding product to cart" });
    }
    res.json({ message: "Product added to cart successfully" });
  });
});

// Update cart quantity if the product is already in the cart
router.post("/update", (req, res) => {
  const { userId, productId, quantity } = req.body;
  const query =
    "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";

  db.query(query, [quantity, userId, productId], (err, results) => {
    if (err) {
      console.error("Error updating cart quantity:", err);
      return res.status(500).json({ message: "Error updating cart quantity" });
    }
    res.json({ message: "Cart updated successfully" });
  });
});

// Fetch cart items
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
        SELECT c.id, p.id AS productId, p.Name, p.price, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?;
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ message: "Error fetching cart items" });
    }
    res.json(results);
  });
});

// Remove from cart
router.delete("/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;
  const deleteProductQuery =
    "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(deleteProductQuery, [userId, productId], (err, deleteResults) => {
    if (err) {
      console.error("Error removing product:", err);
      return res
        .status(500)
        .json({ error: "Failed to remove product from cart" });
    }
    res.status(200).json({ message: "Product removed from cart" });
  });
});

module.exports = router;
