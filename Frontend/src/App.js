import React from "react";
import Login from "./components/login";
import { Routes, Route } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import Cart from "./components/Cart";
import Products from "./components/Products";
import Sales from "./components/admin/Sales";
import Supplier from "./components/admin/Supplier";
import Purchases from "./components/admin/Purchases";
import Dashboard from "./components/admin/admin";
import AdminLogin from "./components/admin/Login";
import Buynow from "./components/buyNow";
import "./App.css";
import AddProduct from "./components/admin/AddProduct";
import ImageUploadList from "./components/admin/imgpreview";
import AddSupplier from "./components/admin/AddSupplier";

export default function App() {
  const userId = sessionStorage.getItem("userId"); // Retrieve the user ID from session storage
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/admin/sales" element={<Sales />} />
        <Route path="/admin/supplier" element={<Supplier />} />
        <Route path="/cart" element={<Cart userId={userId} />} />
        <Route path="/admin/purchases" element={<Purchases />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<Dashboard />} />
        <Route path="/buy/:productId" element={<Buynow />} />
        <Route path="/admin/AddProduct" element={<AddProduct />} />
        <Route path="/admin/prev" element={<ImageUploadList />} />
        <Route path="/admin/add_supplier" element={<AddSupplier />} />
      </Routes>
    </div>
  );
}
