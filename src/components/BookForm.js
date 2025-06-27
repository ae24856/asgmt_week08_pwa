// BookForm.js
import React from 'react';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';

function BookForm() {
  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ textAlign: 'center', my: 5 }}>新增書籍 Add book</Typography>
      <Stack spacing={2}>
        <TextField label="書名 Title" fullWidth />
        <TextField label="作者 Author" fullWidth />
        <TextField label="ISBN" fullWidth />
        <TextField label="簡介 Description" multiline rows={3} fullWidth />
        <TextField label="封面 Cover Image URL" fullWidth />
        <TextField label="標籤 Tags (comma-separated)" fullWidth />
        <Button variant="contained" 
          sx={{
            background: '#5B4F47',
            color: '#fff',
            '&:hover': {
              background: '#4B413A',
            },
            textTransform: 'none'
          }}
        >送出 Submit</Button>
      </Stack>
    </Container>
  );
}

export default BookForm;