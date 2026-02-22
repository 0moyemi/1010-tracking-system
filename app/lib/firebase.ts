import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyArADkbbCD1gpteT72vKnrIKlYJIfEcPmk",
    authDomain: "sales-assistant-83e06.firebaseapp.com",
    projectId: "sales-assistant-83e06",
    storageBucket: "sales-assistant-83e06.firebasestorage.app",
    messagingSenderId: "257652607056",
    appId: "1:257652607056:web:56c4c08761c1c0d4f2a955"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize messaging
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// Function to request permission and get FCM token
export async function requestNotificationPermission(
    vapidKey: string = "BLCb1xr7I43OKVJO7gxupjY7o0bN0kAZporUyG6k4OcpwMVU0VRrttTwIYHQO3kvKQIaWcaKtWdhvGFEJvj3uzw"
): Promise<string | null> {
    if (!messaging) return null;
    try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log('Notification permission denied');
            return null;
        }
        // Get FCM token
        const token = await getToken(messaging, {
            vapidKey: vapidKey // VAPID key for web push
        });
        if (token) {
            console.log('FCM Token:', token);
            return token;
        } else {
            console.log('No registration token available');
            return null;
        }
    } catch (error) {
        console.error('Error getting permission:', error);
        return null;
    }
}

// Listen to foreground messages (when app is open)
export function onForegroundMessage(
    callback: (payload: { notification?: { title?: string; body?: string; icon?: string } }) => void
): () => void {
    if (!messaging) return () => { };
    return onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);
        callback(payload);
    });
}

export { messaging };