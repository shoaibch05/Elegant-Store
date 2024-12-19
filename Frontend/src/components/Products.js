import React, { useEffect, useState } from "react";
import { fetchProducts } from "../api/productsApi";
import { addToCart } from "../api/cartApi";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Nav from "./Nav"; // Import the new Nav component
import "./css/Products.css"; // Custom CSS for Products component
import PrimarySearchAppBar from "./Sidebar";
import Buynow from "./buyNow";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showbuyModal, setShowbuyModal] = useState(false);
  const [producttobuy, setProducttoBuy] = useState();
  const navigate = useNavigate();

  // Fetch products and user ID on component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setFilteredProducts(data);
        console.log("data is ", data);

        const loggedInUserId = sessionStorage.getItem("userId");
        if (loggedInUserId) {
          setUserId(loggedInUserId);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getProducts();
  }, []);

  const handleCart = async (productId) => {
    if (!userId) {
      setAlert({
        severity: "error",
        message: "You must be logged in to add a product to the cart.",
      });
      return;
    }
    try {
      await addToCart(userId, productId);
      setAlert({ severity: "success", message: "Product added to cart!" });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setAlert({
        severity: "error",
        message: "Failed to add product to cart.",
      });
    }
  };

  const handleBuyNow = async (productId) => {
    if (!userId) {
      setAlert({
        severity: "error",
        message: "You must be logged in to buy a product.",
      });
      return;
    }

    setShowbuyModal(true);
    setProducttoBuy(productId);

    // navigate(`/buy/${productId}`, {
    //   state: { userId, productId }, // Pass state to the Buy Now page
    // }
  };
  const handleCloseBuyModal = () => {
    setShowbuyModal(false);
    setProducttoBuy(null);
  };

  const getLimitedDescription = (description) => {
    return description.length > 20
      ? `${description.substring(0, 20)}...`
      : description;
  };

  return (
    <Container className="mt-5">
      <PrimarySearchAppBar />
      <Nav
        userId={userId}
        setAlert={setAlert}
        onSearch={(query) => {
          if (!query) {
            setFilteredProducts(products);
          } else {
            setFilteredProducts(
              products.filter((product) =>
                product.name?.toLowerCase().includes(query.toLowerCase())
              )
            );
          }
        }}
      />

      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Products
      </Typography>

      {alert && (
        <Alert severity={alert.severity} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}
      {producttobuy && (
        <Buynow
          show={showbuyModal}
          product_id={producttobuy}
          onClose={handleCloseBuyModal}
        />
      )}

      <Grid container spacing={4} justifyContent="center">
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card className="product-card">
              <CardMedia
                component="img"
                height="200"
                image={require(`./${product.images[0]}`)}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {getLimitedDescription(product.description)}
                </Typography>
                <Typography variant="h5" color="primary">
                  PKR {product.Price}
                </Typography>
                <Typography variant="body1">Stock: {product.stock}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyNow(product.id)}
                  disabled={product.stock <= 0}
                  style={{ marginRight: "10px" }}
                >
                  Buy Now
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleCart(product.id)}
                  disabled={product.stock <= 0}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Products;
