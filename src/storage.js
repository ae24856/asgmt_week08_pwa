// storage.js
import { openDB } from 'idb';

const DB_NAME = 'book-db';
const STORE_NAME = 'books';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

// 一次存整包書籍（通常用在初次同步）
export async function saveBooksIdb(books) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  books.forEach(book => store.put(book));
  await tx.done;
}

// 單本新增（對應 addBook）
export async function addBookIdb(book) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).put(book);
  await tx.done;
}

// 單本刪除（對應 deleteBook）
export async function deleteBookIdb(id) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).delete(id);
  await tx.done;
}

// 單本更新（可直接重複使用 saveBook()）
export async function updateBookIdb(book) {
  return addBookIdb(book); // 因為 put() 本身支援更新
}

// 讀取所有書籍（通常在離線時呼叫）
export async function getBooks() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

