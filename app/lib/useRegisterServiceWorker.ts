'use client'
import { useEffect } from "react";

export function useRegisterServiceWorker() {
    useEffect(() => {
        if (typeof window === "undefined" || !('serviceWorker' in navigator)) return;
        // Removed: legacy service worker registration for sw.js (now using Firebase messaging SW)
    }, []);
}
