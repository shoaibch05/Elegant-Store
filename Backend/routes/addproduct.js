const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db"); // Ensure your database connection is correctly imported

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../Frontend/src/components/photos")); // Ensure the path exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to prevent name collisions
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
    }
  },
});

// Route for adding products with images
router.post("/products", upload.array("images"), (req, res) => {
  const { name, description, price, supplierId } = req.body;
  const images = req.files;

  if (!name || !description || !price || !supplierId || !images.length) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in all required fields." });
  }

  // Insert product into the `products` table
  const productQuery = `
    INSERT INTO products (name, description, price, supplier_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    productQuery,
    [name, description, price, supplierId],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res
          .status(500)
          .json({ success: false, message: "Failed to add product" });
      }

      const productId = result.insertId; // Retrieve the new product ID

      // Insert images into the `product_images` table
      const imagePromises = images.map((image) => {
        const imageUrl = `photos/${image.filename}`; // Relative path for the frontend
        const imageQuery = `
          INSERT INTO product_images (product_id, image_url)
          VALUES (?, ?)
        `;

        return new Promise((resolve, reject) => {
          db.query(imageQuery, [productId, imageUrl], (err) => {
            if (err) {
              console.error("Error inserting image:", err);
              reject(err);
            } else {
              resolve();
            }
          });
        });
      });

      // Handle all image insertions
      Promise.all(imagePromises)
        .then(() => {
          res
            .status(201)
            .json({
              success: true,
              productId,
              message: "Product added successfully!",
            });
        })
        .catch((error) => {
          console.error("Error adding product images:", error);
          res
            .status(500)
            .json({ success: false, message: "Failed to add product images" });
        });
    }
  );
});

module.exports = router;
