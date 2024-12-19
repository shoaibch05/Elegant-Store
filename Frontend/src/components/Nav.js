import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { IconButton, Alert, Badge, Box, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  fetchCartItems,
  removeFromCart,
  updateCartQuantity,
} from "../api/cartApi";
import "./css/Products.css";

const Nav = ({ userId, setAlert, onSearch }) => {
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart items when the cart modal is opened
  const handleShowCartModal = async () => {
    if (!userId) {
      setAlert({
        severity: "error",
        message: "You must be logged in to view your cart.",
      });
      return;
    }
    try {
      const data = await fetchCartItems(userId);
      setCartItems(data);
      setShowCartModal(true);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // New function to handle quantity changes
  const handleQuantityChange = async (productId, currentQuantity, action) => {
    const userId = sessionStorage.getItem("userId");
    let newQuantity;

    if (action === "increase") {
      newQuantity = currentQuantity + 1;
    } else if (action === "decrease") {
      // Prevent quantity from going below 1
      newQuantity = Math.max(1, currentQuantity - 1);
    }

    try {
      // Assuming you create a new API method to update cart item quantity
      await updateCartQuantity(userId, productId, newQuantity);

      // Refresh cart items
      const updatedCartItems = await fetchCartItems(userId);
      setCartItems(updatedCartItems);
    } catch (error) {
      setAlert({
        severity: "error",
        message: "Failed to update cart quantity",
      });
    }
  };

  const handleCheckout = async () => {
    if (!userId) {
      setAlert({
        severity: "error",
        message: "You must be logged in to checkout.",
      });
      return;
    }
    const itemsToCheckout = cartItems.map((item) => ({
      productId: item.productId,
    }));
    try {
      const response = await fetch("http://localhost:5000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cartItems: itemsToCheckout }),
      });

      if (response.ok) {
        setAlert({ severity: "success", message: "Checkout successful!" });
        setCartItems([]);
        setShowCartModal(false);
      } else {
        const data = await response.json();
        setAlert({ severity: "error", message: data.error });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setAlert({
        severity: "error",
        message: "An error occurred during checkout.",
      });
    }
  };

  const handleRemoveFromCart = (productId) => {
    const userId = sessionStorage.getItem("userId");

    removeFromCart(userId, productId, (error, message) => {
      if (error) {
        setAlert({ severity: "error", message: error });
      } else {
        // Refresh cart items after removal
        fetchCartItems(userId)
          .then((updatedCartItems) => {
            setCartItems(updatedCartItems);
          })
          .catch((error) => {
            setAlert({ severity: "error", message: "Failed to update cart" });
          });

        setAlert({ severity: "success", message: message });
      }
    });
  };

  return (
    <div className="nav">
      <div className="search-bar" style={{ marginBottom: "0px" }}>
        <input
          type="text"
          placeholder="Search products..."
          onChange={(e) => onSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      <div className="cart-icon">
        <Badge badgeContent={cartItems.length} color="error">
          <IconButton
            size="large"
            color="primary"
            aria-label="cart"
            onClick={handleShowCartModal}
          >
            <ShoppingCartIcon />
          </IconButton>
        </Badge>
      </div>

      {/* Cart Modal */}
      <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cartItems.length > 0 ? (
            <ul>
              {cartItems.map((item, index) => (
                <li
                  key={item.id || index}
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <strong>{item.Name}</strong>
                    <div>Price: PKR {item.price}</div>
                  </div>

                  <Box display="flex" alignItems="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.quantity,
                          "decrease"
                        )
                      }
                    >
                      -
                    </Button>
                    <Typography style={{ margin: "0 10px" }}>
                      {item.quantity}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.quantity,
                          "increase"
                        )
                      }
                    >
                      +
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleRemoveFromCart(item.productId)}
                    >
                      Remove
                    </Button>
                  </Box>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCartModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Nav;
