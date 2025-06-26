import './App.css';
import Users from './Users'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import BookForm from './components/BookForm';
import dogImage from './img/dog.png';

function App() {
  return (
     <Router>
      <img src={dogImage} alt="dog" width="400px" 
        style={{
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
        <Toolbar>
          {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Book Manager
          </Typography> */}
          <Button color="inherit" component={Link} to="/">Book List</Button>
          <Button color="inherit" component={Link} to="/books/new">Add Book</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
