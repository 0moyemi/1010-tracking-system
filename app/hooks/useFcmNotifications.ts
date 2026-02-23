import { useEffect, useState } from 'react';
import { requestNotificationPermission, onForegroundMessage } from '../lib/firebase';

export function useFcmNotifications() {
    const [token, setToken] = useState<string | null>(null);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setPermission(Notification.permission);
        // Listen for foreground messages
        const unsubscribe = onForegroundMessage((payload) => {
            setLastMessage(payload.notification || null);
        });
        return () => unsubscribe();
    }, []);

    const enableNotifications = async () => {
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
            setToken(fcmToken);
            setPermission('granted');
            // Optionally send token to server here
        } else {
            setPermission(Notification.permission);
        }
    };

    return {
        token,
        permission,
        lastMessage,
        enableNotifications,
    };
}
