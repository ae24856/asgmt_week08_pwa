// import React, { createContext, useReducer, useContext} from 'react';
// import { useQuery, gql } from '@apollo/client';

// // 1. 建立 Context
// const BookContext = createContext();

// // 3. 定義 reducer，處理各種對書單的操作（新增、刪除、更新）
// function bookReducer(state, action) {
//   switch (action.type) {
//     case 'SET_BOOKS':  // 用來更新整本書陣列（fetch 回來的）
//       return { ...state, books: action.payload };
//     case 'ADD_BOOK':
//       return { ...state, books: [...state.books, action.payload] };
//     case 'REMOVE_BOOK':
//       return { ...state, books: state.books.filter(book => book.id !== action.payload) };
//     case 'UPDATE_BOOK':
//       return {
//         ...state,
//         books: state.books.map(book => (book.id === action.payload.id ? action.payload : book)),
//       };
//     default:
//       return state;
//   }
// }

// const GET_BOOKS = gql`
// query {
//   books {
//     id
//     title
//     author
//     isbn
//     description
//     coverImage
//     tags
//   }
// }
// `;

// // 4. Provider 元件包裹子元件，並提供狀態與 dispatch
// export function BookProvider({ children }) {
//   const { loading, error, data } = useQuery(GET_BOOKS);
//   const [, dispatch] = useReducer(bookReducer, { books: [] });

//   // 初始資料從 data 替代原 useEffect fetch
//   const books = data?.books ?? [];

//   return (
//     <BookContext.Provider value={{ state: { books }, dispatch, loading, error }}>
//       {children}
//     </BookContext.Provider>
//   );
// }

// // 5. 建立自訂 Hook 方便取用
// export function useBooks() {
//   const context = useContext(BookContext);
//   if (!context) {
//     throw new Error('useBooks must be used within a BookProvider');
//   }
//   return context;
// }




import React, { createContext, useContext } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

// 建立 Context
const BookContext = createContext();

// reducer 處理狀態更新
function bookReducer(state, action) {
  switch (action.type) {
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'REMOVE_BOOK':
      return { ...state, books: state.books.filter(book => book.id !== action.payload) };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book => (book.id === action.payload.id ? action.payload : book)),
      };
    default:
      return state;
  }
}

// GraphQL Queries & Mutations
const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
      isbn
      description
      coverImage
      tags
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($input: AddBookInput!) {
    addBook(input: $input) {
      id
      title
      author
      isbn
      description
      coverImage
      tags
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
    updateBook(id: $id, input: $input) {
      id
      title
      author
      isbn
      description
      coverImage
      tags
    }
  }
`;

// Provider 元件
export function BookProvider({ children }) {
  const { loading, error, data } = useQuery(GET_BOOKS);
  const [state, dispatch] = React.useReducer(bookReducer, { books: [] });

  // 同步初始化資料
  React.useEffect(() => {
    if (data?.books) {
      dispatch({ type: 'SET_BOOKS', payload: data.books });
    }
  }, [data]);

  // 使用 mutation hook
  const [addBookMutation] = useMutation(ADD_BOOK);
  const [deleteBookMutation] = useMutation(DELETE_BOOK);
  const [updateBookMutation] = useMutation(UPDATE_BOOK);

  // 新增書籍
  const addBook = async (input) => {
    try {
      const { data } = await addBookMutation({ variables: { input } });
      dispatch({ type: 'ADD_BOOK', payload: data.addBook });
    } catch (e) {
      console.error('Add book error:', e);
    }
  };

  // 刪除書籍
  const deleteBook = async (id) => {
    try {
      await deleteBookMutation({ variables: { id } });
      dispatch({ type: 'REMOVE_BOOK', payload: id });
    } catch (e) {
      console.error('Delete book error:', e);
    }
  };

  // 編輯書籍
  const updateBook = async (id, input) => {
    try {
      console.log('Update variables:', { id, input });
// await updateBookMutation({ variables: { id, input } });

      const { data } = await updateBookMutation({ variables: { id, input } });
      dispatch({ type: 'UPDATE_BOOK', payload: data.updateBook });
    } catch (e) {
      console.error('Update book error:', e);
    }
  };

  return (
    <BookContext.Provider
      value={{
        state,
        loading,
        error,
        addBook,
        deleteBook,
        updateBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

// 自訂 Hook
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be us within a BookProvider');
  }
  return context;
}
