import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null); // State for alert messages
  const navigate = useNavigate();

  const handleOnClick = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const responseData = await response.json();
        setAlert({ severity: 'success', message: responseData.message }); // Set success alert
        sessionStorage.setItem('userId', responseData.userId);
        navigate('/products');
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
    <MDBContainer fluid className='p-5 background-radial-gradient overflow-hidden'>
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{ color: 'hsl(218, 81%, 95%)' }}>
            You Think <br />
            <span style={{ color: 'hsl(218, 81%, 75%)' }}>We Provide</span>
          </h1>
          <p className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
            Place of latest fashion and modern designs to enhance your wardrobe and to look elegant.
          </p>
        </MDBCol>

        <MDBCol md='4' className='position-relative'>
          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>
              <h3>Elegant Store</h3>
              {/* Centered Alert Container */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}
              </div>
              <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
              <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
              <MDBBtn className='w-100 mb-4' size='md' onClick={handleOnClick}>Sign in</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
