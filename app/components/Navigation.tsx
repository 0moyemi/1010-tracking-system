'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Package,
    CheckCircle,
    Radio,
    MessageSquare,
    UserCheck,
    Sun,
    Moon
} from 'lucide-react';

interface NavigationProps {
    isDark: boolean;
    toggleTheme: () => void;
}

export default function Navigation({ isDark, toggleTheme }: NavigationProps) {
    const pathname = usePathname();

    const navItems = [
        { href: '/orders', label: 'Orders', icon: Package },
        { href: '/daily-status', label: 'Daily Status', icon: CheckCircle },
        { href: '/follow-ups', label: 'Follow-Ups', icon: UserCheck },
        { href: '/templates', label: 'Templates', icon: MessageSquare },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Header */}
            <header className={`lg:hidden sticky top-0 z-50 ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-md`}>
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-[#081F44] to-blue-700'} flex items-center justify-center shadow-lg`}>
                            <Package size={22} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                            Business Tracker
                        </h1>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-all shadow-sm hover:shadow-md active:scale-95`}
                        aria-label="Toggle theme"
                    >
                        {isDark ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}
                    </button>
                </div>

                {/* Pill Navigation - Always visible, no dropdown needed */}
                <nav className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} px-4 py-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-2 gap-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center gap-2.5 py-5 px-4 rounded-2xl font-bold transition-all shadow-sm ${isActive(item.href)
                                        ? isDark
                                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                                            : 'bg-gradient-to-br from-[#081F44] to-blue-700 text-white shadow-lg scale-105'
                                        : isDark
                                            ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 hover:shadow-md active:scale-95'
                                            : 'text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md border border-gray-200 active:scale-95'
                                        }`}
                                >
                                    <Icon size={32} strokeWidth={2.5} />
                                    <span className="text-xs leading-tight text-center">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </header>

            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 lg:border-r ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                } shadow-xl`}>
                {/* Logo/Title */}
                <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-[#081F44] to-blue-700'} flex items-center justify-center shadow-lg`}>
                            <Package size={26} className="text-white" strokeWidth={2.5} />
                        </div>
                        <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                            Business Tracker
                        </h1>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`w-full p-3 rounded-xl ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md`}
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <>
                                <Sun size={20} strokeWidth={2.5} />
                                <span className="text-sm">Light Mode</span>
                            </>
                        ) : (
                            <>
                                <Moon size={20} strokeWidth={2.5} />
                                <span className="text-sm">Dark Mode</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-5 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-semibold transition-all ${isActive(item.href)
                                    ? isDark
                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                        : 'bg-gradient-to-r from-[#081F44] to-blue-700 text-white shadow-lg'
                                    : isDark
                                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#081F44]'
                                    }`}
                            >
                                <Icon size={24} strokeWidth={2.5} />
                                <span className="text-base">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={`p-6 border-t ${isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
                    <p className="text-sm text-center">
                        Made for Nigerian SME Owners 🇳🇬
                    </p>
                    <p className="text-xs text-center mt-2 opacity-70">
                        All data saved locally
                    </p>
                </div>
            </aside>
        </>
    );
}
