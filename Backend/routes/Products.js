const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all products with their associated images, variants, and sizes
router.get("/", (req, res) => {
  const sql = `
        SELECT 
            p.id AS productId,
            p.Name AS productName,
            p.Description,
            p.Price,
            p.stock,
            pi.image_url AS imageUrl
           
        FROM 
            products p
        LEFT JOIN 
            product_images pi ON p.id = pi.product_id
       
    `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Group the results by productId
    const products = results.reduce((acc, row) => {
      const product = acc[row.productId] || {
        id: row.productId,
        name: row.productName,
        description: row.Description,
        price: row.Price,
        stock: row.stock,
        images: [],
      };

      if (row.imageUrl) {
        product.images.push(row.imageUrl);
      }

      acc[row.productId] = product;
      return acc;
    }, {});

    // Convert the grouped object into an array
    res.json(Object.values(products));
  });
});

// Get a single product by ID with its variants and sizes
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  const sql = `
  SELECT
    p.id AS productId,
    p.Name AS productName,
    p.Description,
    p.Price,
    p.stock,
    GROUP_CONCAT(DISTINCT PI.image_url) AS imageUrls,
    pv.variant_type,
    pv.variant_value,
    pv.size,
    pv.stock AS variant_Stock
  FROM
    products p
  LEFT JOIN product_images PI ON
    p.id = PI.product_id
  LEFT JOIN product_variants pv ON
    p.id = pv.product_id
  WHERE
    p.id = ?
  GROUP BY
    p.id, pv.id;
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching product by ID:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Structure the result into a single product object
    const product = {
      id: results[0].productId,
      name: results[0].productName,
      description: results[0].Description,
      price: results[0].Price,
      stock: results[0].stock,
      images: results[0].imageUrls ? results[0].imageUrls.split(",") : [],
      variants: results
        .map((row) => ({
          name: row.variant_type,
          value: row.variant_value,
          size: row.size,
          stock: row.variant_Stock,
        }))
        .filter((variant) => variant.name), // Filter out null or undefined variants
    };

    res.json(product);
  });
});
router.get("/variants/:id", (req, res) => {
  const productId = req.params.id;
  const query =
    "SELECT variant_type, variant_value, Size, stock FROM product_variants WHERE product_id = ?";
  db.query(query, [productId], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
router.get("/variants/sizes/:id/:color", (req, res) => {
  const productId = req.params.id;
  const color = req.params.color;
  const query =
    "SELECT Size, stock FROM product_variants WHERE product_id = ? AND variant_value = ?";
  db.query(query, [productId, color], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
router.get("/variants/colors/:id/:size", (req, res) => {
  const productId = req.params.id;
  const size = req.params.size;
  const query =
    "SELECT variant_value AS color, stock FROM product_variants WHERE product_id = ? AND Size = ?";
  db.query(query, [productId, size], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add variants to a product
router.post("/:productId/variants", (req, res) => {
  const { productId } = req.params;
  const { variants } = req.body;

  if (!variants || !variants.length) {
    return res.status(400).json({ message: "Variants are required" });
  }

  const query =
    "INSERT INTO product_variants (product_id, variant_type, variant_value) VALUES (?,?,?)";
  db.query(query, [productId, "Color", variants], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding variants", error: err });
    }
    res.status(200).json({ message: "Variants added successfully" });
  });
});

// Add sizes to a product
router.post("/:productId/sizes", (req, res) => {
  const { productId } = req.params;
  const { sizes } = req.body;

  if (!sizes || !sizes.length) {
    return res.status(400).json({ message: "Sizes are required" });
  }

  const query =
    "INSERT INTO product_sizes (product_id, size_value, stock) VALUES (?,?,?)";

  db.query(query, [productId, sizes, 0], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error adding sizes", error: err });
    }
    res.status(200).json({ message: "Sizes added successfully" });
  });
});

// Update product details
router.put("/:id", (req, res) => {
  const productId = req.params.id;
  const { name, description, price, stock } = req.body;

  const sql = `
    UPDATE products 
    SET Name = ?, Description = ?, Price = ?, stock = ? 
    WHERE id = ?
  `;

  db.query(sql, [name, description, price, stock, productId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating product", error: err });
    }
    res.status(200).json({ message: "Product updated successfully" });
  });
});
// Decrease stock when a product is purchased
router.put("/:productId/purchase", (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  // SQL to decrease the stock
  const sql =
    "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";

  db.query(sql, [quantity, productId, quantity], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating stock", error: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or insufficient stock" });
    }

    res.status(200).json({ message: "Stock updated successfully" });
  });
});

// Increase stock when restocking products
router.put("/:productId/restock", (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: "Invalid quantity" });
  }

  // SQL to increase the stock
  const sql = "UPDATE products SET stock = stock + ? WHERE id = ?";

  db.query(sql, [quantity, productId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error updating stock", error: err });
    }

    res.status(200).json({ message: "Stock updated successfully" });
  });
});

module.exports = router;
