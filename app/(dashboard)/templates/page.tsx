'use client';

import { useState, useEffect } from 'react';
import ShortcutTemplatesSection from '../../components/ShortcutTemplatesSection';

export default function TemplatesPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    return <ShortcutTemplatesSection isDark={isDark} />;
}
