'use client';

import { useEffect } from 'react';

const NOTIF_PERMISSION_KEY = 'notificationPermissionAsked';
const DEVICE_ID_KEY = 'deviceId';

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    let rawData = "";
    if (typeof window !== "undefined") {
        rawData = window.atob(base64);
    }
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const getDeviceId = () => {
    let deviceId = "";
    if (typeof window !== "undefined") {
        const storedId = window.localStorage.getItem(DEVICE_ID_KEY);
        deviceId = storedId ?? "";
        if (!deviceId) {
            deviceId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
            window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
        }
    }
    return deviceId;
};

export default function NotificationManager() {
    useEffect(() => {
        if (typeof window === "undefined" || !('Notification' in window)) return;

        const asked = window.localStorage.getItem(NOTIF_PERMISSION_KEY);
        if (window.Notification.permission === 'default' && !asked) {
            window.localStorage.setItem(NOTIF_PERMISSION_KEY, 'true');
            window.Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (typeof window === "undefined" || !('Notification' in window) || !('serviceWorker' in navigator)) return;

        const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        if (!publicKey) return;

        const syncData = async (deviceId: string) => {
            const followUps = JSON.parse(localStorage.getItem('followUps') || '[]');
            const dailyStatus = JSON.parse(localStorage.getItem('dailyStatus') || '[]');
            const broadcasts = JSON.parse(localStorage.getItem('broadcasts') || '[]');

            await fetch('/api/push/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId, followUps, dailyStatus, broadcasts }),
            });
        };

        const subscribeForPush = async () => {
            if (Notification.permission !== 'granted') return;

            const registration = await navigator.serviceWorker.ready;
            const deviceId = getDeviceId();
            const existing = await registration.pushManager.getSubscription();
            const subscription = existing || await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicKey),
            });

            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deviceId, subscription }),
            });

            await syncData(deviceId);
        };

        subscribeForPush();

        const handleStorage = () => {
            if (Notification.permission !== 'granted') return;
            const deviceId = getDeviceId();
            syncData(deviceId);
        };

        window.addEventListener('storage', handleStorage);
        const interval = setInterval(handleStorage, 5 * 60 * 1000);

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    return null;
}
