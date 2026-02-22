importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration (SAME as in lib/firebase.js)
firebase.initializeApp({
    apiKey: "AIzaSyArADkbbCD1gpteT72vKnrIKlYJIfEcPmk",
    authDomain: "sales-assistant-83e06.firebaseapp.com",
    projectId: "sales-assistant-83e06",
    storageBucket: "sales-assistant-83e06.firebasestorage.app",
    messagingSenderId: "257652607056",
    appId: "1:257652607056:web:56c4c08761c1c0d4f2a955"
});

const messaging = firebase.messaging();

// Handle background messages (app is closed or in background)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new message',
        icon: payload.notification?.icon || '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: 'notification-1',
        requireInteraction: false,
        data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification clicked:', event);

    event.notification.close();

    // Open the app when notification is clicked
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});
