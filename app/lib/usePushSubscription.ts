import { useEffect, useState } from "react";

export function usePushSubscription(vapidPublicKey: string) {
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [permission, setPermission] = useState(Notification.permission);

    useEffect(() => {
        if (typeof window === "undefined" || !('serviceWorker' in navigator) || !('PushManager' in window)) return;
        navigator.serviceWorker.ready.then(async (reg) => {
            setPermission(Notification.permission);
            if (Notification.permission !== "granted") return;
            const existing = await reg.pushManager.getSubscription();
            if (existing) {
                setSubscription(existing);
                return;
            }
            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });
            setSubscription(sub);
        });
    }, [vapidPublicKey]);

    return { subscription, permission };
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
