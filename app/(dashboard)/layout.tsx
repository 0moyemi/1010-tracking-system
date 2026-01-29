'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Radio, X } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isDark, setIsDark] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Load dark mode preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    // Save dark mode preference
    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Navigation isDark={isDark} toggleTheme={toggleTheme} />

            {/* Main Content Area */}
            <main className="lg:pl-72">
                <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    {children}
                </div>
            </main>
        </div>
    );
}
