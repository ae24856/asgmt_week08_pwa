// BookDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

function BookDetail() {
  const { id } = useParams();
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Book Detail - ID: {id}</Typography>
      {/* More detailed info goes here */}
      <Button variant="contained" color="primary">Edit</Button>
    </Container>
  );
}
export default BookDetail;