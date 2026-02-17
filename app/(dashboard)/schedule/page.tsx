'use client';

import { useState, useEffect } from 'react';
import ScheduleSection from '../../components/ScheduleSection';

export default function SchedulePage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    return <ScheduleSection isDark={isDark} />;
}
