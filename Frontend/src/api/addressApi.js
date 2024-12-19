import axios from "axios";

const BASE_URL = "http://localhost:5000/addresses";

// Fetch user details (name and email)
export const fetchUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/${userId}`);
    return response.data; // Returns user details (name, email)
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error; // Propagate the error for UI handling
  }
};

// Fetch addresses and first address
export const fetchAddresses = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/addresses/${userId}`);
    return response.data; // Returns both all addresses and the first address
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error; // Propagate the error for UI handling
  }
};

// Add a new address
export const addAddress = async (userId, address) => {
  try {
    const response = await axios.post(`${BASE_URL}/addresses`, {
      userId,
      address,
    });
    return response.data; // Returns the newly added address (or success message)
  } catch (error) {
    console.error("Error adding address:", error);
    throw error; // Propagate the error for UI handling
  }
};

// Update an existing address
export const updateAddress = async (firstAddressId, updatedAddress) => {
  console.log(
    "we are inside teh updated address function and here is the address id ",
    firstAddressId,
    " and here is the updated address ",
    updatedAddress
  );
  try {
    const response = await axios.post(`${BASE_URL}/update`, {
      firstAddressId,
      updatedAddress,
    });

    return response.data; // Returns the updated address (or success message)
  } catch (error) {
    console.error("Error updating address:", error);
    throw error; // Propagate the error for UI handling
  }
};
