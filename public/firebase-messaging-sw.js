// Force SW to activate and take control immediately
self.addEventListener('install', (event) => {
    console.log('[firebase-messaging-sw.js] Installing...');
    self.skipWaiting();
});
self.addEventListener('activate', (event) => {
    console.log('[firebase-messaging-sw.js] Activated');
    event.waitUntil(self.clients.claim());
});

// Listen for all push events for debugging
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Raw push received:', event.data?.text());
});
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyArADkbbCD1gpteT72vKnrIKlYJIfEcPmk",
    authDomain: "sales-assistant-83e06.firebaseapp.com",
    projectId: "sales-assistant-83e06",
    storageBucket: "sales-assistant-83e06.firebasestorage.app",
    messagingSenderId: "257652607056",
    appId: "1:257652607056:web:56c4c08761c1c0d4f2a955"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message:', payload);

    const title = payload.notification?.title || 'New Notification';
    const options = {
        body: payload.notification?.body || 'You have a new message',
        icon: payload.notification?.icon || '/android-chrome-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'fcm-notification',
        data: payload.data || {}
    };

    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});