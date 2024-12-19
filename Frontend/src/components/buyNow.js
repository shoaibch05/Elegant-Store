import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Box,
  IconButton,
  Paper,
} from "@mui/material";
import { Modal } from "react-bootstrap";
import {
  fetchProductById,
  fetchVariantsByProduct,
  fetchSizesForColor,
  fetchColorsForSize,
} from "../api/productsApi";
import {
  fetchAddresses,
  fetchUserDetails,
  addAddress,
  updateAddress,
} from "../api/addressApi";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import "./css/buynow.css";
import Cardpay from "./extras/cardpay";

const Buynow = (props) => {
  const onClose = props.onClose;
  const productId = props.product_id;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState({ name: "", email: "" });
  const [addresses, setAddresses] = useState([]);
  const [firstAddress, setFirstAddress] = useState("");
  const [firstAddressId, setFirstAddressId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [colorVariants, setColorVariants] = useState([]);
  const [sizeVariants, setSizeVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cardDetails, setCardDetails] = useState([]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;

      try {
        const userData = await fetchUserDetails(userId);
        setUser(userData);

        const productData = await fetchProductById(productId);
        setProduct(productData);

        // Fetch initial color variants
        const initialColorVariants = await fetchVariantsByProduct(productId);
        setColorVariants(initialColorVariants);

        // Optionally, fetch sizes for the first color if available
        if (initialColorVariants.length > 0) {
          const firstColor = initialColorVariants[0].variant_value;
          setSelectedColor(firstColor);
          const initialSizeVariants = await fetchSizesForColor(
            productId,
            firstColor
          );
          setSizeVariants(initialSizeVariants);
        }

        const addressData = await fetchAddresses(userId);
        if (addressData && Array.isArray(addressData.addresses)) {
          setAddresses(addressData.addresses);
          if (addressData.firstAddress) {
            setFirstAddress(addressData.firstAddress.address);
            setFirstAddressId(addressData.firstAddress.firstAddressId);
          }
        } else {
          console.error("Invalid address data structure:", addressData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [productId]);

  const handleEditAddress = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSaveAddress = async () => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    try {
      const updatedAddress = isEditing ? firstAddress : newAddress;

      if (isEditing) {
        await updateAddress(firstAddressId, updatedAddress);
      } else {
        await addAddress(userId, updatedAddress);
      }

      const updatedAddresses = await fetchAddresses(userId);
      setAddresses(updatedAddresses.addresses);
      if (updatedAddresses.firstAddress) {
        setFirstAddress(updatedAddresses.firstAddress.address);
        setFirstAddressId(updatedAddresses.firstAddress.firstAddressId);
      }

      setIsEditing(false);
      setNewAddress("");
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleAddressChange = (event) => {
    setFirstAddress(event.target.value);
    const selectedAddress = addresses.find(
      (addr) => addr.address === event.target.value
    );
    setFirstAddressId(selectedAddress ? selectedAddress.firstAddressId : null);
    setShowDropdown(false);
  };

  const handleShowDropdown = () => {
    setIsEditing(false);
    setShowDropdown(true);
  };

  const handleBuyNow = async (sendDetails) => {
    const userId = sessionStorage.getItem("userId");

    setCardDetails({
      cardNumber: sendDetails.cardNumber,
      expiryDate: sendDetails.expiryDate,
      cvv: sendDetails.cvc,
    });
    console.log("card detals fetched in buynow component ", cardDetails);
    const UnitPrice = product.price;
    if (!userId) {
      setAlert({
        severity: "error",
        message: "You must be logged in to buy a product.",
      });
      return;
    }

    if (!firstAddress || !firstAddressId) {
      setAlert({
        severity: "error",
        message: "Please provide a valid shipping address.",
      });
      return;
    }

    if (!selectedColor || !selectedSize) {
      setAlert({
        severity: "error",
        message: "Please select both color and size.",
      });
      return;
    }

    const purchaseData = {
      userId,
      productId,
      quantity,
      variant: selectedColor,
      size: selectedSize,
      address: firstAddress,
      unitPrice: UnitPrice,
      paymentMethod,
      cardDetails: paymentMethod === "creditCard" ? cardDetails : null,
    };

    try {
      const response = await fetch("http://localhost:5000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });

      if (response.ok) {
        setAlert({ severity: "success", message: "Thanks for purchasing!" });
      } else {
        const errorData = await response.json();
        setAlert({ severity: "error", message: errorData.error });
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      setAlert({
        severity: "error",
        message: "An error occurred during the purchase process.",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [product]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleColorChange = async (color) => {
    setSelectedColor(color);
    const fetchedSizes = await fetchSizesForColor(productId, color);
    setSizeVariants(fetchedSizes);
    setSelectedSize(""); // Reset selected size when color changes
  };

  return (
    <Modal show={props.show} onHide={onClose}>
      <Modal.Header closeButton onClose={onClose} />

      <Paper
        elevation={3}
        style={{ padding: "30px", margin: "20px auto", maxWidth: "800px" }}
      >
        {alert && (
          <Typography
            color={alert.severity === "error" ? "red" : "green"}
            style={{ marginBottom: "20px" }}
          >
            {alert.message}
          </Typography>
        )}
        {product ? (
          <div>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="relative"
              marginBottom="20px"
            >
              <img
                src={require(`./${product.images[currentImageIndex]}`)}
                alt={product.name}
                style={{
                  width: "300px",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <IconButton
                onClick={prevImage}
                style={{
                  position: "absolute",
                  left: "10px",
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                onClick={nextImage}
                style={{
                  position: "absolute",
                  right: "10px",
                }}
              >
                <ArrowForwardIos />
              </IconButton>
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <h3>Choose Variants</h3>
            {/* Color Selection */}
            <label>Color:</label>
            <select
              value={selectedColor}
              onChange={(e) => handleColorChange(e.target.value)}
            >
              <option value="">Select Color</option>
              {colorVariants.map((color, index) => (
                <option key={index} value={color.variant_value}>
                  {color.variant_value}
                </option>
              ))}
            </select>

            {/* Size Selection */}
            <label>Size:</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              disabled={sizeVariants.length === 0} // Disable if no sizes are available
            >
              <option value="">Select Size</option>
              {sizeVariants.map((size, index) => (
                <option key={index} value={size.Size}>
                  {size.Size}
                </option>
              ))}
            </select>

            <Typography variant="h5" color="primary">
              Price: PKR {product.price}
            </Typography>

            {/* User Info */}
            <Typography variant="h6" style={{ marginTop: "20px" }}>
              Buyer Information
            </Typography>
            <TextField
              label="Name"
              value={user.name}
              style={{ marginBottom: "10px" }}
              fullWidth
              disabled
            />
            <TextField
              label="Email"
              value={user.email}
              style={{ marginBottom: "20px" }}
              fullWidth
              disabled
            />
            {/* Address Section */}
            <Typography variant="h6">Shipping Address</Typography>

            <TextField
              value={firstAddress}
              fullWidth
              style={{ marginBottom: "20px" }}
              onChange={(e) => setFirstAddress(e.target.value)}
              disabled={!isEditing}
            />
            <Button onClick={handleEditAddress} disabled={isEditing}>
              Edit Address
            </Button>
            {isEditing && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAddress}
              >
                Save Address
              </Button>
            )}
            {/* Change Address Button */}
            <Button
              variant="outlined"
              onClick={handleShowDropdown}
              style={{ margin: "10px" }}
            >
              Change Address
            </Button>
            {showDropdown && (
              <FormControl fullWidth style={{ marginTop: "20px" }}>
                <Select
                  value={firstAddress}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    if (selectedValue === "addAddress") {
                      setNewAddress(""); // Clear the input field
                    } else {
                      handleAddressChange(event); // Handle existing address selection
                    }
                  }}
                >
                  {addresses.map((address) => (
                    <MenuItem key={address.addressId} value={address.address}>
                      {address.address}
                    </MenuItem>
                  ))}
                  <MenuItem value="addAddress">Add Address</MenuItem>
                </Select>

                {/* Display the input field for adding a new address */}
                {newAddress !== null && (
                  <Box marginTop="10px">
                    <TextField
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      label="New Address"
                      fullWidth
                      style={{ marginBottom: "10px" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={async () => {
                        await handleSaveAddress(); // Save new address
                        setShowDropdown(false); // Close the dropdown after saving
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                )}
              </FormControl>
            )}

            {/* Quantity and Payment Method */}
            <Box display="flex" alignItems="center" marginTop="20px">
              <Button onClick={decreaseQuantity} variant="outlined">
                -
              </Button>
              <Typography variant="body1" style={{ margin: "0 10px" }}>
                {quantity}
              </Typography>
              <Button onClick={increaseQuantity} variant="outlined">
                +
              </Button>
            </Box>

            <div style={{ marginTop: "20px" }}>
              <Typography variant="h6">Payment Method</Typography>
              <FormControl>
                <RadioGroup
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel
                    value="cashOnDelivery"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                  <FormControlLabel
                    value="creditCard"
                    control={<Radio />}
                    label="Credit Card"
                  />
                </RadioGroup>
              </FormControl>
            </div>

            {paymentMethod === "creditCard" && (
              <Cardpay sendDetails={handleBuyNow} />
            )}

            <Box
              display="flex"
              justifyContent="center"
              style={{ marginTop: "30px" }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleBuyNow}
                style={{ padding: "10px 50px" }}
              >
                Buy Now
              </Button>
            </Box>
          </div>
        ) : (
          <CircularProgress />
        )}
      </Paper>
    </Modal>
  );
};

export default Buynow;
