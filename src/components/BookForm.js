import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Stack } from '@mui/material';
import { useBooks } from './BookContext';
import { useParams, useNavigate } from 'react-router-dom';
// import { addBookServer, editBookServer, deleteBookServer } from '../BookService';

function BookForm() {
  const { state, addBook, updateBook, } = useBooks();
  const { id } = useParams(); // 從路由拿 id，undefined 表示新增
  const navigate = useNavigate();

  // 狀態管理表單欄位
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');

  // 編輯模式時，用 useEffect 把該書資料帶入欄位
  useEffect(() => {
  if (id) {
    const bookToEdit = state.books.find(b => String(b.id) === id);
    if (bookToEdit) {
      setTitle(bookToEdit.title);
      setAuthor(bookToEdit.author);
      setIsbn(bookToEdit.isbn);
      setDescription(bookToEdit.description);
      setCoverImage(bookToEdit.coverImage);
      setTags(bookToEdit.tags ? bookToEdit.tags.join(', ') : '');
    }
  }
}, [id, state.books]); 
//把 state.books 放進 useEffect 的依賴陣列，這樣當你 dispatch 更新書本列表後，表單欄位才會更新。

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      title,
      author,
      isbn,
      description,
      coverImage,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (id) {
      await updateBook(id, bookData);
    } else {
      await addBook(bookData);
    }

    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" sx={{ textAlign: 'center', my: 5 }}>
        {id ? '編輯書籍 Edit Book' : '新增書籍 Add Book'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="書名 Title" fullWidth value={title} onChange={e => setTitle(e.target.value)} required />
          <TextField label="作者 Author" fullWidth value={author} onChange={e => setAuthor(e.target.value)} required />
          <TextField label="ISBN" fullWidth value={isbn} onChange={e => setIsbn(e.target.value)} />
          <TextField label="簡介 Description" multiline rows={3} fullWidth value={description} onChange={e => setDescription(e.target.value)} />
          <TextField label="封面 Cover Image URL" fullWidth value={coverImage} onChange={e => setCoverImage(e.target.value)} />
          <TextField label="標籤 Tags (comma-separated)" fullWidth value={tags} onChange={e => setTags(e.target.value)} />
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: '#5B4F47',
              color: '#fff',
              '&:hover': {
                background: '#4B413A',
              },
              textTransform: 'none',
            }}
          >
            送出 Submit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default BookForm;