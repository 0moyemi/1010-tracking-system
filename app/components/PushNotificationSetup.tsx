"use client"
import { useRegisterServiceWorker } from "../lib/useRegisterServiceWorker";
import { usePushSubscription } from "../lib/usePushSubscription";
import { useEffect, useState } from "react";

export function PushNotificationSetup() {
    useRegisterServiceWorker();
    const [vapidKey, setVapidKey] = useState("");
    const { subscription, permission } = usePushSubscription(vapidKey);

    useEffect(() => {
        // Fetch VAPID public key from backend
        fetch("/api/push/public-key")
            .then(res => res.json())
            .then(data => {
                if (data.publicKey) setVapidKey(data.publicKey);
            });
    }, []);

    useEffect(() => {
        // Generate or retrieve deviceId
        let deviceId = "";
        if (typeof window !== "undefined") {
            deviceId = localStorage.getItem("deviceId") || "";
            if (!deviceId) {
                deviceId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
                localStorage.setItem("deviceId", deviceId);
            }
        }
        // Log the VAPID key before subscribing
        console.log('VAPID key:', vapidKey);
        // Send subscription to backend when permission is granted
        if (permission === "granted" && subscription && deviceId) {
            fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deviceId, subscription }),
            });
        }
    }, [permission, subscription, vapidKey]);

    // Removed: legacy push notification setup no longer needed with FCM.
}
