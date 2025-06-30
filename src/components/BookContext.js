import React, { createContext, useContext, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  getBooksFromLocal,
  saveBooksToLocal,
  addBookToLocal,
  deleteBookFromLocal,
  updateBookInLocal,
} from '../storage';


// 判斷是否 PWA (display-mode: standalone 或 iOS navigator.standalone)
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
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
  // const { loading, error, data } = useQuery(GET_BOOKS);
  const useGraphQL = !isPWA() && isLocalhost();

  const [state, dispatch] = React.useReducer(bookReducer, { books: [] });
  const isOnline = navigator.onLine;

  const { loading, error, data } = useQuery(GET_BOOKS, {
    skip: !useGraphQL,
    fetchPolicy: 'network-only',
  });

  // 使用 mutation hook
  const [addBookMutation] = useMutation(ADD_BOOK);
  const [deleteBookMutation] = useMutation(DELETE_BOOK);
  const [updateBookMutation] = useMutation(UPDATE_BOOK);
  

  // 資料載入：PWA 用 localStorage，開發用 GraphQL
  useEffect(() => {
    if (useGraphQL && data?.books?.length) {
      dispatch({ type: 'SET_BOOKS', payload: data.books });
      saveBooksToLocal(data.books);
      console.log('線上模式（開發）：從 GraphQL 載入並快取');
    } else {
      const localBooks = getBooksFromLocal();
      dispatch({ type: 'SET_BOOKS', payload: localBooks });
      console.log('PWA 或離線模式：從 localStorage 載入書籍');
    }
  }, [useGraphQL, data]);


  // // 1. 應用啟動時，先從 localStorage 載入資料（避免空白）
  // useEffect(() => {
  //   const localBooks = getBooksFromLocal();
  //   if (localBooks.length > 0) {
  //     dispatch({ type: 'SET_BOOKS', payload: localBooks });
  //     console.log('成功從 localStorage 載入資料');
  //   }
  // }, []);

  // // 2. GraphQL 拿到資料後，更新狀態並寫入 localStorage
  // useEffect(() => {
  //   if (data?.books && data.books.length > 0) {
  //     dispatch({ type: 'SET_BOOKS', payload: data.books });
  //     saveBooksToLocal(data.books);
  //   }
  // }, [data]);



  



  


    // 目前你做到這裡就可以讓：

  // 🟢 線上時 → 存到 GraphQL + localStorage
  
  // 🔴 離線時 → 存到 localStorage 並即時顯示
  
  // 但當 網路恢復後，你可以實作一個簡單的機制自動同步：


  // useEffect(() => {
  //   if (!navigator.onLine) return;
  
  //   const localBooks = getBooksFromLocal();
  //   const offlineBooks = localBooks.filter(book => book.id?.startsWith('offline-'));
  
  //   if (offlineBooks.length > 0) {
  //     offlineBooks.forEach(book => {
  //       addBookMutation({ variables: { input: book } })
  //         .then(({ data }) => {
  //           updateBookInLocal(data.addBook); // 替換 offline id
  //         })
  //         .catch(console.error);
  //     });
  //   }
  // }, [addBookMutation]); // ✅ 加上它
  

  // 新增書籍
  // const addBook = async (input) => {
  //   try {
  //     const { data } = await addBookMutation({ variables: { input } });
  //     dispatch({ type: 'ADD_BOOK', payload: data.addBook });
  //     addBookToLocal(data.addBook)
  //   } catch (e) {
  //     console.error('Add book error:', e);
  //   }
  // };

  // const addBook = async (input) => {
  //   if (!isOnline) {
  //     // 離線狀態下直接寫 localStorage
  //     const offlineBook = {
  //       ...input,
  //       id: `offline-${Date.now()}`, // 用 timestamp 做唯一 ID
  //     };
  //     dispatch({ type: 'ADD_BOOK', payload: offlineBook });
  //     addBookToLocal(offlineBook);
  //     console.log('📴 離線模式：已儲存到 localStorage', offlineBook);
  //     return;
  //   }
  
  //   try {
  //     const { data } = await addBookMutation({ variables: { input } });
  //     dispatch({ type: 'ADD_BOOK', payload: data.addBook });
  //     addBookToLocal(data.addBook);
  //   } catch (e) {
  //     console.error('Add book error:', e);
  //   }
  // };

   // 新增書籍
   const addBook = async (input) => {
    if (!useGraphQL) {
      // PWA 或非開發環境，離線時用 localStorage
      const offlineBook = { ...input, id: `offline-${Date.now()}` };
      dispatch({ type: 'ADD_BOOK', payload: offlineBook });
      addBookToLocal(offlineBook);
      console.log('📴 PWA/離線新增，存 localStorage:', offlineBook);
      return;
    }

    try {
      const { data } = await addBookMutation({ variables: { input } });
      dispatch({ type: 'ADD_BOOK', payload: data.addBook });
      addBookToLocal(data.addBook);
    } catch (e) {
      console.error('Add book error:', e);
    }
  };




  // 刪除書籍
  // const deleteBook = async (id) => {
  //   try {
  //     await deleteBookMutation({ variables: { id } });
  //     dispatch({ type: 'REMOVE_BOOK', payload: id });
  //     deleteBookFromLocal(id);
  //   } catch (e) {
  //     console.error('Delete book error:', e);
  //   }
  // };

  // const deleteBook = async (id) => {
  //   if (!isOnline) {
  //     dispatch({ type: 'REMOVE_BOOK', payload: id });
  //     deleteBookFromLocal(id);
  //     console.log('📴 離線刪除已更新 localStorage, ID:', id);
  //     return;
  //   }
  
  //   try {
  //     await deleteBookMutation({ variables: { id } });
  //     dispatch({ type: 'REMOVE_BOOK', payload: id });
  //     deleteBookFromLocal(id);
  //   } catch (e) {
  //     console.error('Delete book error:', e);
  //   }
  // };

  // 刪除書籍 (同步本地和 GraphQL)
  const deleteBook = async (id) => {
    if (!useGraphQL) {
      dispatch({ type: 'REMOVE_BOOK', payload: id });
      deleteBookFromLocal(id);
      console.log('📴 PWA/離線刪除 localStorage, ID:', id);
      return;
    }

    try {
      await deleteBookMutation({ variables: { id } });
      dispatch({ type: 'REMOVE_BOOK', payload: id });
      deleteBookFromLocal(id);
    } catch (e) {
      console.error('Delete book error:', e);
    }
  };



  
  
  

  // 編輯書籍
  // const updateBook = async (id, input) => {
  //   try {
  //     // console.log('Update variables:', { id, input });
  //     const { data } = await updateBookMutation({ variables: { id, input } });
  //     dispatch({ type: 'UPDATE_BOOK', payload: data.updateBook });
  //     updateBookInLocal(data.updateBook)
  //   } catch (e) {
  //     console.error('Update book error:', e);
  //   }
  // };

  // const updateBook = async (id, input) => {
  //   if (!isOnline) {
  //     const updatedBook = { ...input, id }; // 保留原本 ID
  //     dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
  //     updateBookInLocal(updatedBook);
  //     console.log('📴 離線編輯已儲存 localStorage:', updatedBook);
  //     return;
  //   }
  
  //   try {
  //     const { data } = await updateBookMutation({ variables: { id, input } });
  //     dispatch({ type: 'UPDATE_BOOK', payload: data.updateBook });
  //     updateBookInLocal(data.updateBook);
  //   } catch (e) {
  //     console.error('Update book error:', e);
  //   }
  // };
  

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
