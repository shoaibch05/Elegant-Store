import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  InputAdornment,
  Box,
} from "@mui/material";
import { CssBaseline, Toolbar } from "@mui/material";
import {
  ProductionQuantityLimits,
  Person as PersonIcon,
  Payment,
} from "@mui/icons-material";
import {
  fetchSuppliers,
  fetchProducts,
  savePurchase,
} from "../../api/supplierApi";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar1";

const Supplier = () => {
  const [allSuppliers, setAllSuppliers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");
  const [alert, setAlert] = useState(null);

  // Load all products and suppliers on mount
  useEffect(() => {
    const loadData = async () => {
      const productsData = await fetchProducts();
      const suppliersData = await fetchSuppliers();
      setAllProducts(productsData);
      setAllSuppliers(suppliersData);
      setFilteredProducts(productsData); // Initial list shows all
      setFilteredSuppliers(suppliersData); // Initial list shows all
    };
    loadData();
  }, []);

  const handleProductChange = async (e) => {
    const selectedProductId = e.target.value; // Get the selected product ID
    setSelectedProduct(selectedProductId); // Store the selected product ID

    const filteredSuppliers = await fetchSuppliers(selectedProductId);
    setFilteredSuppliers(filteredSuppliers);
  };

  const handleSupplierChange = async (e) => {
    const selectedSupplierId = e.target.value; // Get the selected supplier ID
    setSelectedSupplier(selectedSupplierId); // Store the selected supplier ID

    // Fetch the corresponding products based on the selected supplier ID
    const filteredProducts = await fetchProducts(selectedSupplierId);
    setFilteredProducts(filteredProducts);
  };

  const handleQuantityChange = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
    setTotalPrice(unitPrice * qty);
  };

  const handleUnitPriceChange = (e) => {
    const price = e.target.value;
    setUnitPrice(price);
    setTotalPrice(price * quantity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const purchaseData = {
      supplierId: selectedSupplier,
      productId: selectedProduct,
      quantity,
      unitPrice,
      totalPrice,
      purchaseDate,
      notes,
    };
    try {
      await savePurchase(purchaseData);
      setAlert({ severity: "success", message: "Purchase Successfully!" });
      setSelectedSupplier("");
      setSelectedProduct("");
      setQuantity(1);
      setUnitPrice(0);
      setTotalPrice(0);
      setPurchaseDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setFilteredProducts(allProducts); // Reset filtered lists
      setFilteredSuppliers(allSuppliers);
    } catch (error) {
      setAlert({ severity: "error", message: "Failed to add purchase." });
    }
  };

  const adminId = sessionStorage.getItem("adminId");

  if (!adminId) {
    return (
      <Box sx={{ textAlign: "center", padding: "20px", marginTop: "25%" }}>
        <Typography variant="h6" color="error">
          You must need to log in first.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Container
          maxWidth="sm"
          sx={{
            mt: 4,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {alert && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(null)}
              sx={{ mb: 2 }}
            >
              {alert.message}
            </Alert>
          )}
          <Typography variant="h5" gutterBottom>
            Supplier Purchase Form
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              select
              fullWidth
              label="Product"
              value={selectedProduct}
              onChange={handleProductChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ProductionQuantityLimits />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            >
              <MenuItem value="">
                <em>Select Product</em>
              </MenuItem>
              {filteredProducts.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.Name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Supplier"
              value={selectedSupplier}
              onChange={handleSupplierChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            >
              <MenuItem value="">
                <em>Select Supplier</em>
              </MenuItem>
              {filteredSuppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              type="number"
              fullWidth
              label="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
              margin="normal"
              inputProps={{ min: 1 }}
            />

            <TextField
              type="number"
              fullWidth
              label="Unit Price"
              value={unitPrice}
              onChange={handleUnitPriceChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Payment />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />

            <TextField
              type="text"
              fullWidth
              label="Total Price"
              value={totalPrice}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Payment />
                  </InputAdornment>
                ),
              }}
              margin="normal"
            />

            <TextField
              type="date"
              fullWidth
              label="Purchase Date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, borderRadius: "30px" }}
            >
              Proceed to Purchase
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Supplier;
