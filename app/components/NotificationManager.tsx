
'use client';
import { useEffect } from 'react';

// Minimal NotificationManager for FCM: just requests permission if needed
export default function NotificationManager() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission();
            }
        }
    }, []);
    return null;
}
