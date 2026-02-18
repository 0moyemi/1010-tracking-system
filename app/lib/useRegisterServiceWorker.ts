'use client'
import { useEffect } from "react";

export function useRegisterServiceWorker() {
    useEffect(() => {
        if (typeof window === "undefined" || !('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register('/sw.js');
    }, []);
}
