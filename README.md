# ![dog](/public/icon-1.jpg) My Pocket BookList App

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

  ![demo](./public/img/demo.gif)

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

- ```javascript
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
BookForm 元件的 Btn 按下送出 → 只改了 React 的狀態（畫面更新）<br>
❌ 但沒有把資料送到後端

- 解決方式：繼續增加後續流程 <br>
前端 → GraphQL 請求 → GraphQL Server → API 請求 → json-server

3. 本地開發環境 → 資料會寫進 json-server <br> PWA 離線環境 → 資料會存到 localStorage，ID 是 offline-*

- 在 PWA 離線時新增了書籍，切回本地開發模式後：<br>
❌ 新增的離線書籍（id: offline-*）不會寫回伺服器，也不會繼續出現在畫面上

- 解決方式：找到 offline-開頭的離線書籍 → 送出 mutation，同步到 server → 合併書籍列表 → 更新狀態與本地快取

## 未來展望

- 手機版可以存成 PWA，並在本地端開發時可以新增書籍書籍，但無法連進去 graphql、也沒有辦法離線使用
- 書封圖片上傳
- 使用者認證
- 單元測試
