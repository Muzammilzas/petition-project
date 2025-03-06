import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignPetition = () => {
  const navigate = useNavigate();

  const handleSign = () => {
    // Logic for signing the petition goes here
    alert('Petition signed!');
    navigate('/dashboard'); // Redirect to dashboard after signing
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sign the Petition
      </Typography>
      <Typography paragraph>
        Your support is crucial in making a difference. Please sign the petition below.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSign}>
        Sign Petition
      </Button>
    </Container>
  );
};

export default SignPetition; 