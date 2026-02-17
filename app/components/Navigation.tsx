
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronUp, ChevronDown, Package, CheckCircle, MessageSquare, UserCheck } from "lucide-react";

export default function Navigation() {
    const pathname = usePathname();
    const [showMobileNav, setShowMobileNav] = useState(true);

    const navItems = [
        { href: "/schedule", label: "Schedule", icon: Package },
        { href: "/daily-status", label: "Daily Status", icon: CheckCircle },
        { href: "/follow-ups", label: "Follow-Ups", icon: UserCheck },
        { href: "/templates", label: "Templates", icon: MessageSquare },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-50 bg-gray-900 shadow-md">
                <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg bg-white">
                            <img src="/Icon.png" alt="App Logo" className="object-contain w-full h-full" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Sales Assistant</h1>
                    </div>
                    {/* Hide/Show button always visible */}
                    <button
                        onClick={() => setShowMobileNav((v) => !v)}
                        className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold bg-gray-800 text-white hover:bg-purple-900 transition-all shadow-sm"
                        aria-label={showMobileNav ? "Hide menu" : "Show menu"}
                    >
                        {showMobileNav ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        {showMobileNav ? "Hide" : "Show"}
                    </button>
                </div>
                {/* Collapsible nav grid for mobile only */}
                <nav
                    className={`transition-all duration-300 ease-in-out bg-gray-900 px-4 border-t border-gray-800 lg:hidden ${showMobileNav ? "py-4 max-h-[500px] opacity-100" : "py-0 max-h-0 opacity-0 overflow-hidden"}`}
                    aria-label="Main navigation"
                >
                    <div className="grid grid-cols-2 gap-3">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center justify-center gap-2.5 py-5 px-4 rounded-2xl font-bold transition-all shadow-sm ${isActive(item.href)
                                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105"
                                        : "text-gray-300 bg-gray-800 hover:bg-gray-700 hover:shadow-md active:scale-95"
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
            <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 lg:border-r bg-gray-900 border-gray-800 shadow-xl">
                {/* Logo/Title */}
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg bg-white">
                            <img src="/Icon.png" alt="App Logo" className="object-contain w-full h-full" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Sales Assistant</h1>
                    </div>
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
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                }`}
                            >
                                <Icon size={24} strokeWidth={2.5} />
                                <span className="text-base">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                {/* Footer */}
                <div className="p-6 border-t border-gray-700 text-gray-400">
                    <p className="text-sm text-center">Made for Nigerian SME Owners 🇳🇬</p>
                    <p className="text-xs text-center mt-2 opacity-70">All data saved locally</p>
                </div>
            </aside>
        </>
    );
}