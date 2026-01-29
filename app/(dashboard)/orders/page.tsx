'use client';

import { useState, useEffect } from 'react';
import OrdersSection from '../../components/OrdersSection';

export default function OrdersPage() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    return <OrdersSection isDark={isDark} />;
}
