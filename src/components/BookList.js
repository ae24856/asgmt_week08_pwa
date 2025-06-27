// BookList.js
import React, { useState } from 'react';
import { Link, Container, Typography, Grid, Box, Card, CardContent, CardActionArea, CardMedia, CardActions, Button, TextField, MenuItem } from '@mui/material';
import { useBooks } from './BookContext';
import { Link as RouterLink } from 'react-router-dom';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import InputAdornment from '@mui/material/InputAdornment';

function BookList() {
  // 呼叫 useBooks()，回傳一個物件，裡面有 state 和 dispatch
  const { state } = useBooks();
  // 從 state 裡面取出 books 陣列
  const { books } = state;

  // 本地狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('全部');

  // 從所有書中取出所有 tag（避免重複）
  const allTags = [
    '全部',
      ...Array.from(
      new Set(
        books.flatMap(book => (Array.isArray(book.tags) ? book.tags : [book.tags]))
        )
    ),
  ];


  // 過濾邏輯：符合搜尋與 tag 條件
  const filteredBooks = books.filter(book => {
  const matchTag =
    selectedTag === '全部' ||
    (Array.isArray(book.tags) ? book.tags.includes(selectedTag) : book.tags === selectedTag);
  const matchSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
  return matchTag && matchSearch;
  });


  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ textAlign: 'center', my: 5 }}>狗狗 · 書櫃 Book List</Typography>
      {/* 篩選區塊 */}
      <Box sx={{ display: 'flex', gap: 3, mx: 2, mb:3 }}>
        <TextField
          label="搜尋書名"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="分類"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          sx={{ minWidth: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalOfferRoundedIcon />
              </InputAdornment>
            ),
          }}
        >
          {allTags.map((tag) => (
            <MenuItem key={tag} value={tag}>
              {tag}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {/* 書籍卡片列表 */}
      <Grid container spacing={3}>
        {filteredBooks.length === 0 && (
          <Typography variant="body1" sx={{ m: 2 }}>
            沒有符合條件的書籍
          </Typography>
        )}
        {filteredBooks.map((book) => (
          <Grid item key={book.id} size={{ xs: 6, sm: 4, md: 4 }}>
            <Link
              component={RouterLink}
              to={`/books/${book.id}`}
              underline='none'
            >
            <Card
              sx={{
                width: '100%',
              }}
              key={book.id}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={book.coverImage}
                  alt={book.title}
                />
                <CardContent sx={{ pb:1 }}>
                  <Typography variant="h6" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" 
                    sx={{ 
                      height:{ sm: '40px', md:'100px'},
                       overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: { xs: 'none', sm: '-webkit-box' },
                      WebkitLineClamp: 2, // 顯示兩行
                      WebkitBoxOrient: 'vertical',
                    }}>
                    {book.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ display: { xs: 'none', sm: 'block' },  pt: 0}}>
                <Button size="small" sx={{ color:'#8CB4FF', textTransform: 'none' }}
                  component={RouterLink}
                  to={`/books/${book.id}`}
                >
                  See more...
                </Button>
              </CardActions>
            </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container >
  );
}

export default BookList;
