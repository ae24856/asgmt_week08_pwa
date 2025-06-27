# 📚 BookList App
A modern React-based book catalog app with tag filtering, search, and detail viewing. Integrates with a custom GraphQL backend using Apollo Client.

## 🚀 Features
 - View book collection with cover, description, and tags
 - Real-time search and tag filtering
 - Book detail pages with routing via react-router-dom
 - Add new books via a form (with validation)
 - Apollo Client integration for GraphQL queries & mutations
 - Supports JSON server mock or real DB backend

## 🖼️ Demo

 This is a demo image. Please adopt books and ideas with love. 💛

## ⚙️ Technologies Used
  - Frontend	Backend
  - React + MUI	FastAPI + Strawberry GraphQL
  - React Router	JSON Server / Mock DB
  - Apollo Client	CORS Middleware
  - JSX + Vite	UUID for ID generation

## 📁 Project Structure
```
  booklist-app/
  ├── public/
  │   └── img/         # Book cover images
  ├── src/
  │   ├── components/  # Reusable UI components
  │   ├── BookList.js
  │   ├── BookDetail.js
  │   ├── BookForm.js
  │   ├── BookContext.js
  │   └── App.js
  └── server/
      ├── main.py      # FastAPI + GraphQL backend
      └── db.json      # Mock database (optional)
```
## 🧪 Example Queries
 - GraphQL Sample: Get Book by ID
```query($bookId: ID!) {
  book(id: $bookId) {
    title
    author
    img
    description
    tags
  }
}
```
- Mutation: Add Book
```
mutation {
  addBook(input: {
    title: "新書名",
    author: "作者名稱",
    isbn: "123456",
    description: "簡介內容",
    coverImage: "/img/book.jpg",
    tags: ["奇幻", "冒險"]
  }) {
    id
    title
  }
}
```
## 📦 Setup Instructions
1. Backend
  ```
  cd server/
  python main.py
  Runs at http://localhost:8000/graphql.
  ```
2. Frontend (React + Vite)
  ```
  cd booklist-app/
  npm install
  npm run dev
  Runs at http://localhost:5173/ (or as configured).
  ```

### 遇到的挑戰：
1. 寫在後端的假資料，原本用物件的方式寫，沒辦法透過 GraphQL 看到
- 解決方式：格式要寫成 json 格式


README.md 說明文件：
專案簡介。
技術架構說明。
如何安裝與執行專案。
遇到的挑戰與解決方案。
未來展望（可選）。
Demo 網站連結（如果有的話）。


