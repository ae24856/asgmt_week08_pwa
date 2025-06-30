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
  │   ├── BookContext.js  │ 
  │   └── App.js
  ├──── server.pjs      #  GraphQL backend
  └──── db.json      # Mock database
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
2. 新增、編輯、刪除沒有同步到後端
- 目前的操作流程是：
BookForm 元件的 Btn 按下送出 →
直接 dispatch({ type: 'ADD_BOOK', payload: book }) →
✅ 只改了 React 的狀態（畫面更新）
❌ 但沒有把資料送到後端


前端 React
  ↓ GraphQL 請求
GraphQL Server (apollo-server-express)
  ↓ REST API 請求
json-server (資料儲存在 db.json)


手機沒有資料酷東西
server.listen({ host: '0.0.0.0', port: 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});


README.md 說明文件：
專案簡介。
技術架構說明。
如何安裝與執行專案。
遇到的挑戰與解決方案。
未來展望（可選）。
Demo 網站連結（如果有的話）。


