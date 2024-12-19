import React, { useEffect, useState } from 'react';
import { fetchCartItems } from '../api/cartApi';
import { Container, Typography, Alert } from '@mui/material';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        const userId = sessionStorage.getItem('userId');

        const getCartItems = async () => {
            if (!userId) {
                setAlert({ severity: 'error', message: 'You must be logged in to view your cart.' });
                return;
            }

            try {
                const items = await fetchCartItems(userId);
                setCartItems(items);
            } catch (error) {
                setAlert({ severity: 'error', message: 'Failed to fetch cart items.' });
            }
        };

        getCartItems();
    }, []);

    return (
        <Container>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
                Your Cart
            </Typography>

            {alert && (
                <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                    {alert.message}
                </Alert>
            )}

            {cartItems.length === 0 ? (
                <Typography variant="body1" align="center">Your cart is empty.</Typography>
            ) : (
                cartItems.map(item => (
                    <div key={item.product_id}>
                        <Typography variant="body1">{item.Name} - ${item.price} - {item.quantity}</Typography>
                    </div>
                ))
            )}
        </Container>
    );
};

export default Cart;
