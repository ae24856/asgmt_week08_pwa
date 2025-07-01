import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { getBookLocal, saveBookLocal, addBookLocal, deleteBookLocal, updateBookInLocal } from '../storage';

// 判斷是否 PWA
// display-mode: standalone 表示網頁是用 PWA 安裝方式打開
// window.navigator.standalone === true 表示在 iOS Safari 下，從「加到主畫面」的捷徑打開
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
  window.navigator.standalone === true;
}

// 判斷是否本地開發環境 (localhost 或 127.0.0.1)
function isLocalhost() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

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
  // 只在「開發階段的瀏覽器模式」下使用 GraphQL API，否則用離線的 localStorage
  const useGraphQL = !isPWA() && isLocalhost();
  const [state, dispatch] = useReducer(bookReducer, { books: [] });

  const { loading, error, data } = useQuery(GET_BOOKS, {
    // 當 skip 是 true 時，不會執行 GraphQL 請求
    skip: !useGraphQL,
    
    // 預設是會先從快取（cache）裡找資料，如果有資料就直接用，不會發網路請求。
    // 如果快取沒有資料，才會發出網路請求抓資料。
    // fetchPolicy：'cache-first'
    
    // 每次都強制從網路重新抓取資料
    // fetchPolicy: 'network-only',
  });

  // 使用 mutation hook
  const [addBookMutation] = useMutation(ADD_BOOK);
  const [deleteBookMutation] = useMutation(DELETE_BOOK);
  const [updateBookMutation] = useMutation(UPDATE_BOOK);
  
  // 資料載入：開發用 GraphQL， PWA 用 localStorage
  useEffect(() => {
    // data?.books?.length 當 data 存在且 books 是陣列且長度 > 0 時才執行
    if (useGraphQL && data?.books?.length) {
      dispatch({ type: 'SET_BOOKS', payload: data.books });
      saveBookLocal(data.books);
      console.log('LocalHost 模式：從 GraphQL 載入並快取');
    } else {
      const localBooks = getBookLocal();
      dispatch({ type: 'SET_BOOKS', payload: localBooks });
      console.log('PWA 或離線模式：從 localStorage 載入書籍');
    }
  // 切換環境或模式或有新資料回來，會更新畫面和快取
  }, [useGraphQL, data]);

   // 新增書籍
   const addBook = async (input) => {
    if (!useGraphQL) {
      // PWA 時用 localStorage
      const offlineBook = { ...input, id: `offline-${Date.now()}` };
      dispatch({ type: 'ADD_BOOK', payload: offlineBook });
      addBookLocal(offlineBook);
      console.log('📴 PWA/離線新增，存 localStorage:', offlineBook);
      return;
    }

    try {
      const { data } = await addBookMutation({ variables: { input } });
      dispatch({ type: 'ADD_BOOK', payload: data.addBook });
      addBookLocal(data.addBook);
    } catch (e) {
      console.error('Add book error:', e);
    }
  };

  // 刪除書籍
  const deleteBook = async (id) => {
    if (!useGraphQL) {
      dispatch({ type: 'REMOVE_BOOK', payload: id });
      deleteBookLocal(id);
      console.log('📴 PWA/離線刪除 localStorage, ID:', id);
      return;
    }

    try {
      await deleteBookMutation({ variables: { id } });
      dispatch({ type: 'REMOVE_BOOK', payload: id });
      deleteBookLocal(id);
    } catch (e) {
      console.error('Delete book error:', e);
    }
  };

  // 更新書籍
  const updateBook = async (id, input) => {
    if (!useGraphQL) {
      const updatedBook = { ...input, id };
      dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
      updateBookInLocal(updatedBook);
      console.log('📴 PWA/離線更新 localStorage:', updatedBook);
      return;
    }

    try {
      const { data } = await updateBookMutation({ variables: { id, input } });
      dispatch({ type: 'UPDATE_BOOK', payload: data.updateBook });
      updateBookInLocal(data.updateBook);
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
