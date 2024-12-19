
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert} from '@mui/material';
import './css/AdminLogin.css'; 
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState(null); 
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://localhost:5000/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          const responseData = await response.json();
          setAlert({ severity: 'success', message: responseData.message }); // Set success alert
          sessionStorage.setItem('adminId', responseData.adminId);
          navigate('/admin/dashboard');
        } else {
          const errorData = await response.json(); 
          setAlert({ severity: 'error', message: errorData.error }); // Set error alert
        }
      } catch (error) {
        console.error('Login error:', error);
        setAlert({ severity: 'error', message: 'An error occurred during login' }); // Set general error alert
      }
    };
  

    return (
        <Box className="admin-login-container">
          <div className='radius1' id='radius-shape-1'></div>
            <Paper elevation={6} className="admin-login-form">
                <Typography variant="h4" align="center" gutterBottom>
                    Sale Sys
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
              </div>
                <form onSubmit={handleLogin}>
                    <TextField value={email} onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="outlined"
                        label="Email"
                        type="email"
                        margin="normal"
                        required
                    />
                    <TextField value={password} onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        variant="outlined"
                        label="Password"
                        type="password"
                        margin="normal"
                        required
                    />
                    <Button
                        className='adminbuton'
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
            <div className='radius2' id='radius-shape-2'></div>
        </Box>
    );
};

export default AdminLogin;
