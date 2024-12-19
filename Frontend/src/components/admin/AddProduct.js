import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  MenuItem,
  Grid,
  Alert,
  CssBaseline,
  Toolbar,
} from "@mui/material";
import { fetchSuppliers } from "../../api/supplierApi";
import { addVariantsToProduct, addSizesToProduct } from "../../api/productsApi";
import ImageUploadList from "./imgpreview";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar1";
// import Sidebar from "./Sidebar1";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // Store selected image files
  const [price, setPrice] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [variants, setVariants] = useState([{ size: "", color: "" }]); // Store variants (size, color, stock)
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch suppliers when component mounts
  useEffect(() => {
    fetchSuppliers()
      .then((data) => setSuppliers(data))
      .catch((error) => console.error("Error fetching suppliers:", error));
  }, []);

  // Add a new variant
  const addVariant = () => {
    setVariants([...variants, { size: "", color: "" }]);
  };

  // Handle variant change
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (
      !name ||
      !description ||
      !price ||
      !supplierId ||
      images.length === 0 ||
      variants.some((variant) => !variant.size || !variant.color)
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);

      formData.append("supplierId", supplierId);

      // Append selected image files
      images.forEach((image) => {
        formData.append("images", image.file); // Ensure `image.file` is valid
      });

      // Include variants in the formData
      formData.append("variants", JSON.stringify(variants));

      const response = await fetch(
        "http://localhost:5000/addproduct/products",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        addVariantsToProduct(data.productId, variant.color);
        addSizesToProduct(data.productId, variant.size);
        console.log(variant.color, variant.size, "Updated Successfully");
      }

      if (response.ok) {
        setMessage("Product added successfully!");
        setName("");
        setDescription("");
        setImages([]);
        setPrice("");

        setSupplierId("");
        setVariants([{ size: "", color: "" }]);
      } else {
        setMessage(data.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("An error occurred while adding the product.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar />
      <Sidebar />

      <Container maxWidth="md">
        <Toolbar />
        <Typography variant="h4" align="center" gutterBottom>
          Add Product
        </Typography>
        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Product Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Product Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Grid>

            {/* Product Price */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Grid>

            {/* Product Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>

            {/* Product Images */}
            <Grid item xs={12}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Upload Images
              </Typography>
              <ImageUploadList images={images} setImages={setImages} />
            </Grid>

            {/* Supplier Selection */}
            <Grid item xs={12}>
              <TextField
                label="Supplier"
                select
                fullWidth
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>Select a supplier</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Product Variants (Sizes, Colors) */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Product Variants
              </Typography>
              {variants.map((variant, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Size"
                        fullWidth
                        value={variant.size}
                        onChange={(e) =>
                          handleVariantChange(index, "size", e.target.value)
                        }
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Color"
                        fullWidth
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        required
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button onClick={addVariant} variant="outlined" color="primary">
                Add Variant
              </Button>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Save Product
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AddProduct;
