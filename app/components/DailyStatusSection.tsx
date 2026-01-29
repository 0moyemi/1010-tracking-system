'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Radio, Send } from 'lucide-react';

interface DayStatus {
    date: string;
    checked: boolean;
}

interface BroadcastRecord {
    id: string;
    date: string;
    checked: boolean;
}

interface DailyStatusSectionProps {
    isDark: boolean;
}

export default function DailyStatusSection({ isDark }: DailyStatusSectionProps) {
    const [monthStatus, setMonthStatus] = useState<DayStatus[]>([]);
    const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);

    useEffect(() => {
        const savedStatus = localStorage.getItem('dailyStatus');
        if (savedStatus) {
            setMonthStatus(JSON.parse(savedStatus));
        } else {
            const days = generateMonthDays();
            setMonthStatus(days);
        }
        const savedBroadcasts = localStorage.getItem('broadcasts');
        if (savedBroadcasts) {
            setBroadcasts(JSON.parse(savedBroadcasts));
        }
    }, []);

    useEffect(() => {
        if (monthStatus.length > 0) {
            localStorage.setItem('dailyStatus', JSON.stringify(monthStatus));
        }
    }, [monthStatus]);

    useEffect(() => {
        if (broadcasts.length > 0) {
            localStorage.setItem('broadcasts', JSON.stringify(broadcasts));
        }
    }, [broadcasts]);

    const generateMonthDays = (): DayStatus[] => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days: DayStatus[] = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            days.push({
                date: date.toISOString().split('T')[0],
                checked: false,
            });
        }
        return days;
    };

    const toggleDay = (index: number) => {
        const newStatus = [...monthStatus];
        newStatus[index].checked = !newStatus[index].checked;
        setMonthStatus(newStatus);
    };

    const canBroadcastOnDay = (dayIndex: number): boolean => {
        if (dayIndex < 4) return false;
        if (dayIndex > 0 && !monthStatus[dayIndex - 1]?.checked) {
            return false;
        }
        const last5Days = monthStatus.slice(Math.max(0, dayIndex - 4), dayIndex + 1);
        const allTicked = last5Days.every(d => d.checked);
        if (!allTicked) return false;
        const dayDate = monthStatus[dayIndex].date;
        const alreadyBroadcasted = broadcasts.some(b => b.date === dayDate);
        if (alreadyBroadcasted) return false;
        const recentBroadcast = broadcasts.find(b => {
            const broadcastIndex = monthStatus.findIndex(d => d.date === b.date);
            return broadcastIndex !== -1 && broadcastIndex > dayIndex - 5 && broadcastIndex < dayIndex;
        });
        return !recentBroadcast;
    };

    const markBroadcast = (dayDate: string) => {
        const newBroadcast: BroadcastRecord = {
            id: Date.now().toString(),
            date: dayDate,
            checked: true
        };
        setBroadcasts([newBroadcast, ...broadcasts]);
    };

    const getDayOfWeek = (dateStr: string): string => {
        const date = new Date(dateStr);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[date.getDay()];
    };

    const getDayNumber = (dateStr: string): number => {
        const date = new Date(dateStr);
        return date.getDate();
    };

    const getMonthName = (): string => {
        if (monthStatus.length === 0) return '';
        const date = new Date(monthStatus[0].date);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const calculateProgress = () => {
        const today = new Date().toISOString().split('T')[0];
        const eligibleDays = monthStatus.filter(day => day.date <= today);
        const completed = eligibleDays.filter(d => d.checked).length;
        return { completed, total: eligibleDays.length };
    };

    const getDayColor = (day: DayStatus) => {
        const today = new Date().toISOString().split('T')[0];
        const dayDate = day.date;
        if (dayDate > today) {
            return isDark ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-400';
        }
        if (day.checked) {
            return isDark ? 'bg-green-900 border-green-600 text-green-200' : 'bg-green-50 border-green-500 text-green-800';
        } else if (dayDate < today) {
            return isDark ? 'bg-red-900 border-red-600 text-red-200' : 'bg-red-50 border-red-500 text-red-800';
        }
        return isDark ? 'bg-blue-900 border-blue-600 text-blue-200' : 'bg-blue-50 border-blue-500 text-blue-800';
    };

    const progress = calculateProgress();

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-4 lg:p-8`}>
            <div className={`sticky top-0 z-10 pb-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={36} className={isDark ? 'text-green-400' : 'text-green-600'} strokeWidth={2.5} />
                    <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                        Daily Status - {getMonthName()}
                    </h2>
                </div>
                <div className={`p-6 rounded-2xl mb-4 ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={28} className={isDark ? 'text-green-400' : 'text-green-600'} strokeWidth={2.5} />
                            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Your Progress
                            </p>
                        </div>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {progress.completed} / {progress.total}
                        </p>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden shadow-inner">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-5 rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-2"
                            style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                        >
                            {progress.completed > 0 && (
                                <span className="text-white text-xs font-bold">
                                    {Math.round((progress.completed / progress.total) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>
                    <p className={`text-center mt-3 text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {progress.total - progress.completed > 0
                            ? `${progress.total - progress.completed} more day${progress.total - progress.completed !== 1 ? 's' : ''} to go!`
                            : 'All caught up! 🎉'}
                    </p>
                </div>
                <div className={`p-4 rounded-xl mb-4 border-2 ${isDark ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-300'}`}>
                    <p className={`text-lg ${isDark ? 'text-blue-200' : 'text-blue-900'} text-center`}>
                        ✅ <strong>Tick daily posts below</strong> • 📢 <strong>Broadcasts appear every 5 days</strong>
                    </p>
                </div>
            </div>
            <div className="space-y-2 max-w-4xl mx-auto">
                {monthStatus.map((day, index) => {
                    const today = new Date().toISOString().split('T')[0];
                    const isToday = day.date === today;
                    const isFuture = day.date > today;
                    const isBroadcastDay = (index + 1) % 5 === 0 && index >= 4;
                    const canBroadcast = isBroadcastDay && canBroadcastOnDay(index);
                    const broadcastDone = broadcasts.some(b => b.date === day.date);
                    return (
                        <div key={day.date}>
                            <div className={`p-3 rounded-xl border-2 transition-all ${getDayColor(day)} ${isToday ? 'ring-4 ring-blue-500 scale-[1.02]' : ''}`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-4 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={day.checked}
                                            onChange={() => toggleDay(index)}
                                            className="w-10 h-10 cursor-pointer accent-green-600 flex-shrink-0"
                                            disabled={isFuture}
                                        />
                                        <div className="flex-1">
                                            <p className="text-xl font-bold">
                                                {getDayOfWeek(day.date)}, Day {getDayNumber(day.date)}
                                                {isToday && <span className="ml-2 text-blue-600">• TODAY</span>}
                                            </p>
                                            <p className="text-base font-medium opacity-80">
                                                {day.checked ? '✅ Posted' : isFuture ? '⏳ Upcoming' : '❌ Not Posted'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-4xl">
                                        {day.checked ? '✅' : isFuture ? '⏳' : '❌'}
                                    </div>
                                </div>
                            </div>
                            {isBroadcastDay && (
                                <div className={`mt-2 p-4 rounded-xl border-2 transition-all ${broadcastDone ? isDark ? 'bg-purple-900 border-purple-600 text-purple-200' : 'bg-purple-100 border-purple-500 text-purple-900' : canBroadcast ? isDark ? 'bg-gradient-to-r from-green-700 to-green-800 border-green-500 text-white' : 'bg-gradient-to-r from-green-500 to-green-600 border-green-600 text-white' : isDark ? 'bg-gray-800 border-gray-700 text-gray-500 opacity-60' : 'bg-gray-200 border-gray-400 text-gray-500 opacity-60'}`}>
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-4 flex-1">
                                            <Radio size={32} strokeWidth={2.5} className="flex-shrink-0" />
                                            <div className="flex-1">
                                                <p className="text-xl font-bold">
                                                    📢 Broadcast Post
                                                </p>
                                                <p className="text-base font-medium opacity-90">
                                                    {broadcastDone ? '✅ Broadcast Sent!' : canBroadcast ? '🎉 Ready to broadcast!' : '🔒 Complete previous day first'}
                                                </p>
                                            </div>
                                        </div>
                                        {canBroadcast && !broadcastDone && (
                                            <button
                                                onClick={() => markBroadcast(day.date)}
                                                className="px-6 py-3 bg-white text-green-700 rounded-xl font-bold text-lg hover:bg-green-50 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                                            >
                                                <Send size={20} />
                                                Mark Sent
                                            </button>
                                        )}
                                        {broadcastDone && (
                                            <div className="text-4xl">✅</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
