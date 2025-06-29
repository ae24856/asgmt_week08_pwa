import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost';
import { HashRouter } from 'react-router-dom';  

// 建立 Apollo Client
const client = new ApolloClient({
  uri: 'https://localhost/graphql',
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <HashRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
    </HashRouter>
  // </React.StrictMode>
);

// 2. 再註冊 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker 註冊成功:', registration);
        if (registration.installing) {
          console.log('Service Worker 正在安裝...');
        } else if (registration.waiting) {
          console.log('Service Worker 已安裝，等待生效...');
        } else if (registration.active) {
          console.log('Service Worker 已啟動');
        }
      })
      .catch(error => {
        console.error('Service Worker 註冊失敗:', error);
      });
  });
} else {
  console.warn('此瀏覽器不支援 Service Worker');
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
