'use client';

import { useState, useEffect } from 'react';
import BroadcastsSection from '../../components/BroadcastsSection';

export default function BroadcastsPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    return <BroadcastsSection isDark={isDark} />;
}
