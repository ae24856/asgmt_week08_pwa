// BookDetail.js
import React from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useBooks } from './BookContext';
import { Typography, Button, Stack, Box, Container } from '@mui/material';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, deleteBook } = useBooks();

  const book = state.books.find(b => String(b.id) === id);

  if (!book) {
    return <Typography variant="h6">找不到這本書</Typography>;
  }

  const handleDelete = () => {
    if (window.confirm('確定要刪除這本書嗎？')) {
      deleteBook(book.id);
      navigate('/'); // 刪除完回首頁
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5}}>
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
          src={book.coverImage || 'https://i.postimg.cc/SRbgm8XJ/notFound.png'}
          alt={book.title}
          sx={{
            width: '100%',
            maxWidth: 300,
            borderRadius: 2,
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.onerror = null; // 防止無限觸發
            e.target.src = 'https://i.postimg.cc/SRbgm8XJ/notFound.png'; // 預設圖片
          }}
        />
        {/* 文字區塊 */}
        <Box>
          <Typography variant="h4" gutterBottom>{book.title}</Typography>
          <Typography variant="subtitle1">作者：{book.author}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>ISBN：</strong>{book.isbn}</Typography>
          <Typography variant="subtitle1" gutterBottom><strong>分類：</strong>{book.tags}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{book.description}</Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button variant="outlined" component={RouterLink} to={`/books/${book.id}`}>
              編輯 Edit
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              刪除 Delete
            </Button>
          </Stack>
        </Box>
      </Box>
      </Container>
  );
}

export default BookDetail;