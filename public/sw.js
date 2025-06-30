/* eslint-disable no-restricted-globals */

// 定義快取版本名稱，當需要更新快取時可以更改版本號
const CACHE_NAME = 'book-app-cache-v1';

// 定義需要預先快取的重要資源列表
// 這些是應用程式運行所必需的檔案，會在 Service Worker 安裝時立即快取
const urlsToCache = [
  './',
  './index.html',
  './manifest.json', // PWA 清單檔案
  './icon-512.png' // 應用程式圖示
];

// 監聽 Service Worker 的 'install' 事件
// 此事件在 Service Worker 首次安裝或有新版本時觸發
self.addEventListener('install', event => {
  console.log('Service Worker 正在安裝...');
  
  // event.waitUntil() 確保 Service Worker 在快取操作完成前不會被終止
  event.waitUntil(
    // 開啟指定名稱的快取空間
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('快取空間已開啟:', CACHE_NAME);
        // 將所有指定的檔案一次性加入快取
        // 如果任何一個檔案載入失敗，整個操作都會失敗
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('所有重要檔案已成功快取');
        // 強制新的 Service Worker 立即啟動，跳過等待階段
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('快取操作失敗:', error);
      })
  );
});

// 監聽 Service Worker 的 'activate' 事件
// 此事件在 Service Worker 啟動時觸發，通常用於清理舊快取
self.addEventListener('activate', event => {
  console.log('Service Worker 已啟動');
  
  event.waitUntil(
    // 獲取所有快取名稱
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果發現不是當前版本的快取，就刪除它
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即接管所有已打開的頁面
      return self.clients.claim();
    })
  );
});

// 監聽所有網路請求的 'fetch' 事件
// 這是 Service Worker 的核心功能：攔截和處理網路請求
self.addEventListener('fetch', event => {
  // 只處理 GET 請求，忽略 POST、PUT 等其他類型的請求
  if (event.request.method !== 'GET') {
    return;
  }
  
  // 使用 respondWith() 自定義回應
  event.respondWith(
    // 首先嘗試從快取中尋找匹配的請求
    caches.match(event.request)
      .then(cachedResponse => {
        // 如果在快取中找到匹配的回應
        if (cachedResponse) {
          console.log('從快取提供:', event.request.url);
          return cachedResponse;
        }
        
        // 如果快取中沒有，發出實際的網路請求
        console.log('從網路載入:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // 檢查回應是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 複製回應，因為回應是一次性的流
            const responseToCache = response.clone();
            
            // 將新的回應加入快取（動態快取）
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('網路請求失敗:', error);
            // 可以在這裡返回一個離線頁面或預設內容
            throw error;
          });
      })
  );
});

// 監聽訊息事件，允許主頁面與 Service Worker 通訊
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    // 收到跳過等待的訊息時，立即啟動新的 Service Worker
    self.skipWaiting();
  }
});