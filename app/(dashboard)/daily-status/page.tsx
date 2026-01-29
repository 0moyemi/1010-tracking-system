'use client';

import { useState, useEffect } from 'react';
import DailyStatusSection from '../../components/DailyStatusSection';

export default function DailyStatusPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    return <DailyStatusSection isDark={isDark} />;
}
