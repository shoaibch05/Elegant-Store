import axios from "axios";

const API_URL = "http://localhost:5000/products";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log("Fetched Products:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Fetch a product by ID with its variants and sizes
export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    console.log("Fetched Product:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const fetchVariantsByProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/variants/${productId}`);
    console.log("Fetched Variants:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching variants: ", error);
    console.log("Error fetching variants: ", error);
  }
};

export const fetchSizesForColor = async (productId, color) => {
  try {
    const response = await axios.get(
      `${API_URL}/variants/sizes/${productId}/${color}`
    );
    console.log("fetched size according to variant are", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching size: ", error);
    console.log("Error fetching size: ", error);
  }
};

export const fetchColorsForSize = async (productId, size) => {
  try {
    const response = await axios.get(
      `${API_URL}/variants/colors/${productId}/${size}`
    );
    console.log("fetched color according to size are", response.data);
    return response.data;
  } catch (error) {
    console.error("Something went wrong while fetching colors by its size");
    console.log("Something went wrong while fetching colors by its size");
  }
};

// Add a new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/addproduct/products",
      productData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Product added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding product:", error);
    return {
      success: false,
      message: "An error occurred while adding the product.",
    };
  }
};

// Save a product (this will be for the basic product info, variants, and sizes)
export const saveProduct = async (productData) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/products",
      productData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Product saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving product:", error);
    return {
      success: false,
      message: "An error occurred while saving the product.",
    };
  }
};

// Add variants to a product
export const addVariantsToProduct = async (productId, variants) => {
  console.log(variants);
  try {
    const response = await axios.post(
      `http://localhost:5000/products/${productId}/variants`,
      { variants },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Variants added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding variants:", error);
    return { success: false, message: "Error adding variants" };
  }
};

// Add sizes to a product
export const addSizesToProduct = async (productId, sizes) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/products/${productId}/sizes`,
      { sizes },
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Sizes added:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding sizes:", error);
    return { success: false, message: "Error adding sizes" };
  }
};

// Fetch product variants by product ID
export const fetchProductVariants = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}/variants`);
    console.log("Fetched Variants:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching variants:", error);
    throw error;
  }
};

// Fetch product sizes by product ID
export const fetchProductSizes = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}/sizes`);
    console.log("Fetched Sizes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sizes:", error);
    throw error;
  }
};
