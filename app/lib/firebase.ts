import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyArADkbbCD1gpteT72vKnrIKlYJIfEcPmk",
    authDomain: "sales-assistant-83e06.firebaseapp.com",
    projectId: "sales-assistant-83e06",
    storageBucket: "sales-assistant-83e06.firebasestorage.app",
    messagingSenderId: "257652607056",
    appId: "1:257652607056:web:56c4c08761c1c0d4f2a955"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

const VAPID_KEY = "BLCb1xr7I43OKVJO7gxupjY7o0bN0kAZporUyG6k4OcpwMVU0VRrttTwIYHQO3kvKQIaWcaKtWdhvGFEJvj3uzw";

export async function requestNotificationPermission(): Promise<string | null> {
    if (!messaging || typeof window === 'undefined') return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return null;
        }

        // Register the service worker with updateViaCache: 'none'
        const swRegistration = await navigator.serviceWorker.register(
            '/firebase-messaging-sw.js',
            { scope: '/', updateViaCache: 'none' }
        );
        // Force immediate activation if there's a waiting worker
        if (swRegistration.waiting) {
            swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        await navigator.serviceWorker.ready;
        // Pass swRegistration so FCM links the token to your background handler
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: swRegistration,
        });

        if (token) {
            console.log('FCM Token:', token);
            return token;
        } else {
            console.log('No registration token available');
            return null;
        }
    } catch (error) {
        console.error('Error getting FCM token:', error);
        return null;
    }
}

export function onForegroundMessage(
    callback: (payload: { notification?: { title?: string; body?: string; icon?: string } }) => void
): () => void {
    if (!messaging) return () => { };
    return onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        callback(payload);
    });
}

export { messaging };