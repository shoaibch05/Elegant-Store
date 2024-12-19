const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/product", (req, res) => {
  const { supplierId } = req.query; // Read supplierId from query params
  let query = "SELECT * FROM products";
  const params = [];

  if (supplierId) {
    query += " WHERE id IN (SELECT id FROM products WHERE Supplier_id = ?)";
    params.push(supplierId);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
    res.json(results);
  });
});

router.post("/add", (req, res) => {
  const { name, contactInfo, address } = req.body;
  const query =
    "INSERT INTO suppliers (name, contact_info, address) VALUES (?, ?, ?)";

  db.query(query, [name, contactInfo, address], (err, results) => {
    if (err) {
      console.error("Error adding supplier:", err);
      return res.status(500).json({ message: "Error adding supplier" });
    }
    res.status(200).json({ message: "Supplier added successfully" });
  });
});

router.get("/supplier", (req, res) => {
  const { productId } = req.query; // Read productId from query params
  let query = "SELECT * FROM suppliers";
  const params = [];

  if (productId) {
    query += " WHERE id IN (SELECT Supplier_id FROM products WHERE id = ?)";
    params.push(productId);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err);
      return res.status(500).json({ error: "Failed to fetch suppliers" });
    }
    res.json(results);
  });
});

router.post("/purchases", (req, res) => {
  const {
    supplierId,
    productId,
    quantity,
    unitPrice,
    totalPrice,
    purchaseDate,
    notes,
  } = req.body;

  if (!supplierId || !productId || !quantity || !unitPrice || !totalPrice) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert purchase record
  const purchaseQuery = `
        INSERT INTO purchases (supplier_id, product_id, quantity, unit_price, total_price, purchase_date, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  db.query(
    purchaseQuery,
    [
      supplierId,
      productId,
      quantity,
      unitPrice,
      totalPrice,
      purchaseDate,
      notes,
    ],
    (err) => {
      if (err) {
        console.error("Error inserting purchase:", err);
        return res.status(500).json({ error: "Failed to record purchase" });
      }

      // Update stock in products table
      const updateStockQuery =
        "UPDATE products SET stock = stock + ? WHERE id = ?";
      db.query(updateStockQuery, [quantity, productId], (err) => {
        if (err) {
          console.error("Error updating stock:", err);
          return res.status(500).json({ error: "Failed to update stock" });
        }

        res.status(201).json({
          message: "Purchase recorded and stock updated successfully",
        });
      });
    }
  );
});

module.exports = router;
