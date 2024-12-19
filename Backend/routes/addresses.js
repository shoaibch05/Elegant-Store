const express = require("express");
const router = express.Router();
const db = require("../db");

// Get user details (name and email)
router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  const userSql = `SELECT name, email FROM users WHERE id = ?`;
  db.query(userSql, [userId], (err, userResults) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (userResults.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userResults[0]); // Return user details (name, email)
  });
});

// Get all addresses for a specific user
router.get("/addresses/:userId", (req, res) => {
  const { userId } = req.params;

  const addressSql = `
    SELECT 
      id AS firstAddressId,
      address,
      is_default AS isDefault
    FROM 
      user_addresses
    WHERE 
      user_id = ?
  `;

  db.query(addressSql, [userId], (err, addressResults) => {
    if (err) {
      console.error("Error fetching addresses:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (addressResults.length === 0) {
      return res
        .status(404)
        .json({ error: "No addresses found for this user." });
    }

    // Find the first address (default one)
    const firstAddress =
      addressResults.find((addr) => addr.isDefault) || addressResults[0];

    // Return addresses and the first address
    res.json({
      addresses: addressResults, // All addresses
      firstAddress, // First address (either default or the first one in the list)
    });
  });
});

// Update an existing address
// Update an existing address
router.post("/update", (req, res) => {
  const { firstAddressId, updatedAddress } = req.body;

  if (!firstAddressId || !updatedAddress) {
    return res
      .status(400)
      .json({ error: "Address ID and new address are required." });
  }

  const updateSql = `
    UPDATE user_addresses 
    SET address = ? 
    WHERE id = ?
  `;

  db.query(updateSql, [updatedAddress, firstAddressId], (err, results) => {
    if (err) {
      console.error("Error updating address:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Address not found." });
    }

    res.json({ message: "Address updated successfully." });
  });
});

// Add a new address
router.post("/addresses", (req, res) => {
  const { userId, address } = req.body;

  if (!userId || !address) {
    return res
      .status(400)
      .json({ error: "User ID and new address are required." });
  }

  const insertSql = `
    INSERT INTO user_addresses (user_id, address, is_default)
    VALUES (?, ?, 0)
  `;

  db.query(insertSql, [userId, address], (err, results) => {
    if (err) {
      console.error("Error adding new address:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({
      message: "Address added successfully.",
      firstAddressId: results.insertId,
    });
  });
});

module.exports = router;
