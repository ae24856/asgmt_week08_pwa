// BookForm.jsx
import React from 'react';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';

function BookForm() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Book Form</Typography>
      <Stack spacing={2}>
        <TextField label="Title" fullWidth />
        <TextField label="Author" fullWidth />
        <TextField label="ISBN" fullWidth />
        <TextField label="Description" multiline rows={4} fullWidth />
        <TextField label="Cover Image URL" fullWidth />
        <TextField label="Tags (comma-separated)" fullWidth />
        <Button variant="contained" color="primary">Submit</Button>
      </Stack>
    </Container>
  );
}

export default BookForm;