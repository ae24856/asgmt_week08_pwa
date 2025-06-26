// BookList.jsx
import React from 'react';
import { Container, Typography, Grid } from '@mui/material';

function BookList() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Book List</Typography>
      <Grid container spacing={2}>
        {/* BookCard components will go here */}
      </Grid>
    </Container>
  );
}

export default BookList;
