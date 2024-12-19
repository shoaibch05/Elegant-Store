import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import Sidebar from "./Sidebar1";
import TopBar from "./TopBar";
import { lazy, Suspense } from "react";
import AddProduct from "./AddProduct";

const Sales = lazy(() => import("./Sales"));
const Purchases = lazy(() => import("./Purchases"));

const Dashboard = () => {
  // Check if adminId is set in sessionStorage
  const adminId = sessionStorage.getItem("adminId");

  if (!adminId) {
    // If adminId is not set, show message or redirect to login
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
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1">
          Manage Sales, Purchases, and more efficiently.
        </Typography>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/admin/dashboard"
              element={<Navigate to="/admin/dashboard" />}
            />
            <Route path="/sales" element={<Sales />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/AddProduct" element={<AddProduct />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

export default Dashboard;
