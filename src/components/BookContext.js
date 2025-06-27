import React, { createContext, useReducer, useContext } from 'react';

// 1. 建立 Context
const BookContext = createContext();

// 2. 定義初始狀態（可以從空陣列開始）
const initialState = {
  books: [
    {id: 1, title: '哈利波特', author: 'JK 羅琳', isbn: '123456', description: '一位平凡男孩，在十一歲生日那天得知自己是巫師，並踏入神秘的霍格華茲魔法學院。在友情、冒險與黑魔法的交織下，他逐步揭開自己與最強黑巫師之間的命運連結。', coverImage: '/img/book.jpg', tags: ['奇幻']},
    {id: 2, title: '達文西密馬', author: 'abc', isbn: '123456', description: '一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。符號學教授羅柏·蘭登與密碼專家蘇菲聯手破解層層線索，展開一場橫跨歐洲的驚險追尋。', coverImage: '/img/book2.jpg', tags: ['偵探']},
    {id: 3, title: '白雪公主', author: 'abc', isbn: '123456', description: '一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。', coverImage: '/img/book3.jpg', tags: ['偵探', '愛情']},
    {id: 4, title: '達文西密馬', author: 'abc', isbn: '123456', description: '一場巴黎羅浮宮的神祕謀殺，牽引出隱藏在宗教與藝術中的重大祕密。符號學教授羅柏·蘭登與密碼專家蘇菲聯手破解層層線索，展開一場橫跨歐洲的驚險追尋。', coverImage: '/img/book4.jpg', tags: ['偵探', '奇幻']}
  ]
};

// 3. 定義 reducer，處理各種對書單的操作（新增、刪除、更新）
function bookReducer(state, action) {
  switch (action.type) {
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

// 4. Provider 元件包裹子元件，並提供狀態與 dispatch
export function BookProvider({ children }) {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  return (
    <BookContext.Provider value={{ state, dispatch }}>
      {children}
    </BookContext.Provider>
  );
}

// 5. 建立自訂 Hook 方便取用
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
}
