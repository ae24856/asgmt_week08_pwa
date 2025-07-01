# ![dog](/public/icon.jpg) My Pocket BookList App

是不是常常想：「這本書看起來不錯，下次一定要讀」，
這是一個風格為狗狗的書籍收藏小天地！
React 小應用幫你把想看的書通通收集起來，方便搜尋、分類，還能看到每本書的封面和詳細介紹。

## 🏗️ 技術架構說明

### 前端

- 使用 React + Material UI
- 使用 Apollo Client 實現對 GraphQL API 的查詢 (Query) 與變更 (Mutation)
- 採用 Context + Reducer 管理書籍資料狀態，方便集中控管與資料快取
- 支援 PWA 離線模式，利用 localStorage 做離線資料快取及離線 CRUD

### 後端

- 自訂 GraphQL 伺服器
- 支援書籍資料的查詢、建立、修改與刪除功能
- 可接真實資料庫或用 JSON Server 模擬資料，方便開發與測試

### 資料同步策略

- 在開發環境或網路良好時，前端透過 GraphQL API 取得最新資料
- PWA 或離線狀態時，資料由 localStorage 快取提供，並能離線新增、修改、刪除書籍
- 重新連線時會自動同步離線變更，確保資料一致性，但目前只有新增書籍會同步

## 🖼️ Demo

 This is a demo image. Please adopt books and ideas with love. 💛

## 📁 Project Structure

```text
  booklist-app/
  ├── public/
  │   └── img/        # Book cover images
  ├── src/
  │   ├── components/ # Reusable UI components
  │   ├── BookList.js
  │   ├── BookDetail.js
  │   ├── BookForm.js
  │   ├── BookContext.js
  │   └── App.js
  ├──── server.js     # GraphQL backend
  └──── db.json       # Mock database
```

## 📦 Setup Instructions

### Backend

   ```bash
   node server.js
   ```

  Runs at `http://localhost:4000/graphql`.
  
### 啟動 JSON Server（模擬資料）

  ```bash
  npm run json-server
  ```

  Runs at `http://localhost:5500/`.

### Frontend

  ```bash
  npm install
  npm run dev
  ```

Runs at `http://localhost:3000/`.

### 遇到的挑戰

1. 寫在後端的假資料，原本用物件的方式寫，沒辦法透過 GraphQL 看到

```javascript
{
  id: "1",
  title: "哈利波特"
}
```

- 解決方式：格式要寫成 json 格式

```javascript
{
  "id": "1",
  "title": "哈利波特"
}
```

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

2. 所以你這邊的 if 判斷就是：
如果是本地開發、非 PWA，且 GraphQL 回來有資料，
則把 GraphQL 讀到的書籍放到 store，並快取到 localStorage。

否則，代表是 PWA 模式、或正式環境，
直接從 localStorage 讀資料，避免依賴網路。

## 未來展望

手機

Demo 網站連結（如果有的話）
