const STORAGE_KEY = 'books';

export function saveBooksToLocal(books) {
  console.log('saveBooksToLocal called, books:', books);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (e) {
    console.error('儲存書籍到 localStorage 失敗:', e);
  }
}

export function getBooksFromLocal() {
  try {
    const booksJson = localStorage.getItem(STORAGE_KEY);
    return booksJson ? JSON.parse(booksJson) : [];
  } catch (e) {
    console.error('從 localStorage 讀取書籍失敗:', e);
    return [];
  }
}

// export function addBookToLocal(book) {
//   const books = getBooksFromLocal();
//   books.push(book);
//   saveBooksToLocal(books);
// }


export function addBookToLocal(book) {
  const books = getBooksFromLocal();
  console.log('[addBookToLocal] 目前 localStorage 內容:', books);
  books.push(book);
  console.log('[addBookToLocal] 新增書籍:', book);
  saveBooksToLocal(books);
}



export function deleteBookFromLocal(id) {
  const books = getBooksFromLocal().filter(book => book.id !== id);
  saveBooksToLocal(books);
}

export function updateBookInLocal(updatedBook) {
  const books = getBooksFromLocal().map(book =>
    book.id === updatedBook.id ? updatedBook : book
  );
  saveBooksToLocal(books);
}