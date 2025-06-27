// BookDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';
import { useBooks } from './BookContext';
import { Typography, Container, Box } from '@mui/material';

function BookDetail() {
  const { id } = useParams();
  const { state } = useBooks();
  const book = state.books.find((b) => b.id.toString() === id);

  if (!book) {
    return <Typography variant="h6">找不到這本書</Typography>;
  }
  console.log('收到的 id:', id);
console.log('目前書籍列表:', state.books);

  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 6 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 4,
          alignItems: 'flex-start',
        }}
      >
        {/* 圖片區塊 */}
        <Box
          component="img"
          src={book.coverImage}
          alt={book.title}
          sx={{
            width: '100%',
            maxWidth: 300,
            borderRadius: 2,
            objectFit: 'cover',
          }}
        />

        {/* 文字區塊 */}
        <Box>
          <Typography variant="subtitle1" gutterBottom><strong>書名：</strong>{book.title}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>作者：</strong>{book.author}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>ISBN：</strong>{book.isbn}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>分類：</strong>{book.tags}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{book.description}</Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default BookDetail;