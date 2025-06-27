import './App.css';
import Users from './Users'
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Stack, Divider } from '@mui/material';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import Footer from './components/Footer';
// import dogImage from './img/banner.png';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BookProvider } from './components/BookContext';

const theme = createTheme({
  typography: {
    fontFamily: `'Noto Serif TC', serif`,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BookProvider>
        <img src="/img/banner.png" alt="banner"
          style={{
            width: '100%',
            maxWidth: '800px',
            display: 'block',
            margin: '20px auto',
          }}
        />
        <AppBar
          sx={{
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            boxShadow: 'none'
          }}
          position="static">
          <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Divider orientation="vertical" flexItem />
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
              sx={{ px: 2 }}
            >
              <Button color="inherit" component={Link} to="/" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">狗狗 · 書櫃</Typography>
                <Typography variant="body2">Book List</Typography>
              </Button>
              <Button color="inherit" component={Link} to="/books/add" sx={{ display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h6">新增書籍</Typography>
                <Typography variant="body2">Add Book</Typography>
              </Button>
            </Stack>
            <Divider orientation="vertical" flexItem />
          </Toolbar>
        </AppBar>

        <Container sx={{ mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/books/add" element={<BookForm />} />
            <Route path="/books/:id" element={<BookDetail />} />
          </Routes>
        </Container>
        <Footer />

      </BookProvider>
    </ThemeProvider>
  );
}

export default App;
