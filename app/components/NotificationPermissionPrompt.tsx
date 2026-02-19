'use client'
import { useEffect, useState } from "react";

export default function NotificationPermissionPrompt() {
    const [visible, setVisible] = useState(false);
    const [permission, setPermission] = useState(
        typeof window !== "undefined" && typeof Notification !== "undefined" ? Notification.permission : "default"
    );

    useEffect(() => {
        if (typeof window === "undefined" || typeof Notification === "undefined") return;
        if (Notification.permission === "default") {
            setVisible(true);
        }
    }, []);

    const handleRequest = () => {
        setVisible(false);
        if (typeof window !== "undefined" && typeof Notification !== "undefined") {
            Notification.requestPermission().then((perm) => {
                setPermission(perm);
                if (perm === "granted") {
                    alert("Notifications enabled! You'll never miss a reminder.");
                } else {
                    alert("Notifications are disabled. You can enable them in your browser settings.");
                }
            });
        }
    };

    if (!visible || permission !== "default") return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm mx-auto shadow-2xl text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enable Notifications</h3>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                    Get daily reminders and schedule alerts, even when the app is closed.
                </p>
                <button
                    onClick={handleRequest}
                    className="w-full py-3 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-98 bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Turn On Notifications
                </button>
            </div>
        </div>
    );
}
