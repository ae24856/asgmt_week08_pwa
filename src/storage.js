export function saveBookLocal(books) {
  console.log('儲存書籍到 localStorage', books);
  try {
    localStorage.setItem('pocket_books', JSON.stringify(books));
  } catch (e) {
    console.error('儲存書籍到 localStorage 失敗:', e);
  }
}

export function getBookLocal() {
  try {
    const booksJson = localStorage.getItem('pocket_books');
    return booksJson ? JSON.parse(booksJson) : [];
  } catch (e) {
    console.error('從 localStorage 讀取書籍失敗:', e);
    return [];
  }
}

export function addBookLocal(book) {
  const books = getBookLocal();
  console.log('[addBookLocal] 目前 localStorage 內容:', books);
  books.push(book);
  console.log('[addBookLocal] 新增書籍:', book);
  saveBookLocal(books);
}

export function deleteBookLocal(id) {
  const books = getBookLocal();
  // 移除指定 id 的書
  const filterBooks = books.filter(book => book.id !== id); 
  saveBookLocal(filterBooks);
}

export function updateBookInLocal(updatedBook) {
  const books = getBookLocal();
  // 把每本書拿出來檢查，只要 id 一樣，就換成新的 updatedBook，其他保持原樣。
  const updatedBooks = books.map(book =>
    book.id === updatedBook.id ? updatedBook : book
  );
  saveBookLocal(updatedBooks);
}