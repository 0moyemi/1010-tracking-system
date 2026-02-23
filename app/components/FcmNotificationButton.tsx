'use client'

import { useState, useEffect } from 'react';
import { requestNotificationPermission, onForegroundMessage } from '../lib/firebase';

type NotificationStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'error';
type NotificationPayload = { title?: string; body?: string; icon?: string };

export default function FcmNotificationButton() {
    const [token, setToken] = useState<string | null>(null);
    const [status, setStatus] = useState<NotificationStatus>('idle');
    const [message, setMessage] = useState<NotificationPayload | null>(null);

    useEffect(() => {
        const unsubscribe = onForegroundMessage((payload) => {
            console.log('Foreground message:', payload);
            setMessage(payload.notification || null);

            // FCM suppresses UI when tab is active — we show it manually
            if (Notification.permission === 'granted') {
                navigator.serviceWorker.ready.then((reg) => {
                    reg.showNotification(
                        payload.notification?.title || 'New Message',
                        {
                            body: payload.notification?.body || 'You have a notification',
                            icon: payload.notification?.icon || '/android-chrome-192x192.png',
                            badge: '/badge-72x72.png',
                        }
                    );
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const enableNotifications = async () => {
        setStatus('loading');
        try {
            const fcmToken = await requestNotificationPermission();
            if (fcmToken) {
                setToken(fcmToken);
                setStatus('granted');
                await fetch('/api/save-fcm-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: fcmToken }),
                });
            } else {
                setStatus('denied');
            }
        } catch {
            setStatus('error');
        }
    };

    if (status === 'granted') {
        return (
            <div style={{ padding: 20, border: '1px solid green', borderRadius: 8 }}>
                <h3>✅ Notifications Enabled</h3>
                <p style={{ fontSize: 12, wordBreak: 'break-all' }}>Token: {token?.substring(0, 50)}...</p>
                {message && (
                    <div style={{ marginTop: 10, padding: 10, background: '#f0f0f0' }}>
                        <strong>Last message:</strong> {message.title} — {message.body}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
            <h3>Push Notifications</h3>
            {status === 'denied' && <p style={{ color: 'red' }}>Permission denied. Enable in browser settings.</p>}
            {status === 'error' && <p style={{ color: 'red' }}>Error occurred. Try again.</p>}
            <button
                onClick={enableNotifications}
                disabled={status === 'loading'}
                style={{ padding: '10px 20px', fontSize: 16, cursor: 'pointer', background: '#0070f3', color: 'white', border: 'none', borderRadius: 5 }}
            >
                {status === 'loading' ? 'Enabling...' : 'Enable Push Notifications'}
            </button>
        </div>
    );
}