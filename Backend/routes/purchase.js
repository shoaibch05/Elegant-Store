// purchase.js
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  const sql = `
  SELECT p.id, s.name AS supplier_name, s.address, s.contact_info, prod.name AS product_name, p.quantity, p.unit_price, p.total_price, p.purchase_date
  FROM purchases p
  JOIN suppliers s ON p.supplier_id = s.id
  JOIN products prod ON p.product_id = prod.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching purchase data:", err);
      return res.status(500).json({ error: "Failed to fetch purchase data" });
    }
    res.json(results);
  });
});

module.exports = router;
