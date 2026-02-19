
"use client"
import { useEffect, useState } from "react";

export function usePushSubscription(vapidPublicKey: string) {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [permission, setPermission] = useState(
        typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
    );

    useEffect(() => {
        if (
            typeof window === "undefined" ||
            !('serviceWorker' in navigator) ||
            !('PushManager' in window) ||
            !vapidPublicKey
        ) return;

        setPermission(Notification.permission);

        (async () => {
            try {
                const reg = await navigator.serviceWorker.ready;
                if (Notification.permission !== "granted") return;
                const existing = await reg.pushManager.getSubscription();
                if (existing) {
                    setSubscription(existing);
                    console.log('Push subscription already exists:', existing);
                    return;
                }
                // Convert VAPID key to Uint8Array and validate
                let appServerKey: Uint8Array | null = null;
                try {
                    appServerKey = urlBase64ToUint8Array(vapidPublicKey);
                } catch (e) {
                    console.error('Invalid VAPID public key format', e);
                    return;
                }
                if (!appServerKey || !(appServerKey instanceof Uint8Array)) {
                    console.error('VAPID key conversion failed');
                    return;
                }
                const sub = await reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: appServerKey as BufferSource,
                });
                setSubscription(sub);
                console.log('Push subscription successful:', sub);
            } catch (e) {
                console.error('Push subscription failed', e);
            }
        })();
    }, [vapidPublicKey]);

    return { subscription, permission };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    let rawData = "";
    if (typeof window !== "undefined") {
        rawData = window.atob(base64);
    }
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
