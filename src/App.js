import './index.css';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Stack, Divider, Box } from '@mui/material';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import Footer from './components/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BookProvider } from './components/BookContext';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // uri: `http://${window.location.hostname}:4000/graphql`,
  cache: new InMemoryCache(),
});

const theme = createTheme({
  typography: {
    fontFamily: `'Noto Serif TC', serif`,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <BookProvider>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            {/* ✅ Header 區塊 */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: 'center' }}>
              <Box
                component="img"
                src="/img/banner_03.png"
                alt="banner"
                sx={{
                  width: '100%',
                  maxWidth: '250px',
                  margin: '14px',
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              />
              <Button color="inherit" component={Link} to="/" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h3"
                  sx={{
                    fontSize: {
                      xs: '1.8rem',
                    },
                    marginTop: '1.5rem'
                  }}>
                  狗狗的書單們
                </Typography>
                <Typography variant="h5"
                  sx={{
                    fontSize: {
                      xs: '1.3rem',
                    }
                  }}>
                  My Pocket Booklist
                </Typography>
              </Button>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'row', md: 'column' }, p: 3, alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/img/banner_01.png"
                  alt="banner"
                  sx={{
                    width: {
                      xs: '150px',
                      md: '210px',
                    },
                    margin: '10px',
                  }}
                />
                <Box >
                  <Typography variant="body2">用愛書的心愛狗，用愛狗的心愛書</Typography>
                  <Typography variant="body2">Love Books, Love Dogs.</Typography>
                </Box>
              </Box>
            </Box>

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
                  <Button color="inherit" component={Link} to="/books/add" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6">新增書籍</Typography>
                    <Typography variant="body2">Add Book</Typography>
                  </Button>
                </Stack>
                <Divider orientation="vertical" flexItem />
              </Toolbar>
            </AppBar>

            {/* ✅ 主內容區塊，設定 flex: 1 撐開空間 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<BookList />} />
                <Route path="/books/add" element={<BookForm />} />
                <Route path="/books/:id" element={<BookForm />} />
                <Route path="/books/:id/detail" element={<BookDetail />} />
              </Routes>
            </Box>

            {/* ✅ Footer 放在最後，固定底部 */}
            <Footer />

          </Box>
        </BookProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
