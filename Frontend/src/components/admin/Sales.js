import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
import { fetchSales } from "../../api/salesApi";
import { Container, Table } from "react-bootstrap";
import { Button } from "@mui/material";
import { generatePDF } from "./GeneratePdf";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar1";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    const getSales = async () => {
      const data = await fetchSales();
      setSales(data);
      setFilteredSales(data); // Initialize filtered sales with all sales
    };
    getSales();
  }, []);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = sales.filter(
      (sale) =>
        sale.name.toLowerCase().includes(lowerCaseQuery) || // Customer name
        sale.product_name.toLowerCase().includes(lowerCaseQuery) || // Product name
        sale.address.toString().includes(lowerCaseQuery) // address ID
    );
    setFilteredSales(filtered);
  }, [searchQuery, sales]);
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
        <Container className="mt-5">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Sales Records
          </Typography>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Customer, Product, or Address"
          />
          <Table striped bordered hover responsive className="mt-3">
            <thead className="TableHeader">
              <tr>
                <th>Transaction ID</th>
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Address</th>
                <th>Date & Time</th>
                <th>Product</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale, index) => (
                <tr key={sale.id}>
                  <td>{sale.transaction_id}</td>
                  <td>{sale.id}</td>
                  <td>{sale.name}</td>
                  <td>{sale.address}</td>
                  <td>{new Date(sale.sale_date_time).toLocaleString()}</td>
                  <td>{sale.product_name}</td>
                  <td>${sale.Price}</td>
                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        generatePDF(sale.transaction_id, [sale], "sales")
                      }
                    >
                      Print
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </Box>
    </Box>
  );
};

export default Sales;
