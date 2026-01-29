'use client';

import { useState, useEffect } from 'react';
import FollowUpsSection from '../../components/FollowUpsSection';

export default function FollowUpsPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    return <FollowUpsSection isDark={isDark} />;
}
