import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CssBaseline,
  Toolbar,
} from "@mui/material";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar1";

const AddSupplier = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactInfo: "",
    address: "",
  });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.name || !formData.contactInfo || !formData.address) {
      setAlert({ severity: "error", message: "All fields are required!" });
      return;
    }

    // API call to add supplier
    fetch("http://localhost:5000/supplier/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add supplier");
        }
        return response.json();
      })
      .then(() => {
        setAlert({
          severity: "success",
          message: "Supplier added successfully!",
        });
        setFormData({ name: "", contactInfo: "", address: "" });
      })
      .catch((error) => {
        console.error("Error adding supplier:", error);
        setAlert({
          severity: "error",
          message: "Failed to add supplier. Try again later.",
        });
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar />
      <Sidebar />
      <Container maxWidth="sm">
        <Toolbar />
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant="h4" gutterBottom>
            Add New Supplier
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Please fill out the form below to add a new supplier.
          </Typography>
        </Box>

        {alert && (
          <Alert
            severity={alert.severity}
            sx={{ my: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            label="Supplier Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Contact Info"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            required
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Supplier
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AddSupplier;
