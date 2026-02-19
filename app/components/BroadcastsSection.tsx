'use client';

import { useState, useEffect } from 'react';
import { Radio, Send, Clock, CheckCircle } from 'lucide-react';

// Broadcast record structure
interface BroadcastRecord {
    id: string;
    date: string;
    checked: boolean;
}

type BroadcastsSectionProps = {
    isDark?: boolean;
};

export default function BroadcastsSection({ isDark = false }: BroadcastsSectionProps) {
    const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);
    const [canBroadcast, setCanBroadcast] = useState(false);

    // Function to check if broadcast is allowed
    const checkBroadcastAvailability = () => {
        const savedDailyStatus = localStorage.getItem('dailyStatus');
        if (!savedDailyStatus) {
            setCanBroadcast(false);
            return;
        }

        const dailyStatus = JSON.parse(savedDailyStatus);
        const today = new Date().toISOString().split('T')[0];
        const todayIndex = dailyStatus.findIndex((d: any) => d.date === today);

        if (todayIndex < 5) {
            setCanBroadcast(false);
            return;
        }

        const isBroadcastDay = (todayIndex + 1) % 6 === 0;
        if (!isBroadcastDay) {
            setCanBroadcast(false);
            return;
        }

        const last6Days = dailyStatus.slice(Math.max(0, todayIndex - 5), todayIndex + 1);
        const allTicked = last6Days.every((d: any) => d.checked);
        if (!allTicked) {
            setCanBroadcast(false);
            return;
        }

        const alreadyBroadcasted = broadcasts.some(b => b.date === today && b.checked);
        if (alreadyBroadcasted) {
            setCanBroadcast(false);
            return;
        }

        const recentBroadcast = broadcasts.find(b => {
            const broadcastIndex = dailyStatus.findIndex((d: any) => d.date === b.date);
            return broadcastIndex !== -1 && broadcastIndex > todayIndex - 6 && broadcastIndex < todayIndex;
        });

        setCanBroadcast(!recentBroadcast);
    };

    // Load broadcasts and check if user can broadcast
    useEffect(() => {
        const savedBroadcasts = localStorage.getItem('broadcasts');

        if (savedBroadcasts) {
            const loaded = JSON.parse(savedBroadcasts);
            setBroadcasts(loaded);
        }
    }, []);

    useEffect(() => {
        // Initial check
        checkBroadcastAvailability();

        // Set up polling to check every 2 seconds for changes
        const interval = setInterval(() => {
            checkBroadcastAvailability();
        }, 2000);

        // Also listen for storage events (works across tabs)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'dailyStatus') {
                checkBroadcastAvailability();
            }
        };
        if (typeof window !== "undefined") {
            window.addEventListener('storage', handleStorageChange);
        }

        // Cleanup
        return () => {
            clearInterval(interval);
            if (typeof window !== "undefined") {
                window.removeEventListener('storage', handleStorageChange);
            }
        };
    }, [broadcasts]);


    // Auto-save broadcasts
    useEffect(() => {
        if (broadcasts.length > 0) {
            localStorage.setItem('broadcasts', JSON.stringify(broadcasts));
        }
    }, [broadcasts]);

    // Add broadcast for today
    const addBroadcast = () => {
        const today = new Date().toISOString().split('T')[0];

        // Check if already broadcasted today
        const alreadyBroadcasted = broadcasts.find(b => b.date === today && b.checked);
        if (alreadyBroadcasted) {
            alert('You have already marked a broadcast for today!');
            return;
        }

        const newBroadcast: BroadcastRecord = {
            id: Date.now().toString(),
            date: today,
            checked: true
        };

        setBroadcasts([newBroadcast, ...broadcasts]);
        setCanBroadcast(false);

        // Trigger event to notify daily status to recalculate
        window.dispatchEvent(new Event('broadcastMarked'));
    };

    // Format date for display
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Section Title - Sticky */}
            <div className={`sticky top-0 z-10 pb-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <Radio size={32} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                        Broadcasts
                    </h2>
                </div>

                {/* Instructions */}
                <div className={`p-5 rounded-xl mb-6 border-2 ${isDark ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-gradient-to-r from-purple-600 to-purple-700'} shadow-lg`}>
                    <div className="flex items-start gap-3">
                        <Radio size={24} className="text-purple-200 flex-shrink-0 mt-1" />
                        <div>
                            <p className="text-white text-base leading-relaxed">
                                <strong className="text-lg">Broadcast Rules:</strong><br />
                                • You can only broadcast once every 6 days<br />
                                • Complete your daily status for 6 consecutive days to unlock broadcast
                            </p>
                        </div>
                    </div>
                </div>

                {/* Broadcast Button */}
                {canBroadcast ? (
                    <button
                        onClick={addBroadcast}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xl font-bold py-6 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mb-6"
                    >
                        <CheckCircle size={28} />
                        <span>Mark Broadcast as Done</span>
                    </button>
                ) : (
                    <div className={`p-6 rounded-xl border-2 mb-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-amber-50 border-amber-300'}`}>
                        <div className="flex items-center justify-center gap-3">
                            <Clock size={24} className={isDark ? 'text-gray-400' : 'text-amber-600'} />
                            <p className={`text-center text-lg ${isDark ? 'text-gray-400' : 'text-amber-700'}`}>
                                <strong>Broadcast not available yet.</strong><br />
                                <span className="text-base">Complete 6 days of daily status to unlock.</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Broadcast History */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Radio size={24} className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                        Broadcast History
                    </h3>
                </div>

                {broadcasts.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                        <Radio size={48} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No broadcasts yet. Complete your daily status to unlock.
                        </p>
                    </div>
                ) : (
                    broadcasts.map(broadcast => (
                        <div
                            key={broadcast.id}
                            className={`p-5 rounded-xl border-2 shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-300'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Send size={24} className="text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        Broadcast Sent
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {formatDate(broadcast.date)}
                                    </p>
                                </div>
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
