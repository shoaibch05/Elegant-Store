import axios from "axios";

// Fetch all suppliers or filter by productId
export const fetchSuppliers = async (productId = null) => {
  try {
    const url = productId
      ? `http://localhost:5000/supplier/supplier?productId=${productId}`
      : `http://localhost:5000/supplier/supplier`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

// Fetch all products or filter by supplierId
export const fetchProducts = async (supplierId = null) => {
  try {
    const url = supplierId
      ? `http://localhost:5000/supplier/product?supplierId=${supplierId}`
      : `http://localhost:5000/supplier/product`;
    const response = await axios.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Save a purchase record
export const savePurchase = async (purchaseData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/supplier/purchases",
      purchaseData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving purchase:", error);
    throw error;
  }
};

// Fetch product variants by productId
export const fetchProductVariants = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/supplier/product/${productId}/variants`
    );
    console.log("Fetched Product Variants:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching variants:", error);
    throw error;
  }
};

// Fetch product sizes by productId
export const fetchProductSizes = async (productId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/supplier/product/${productId}/sizes`
    );
    console.log("Fetched Product Sizes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    throw error;
  }
};
