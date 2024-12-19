const API_URL = "http://localhost:5000/cart"; // Update with your API URL

export const addToCart = async (userId, productId) => {
  // First, check if the product already exists in the cart
  const response = await fetch(`${API_URL}/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
  });

  const data = await response.json();

  if (data.exists) {
    // If the product exists in the cart, just increment the quantity
    await updateCartQuantity(userId, productId, data.quantity + 1);
  } else {
    // If the product doesn't exist, add it to the cart with quantity 1
    await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, productId, quantity: 1 }),
    });
  }
};

export const updateCartQuantity = async (userId, productId, quantity) => {
  await fetch(`${API_URL}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId, quantity }),
  });
};

export const fetchCartItems = async (userId) => {
  const response = await fetch(`${API_URL}/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch cart items");
  }
  return await response.json();
};

export const removeFromCart = (userId, productId, callback) => {
  fetch(`${API_URL}/${userId}/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to remove product from cart");
      }
      return response.json(); // Get the response body, which includes the message
    })
    .then((data) => {
      callback(null, data.message); // Pass the success message to the callback
    })
    .catch((error) => {
      callback(error.message); // Pass the error message to the callback
    });
};

