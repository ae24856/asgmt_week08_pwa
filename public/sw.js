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