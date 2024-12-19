import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import {
  Add,
  Dashboard as DashboardIcon,
  Logout,
  ProductionQuantityLimits,
  ShoppingCart as PurchasesIcon,
  SupportAgent,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import "./css/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminId");
    console.log("Logged out successfully");
    navigate("/admin/"); // Redirect to the login page (or home page)
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Sales", icon: <DashboardIcon />, path: "/admin/sales" },
    { text: "Purchases", icon: <PurchasesIcon />, path: "/admin/purchases" },
    { text: "Purchase Form", icon: <SupportAgent />, path: "/admin/supplier" },
    { text: "Add Supplier", icon: <Add />, path: "/admin/add_supplier" },
    {
      text: "Add Product",
      icon: <ProductionQuantityLimits />,
      path: "/admin/AddProduct",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path} // Navigate to the path
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}

        <ListItem className="logoutbtn" button onClick={handleLogout}>
          <ListItemIcon style={{ float: "bottom" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
