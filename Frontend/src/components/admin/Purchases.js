import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
import { Table, Button } from "react-bootstrap";
import Sidebar from "./Sidebar1";
import TopBar from "./TopBar";
import { fetchPurchases } from "../../api/purchaseApi";
import { generatePDF } from "./GeneratePdf";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState([]);

  useEffect(() => {
    const getPurchases = async () => {
      const response = await fetchPurchases();
      setPurchases(response);
      setFilteredPurchases(response); // Initialize filtered purchases with all purchases
    };
    getPurchases();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = purchases.filter(
      (purchase) =>
        purchase.supplier_name.toLowerCase().includes(lowerCaseQuery) || // Supplier name
        purchase.product_name.toLowerCase().includes(lowerCaseQuery) || // Product name
        purchase.purchase_date.includes(searchQuery) // Purchase date
    );
    setFilteredPurchases(filtered);
  }, [searchQuery, purchases]);
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
        <div className="bg-glass p-4 rounded">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Purchase Records
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Supplier, Product, or Date"
          />
          <Table responsive className="mt-3">
            <thead className="TableHeader">
              <tr>
                <th>Supplier Name</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Purchase Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id}>
                  <td>{purchase.supplier_name}</td>
                  <td>{purchase.product_name}</td>
                  <td>{purchase.quantity}</td>
                  <td>${purchase.unit_price}</td>
                  <td>${purchase.total_price}</td>
                  <td>{new Date(purchase.purchase_date).toLocaleString()}</td>
                  <td>
                    <Button
                      onClick={() =>
                        generatePDF(purchase.id, [purchase], "purchase")
                      }
                    >
                      Print Invoice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Box>
    </Box>
  );
};

export default Purchases;
