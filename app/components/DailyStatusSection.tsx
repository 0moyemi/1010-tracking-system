"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Radio, Send } from "lucide-react";

interface DayStatus {
    date: string;
    checked: boolean;
}

interface BroadcastRecord {
    id: string;
    date: string;
    checked: boolean;
}

type DailyStatusSectionProps = {
    isDark?: boolean;
};

export default function DailyStatusSection({ isDark = false }: DailyStatusSectionProps) {
    // Track the first day the user started using the section
    const [firstUseDate, setFirstUseDate] = useState<string | null>(null);
    const [monthStatus, setMonthStatus] = useState<DayStatus[]>([]);
    const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isClientReady, setIsClientReady] = useState(false);

    // On mount, set or get first use date
    useEffect(() => {
        let stored = localStorage.getItem("dailyStatusFirstUse");
        if (!stored) {
            const today = new Date().toISOString().split("T")[0];
            localStorage.setItem("dailyStatusFirstUse", today);
            setFirstUseDate(today);
        } else {
            setFirstUseDate(stored);
        }
        setIsClientReady(true);
    }, []);

    // On mount, load or reset month data
    useEffect(() => {
        try {
            const savedStatus = localStorage.getItem("dailyStatus");
            const savedMonth = localStorage.getItem("dailyStatusMonth");
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
            if (savedMonth !== currentMonth) {
                // Save summary of last month if exists
                if (savedStatus && savedMonth) {
                    localStorage.setItem("dailyStatusSummary_" + savedMonth, savedStatus);
                }
                // Reset for new month
                const days = generateMonthDays();
                setMonthStatus(days);
                localStorage.setItem("dailyStatusMonth", currentMonth);
                localStorage.removeItem("dailyStatus");
            } else if (savedStatus) {
                try {
                    const parsed = JSON.parse(savedStatus);
                    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].date) {
                        setMonthStatus(parsed);
                    } else {
                        setMonthStatus(generateMonthDays());
                    }
                } catch (e) {
                    setMonthStatus(generateMonthDays());
                }
            } else {
                const days = generateMonthDays();
                setMonthStatus(days);
            }
            const savedBroadcasts = localStorage.getItem("broadcasts");
            if (savedBroadcasts) {
                try {
                    const parsed = JSON.parse(savedBroadcasts);
                    if (Array.isArray(parsed)) {
                        setBroadcasts(parsed);
                    }
                } catch (e) {
                    setBroadcasts([]);
                }
            }
        } catch (e) {
            setError("Failed to load daily status data. Please clear your browser storage and reload.");
        }
    }, []);

    useEffect(() => {
        if (monthStatus.length > 0) {
            localStorage.setItem("dailyStatus", JSON.stringify(monthStatus));
        }
    }, [monthStatus]);

    useEffect(() => {
        if (broadcasts.length > 0) {
            localStorage.setItem("broadcasts", JSON.stringify(broadcasts));
        }
    }, [broadcasts]);

    function generateMonthDays(): DayStatus[] {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = now.getDate();
        const days: DayStatus[] = [];
        // Always generate at least one day (today)
        for (let day = today; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            if (date.getMonth() !== month) continue;
            days.push({ date: date.toISOString().split("T")[0], checked: false });
        }
        // If for some reason no days were generated, add today
        if (days.length === 0) {
            const date = new Date(year, month, today);
            days.push({ date: date.toISOString().split("T")[0], checked: false });
        }
        return days;
    }

    function toggleDay(index: number) {
        const newStatus = [...monthStatus];
        newStatus[index].checked = !newStatus[index].checked;
        setMonthStatus(newStatus);
    }

    function canBroadcastOnDay(dayIndex: number): boolean {
        if (dayIndex < 5) return false;
        if (dayIndex > 0 && !monthStatus[dayIndex - 1]?.checked) return false;
        const last6Days = monthStatus.slice(Math.max(0, dayIndex - 5), dayIndex + 1);
        const allTicked = last6Days.every((d) => d.checked);
        if (!allTicked) return false;
        const dayDate = monthStatus[dayIndex].date;
        const alreadyBroadcasted = broadcasts.some((b) => b.date === dayDate);
        if (alreadyBroadcasted) return false;
        const recentBroadcast = broadcasts.find((b) => {
            const broadcastIndex = monthStatus.findIndex((d) => d.date === b.date);
            return broadcastIndex !== -1 && broadcastIndex > dayIndex - 6 && broadcastIndex < dayIndex;
        });
        return !recentBroadcast;
    }

    function markBroadcast(dayDate: string) {
        const newBroadcast: BroadcastRecord = {
            id: Date.now().toString(),
            date: dayDate,
            checked: true,
        };
        setBroadcasts([newBroadcast, ...broadcasts]);
    }

    function getDayOfWeek(dateStr: string): string {
        const date = new Date(dateStr);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return days[date.getDay()];
    }

    function getDayNumber(dateStr: string): number {
        const date = new Date(dateStr);
        return date.getDate();
    }

    function getMonthName(): string {
        if (monthStatus.length === 0) return "";
        const date = new Date(monthStatus[0].date);
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }

    function calculateProgress() {
        if (!firstUseDate) {
            return { completed: 0, total: 0 };
        }
        // Get all days from firstUseDate to the end of the month
        const eligibleDays = monthStatus.filter((day) => day.date >= firstUseDate);
        const completed = eligibleDays.filter((d) => d.checked).length;
        return { completed, total: eligibleDays.length };
    }

    // Smart color logic for each day
    function getDayColor(day: DayStatus) {
        const today = new Date().toISOString().split("T")[0];
        if (!firstUseDate) return "bg-gray-800 border-gray-700 text-gray-500";
        const dayDate = day.date;
        // Before first use: always muted
        if (dayDate < firstUseDate) return "bg-gray-800 border-gray-700 text-gray-500";
        // Future days: muted
        if (dayDate > today) return "bg-gray-800 border-gray-700 text-gray-500";
        // Today: subtle blue
        if (dayDate === today && !day.checked) return "bg-blue-900 border-blue-600 text-blue-200";
        // Posted: green
        if (day.checked) return "bg-green-900 border-green-600 text-green-200";
        // Missed: red (only after first use)
        if (dayDate < today && !day.checked && dayDate >= firstUseDate) return "bg-red-900 border-red-600 text-red-200";
        // Default: subtle
        return "bg-gray-800 border-gray-700 text-gray-500";
    }

    const progress = calculateProgress();

    if (!isClientReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="bg-red-900/80 p-8 rounded-2xl shadow-lg border-2 border-red-700 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">Application Error</h2>
                    <p className="text-red-200 mb-2">{error}</p>
                    <p className="text-gray-300 text-sm">Try clearing your browser's local storage and reloading the page.</p>
                </div>
            </div>
        );
    }

    if (!monthStatus || monthStatus.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="bg-yellow-900/80 p-8 rounded-2xl shadow-lg border-2 border-yellow-700 max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-white mb-4">No Days Available</h2>
                    <p className="text-yellow-200 mb-2">No days could be generated for this month. Please check your system date or reload the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 lg:pl-72">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="mb-4">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-green-900/30">
                                <CheckCircle size={28} className="text-green-400" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">Daily Status - {getMonthName()}</h1>
                        </div>
                        <p className="text-gray-400 text-lg">Track your daily business progress</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-800/50 rounded-2xl p-6 mb-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-300 mb-1">Completed Days</p>
                                <p className="text-4xl font-bold text-white">{progress.completed} / {progress.total}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-green-900/40">
                                <CheckCircle size={32} className="text-green-400" strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-5 overflow-hidden shadow-inner mt-4">
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
                        <p className="text-center mt-3 text-lg text-gray-400">
                            {progress.total - progress.completed > 0
                                ? `${progress.total - progress.completed} more day${progress.total - progress.completed !== 1 ? "s" : ""} to go!`
                                : "All caught up! 🎉"}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl mb-4 border-2 bg-gray-950 border-green-700">
                        <p className="text-lg text-green-200 text-center">
                            ✅ <strong>Tick daily posts below</strong> • 📢 <strong>Broadcasts appear every 6 days</strong>
                        </p>
                    </div>
                </div>
                <div className="space-y-2 max-w-4xl mx-auto">
                    {monthStatus.map((day, index) => {
                        const today = new Date().toISOString().split("T")[0];
                        const isToday = day.date === today;
                        const isFuture = day.date > today;
                        const isBroadcastDay = (index + 1) % 6 === 0 && index >= 5;
                        const canBroadcast = isBroadcastDay && canBroadcastOnDay(index);
                        const broadcastDone = broadcasts.some((b) => b.date === day.date);
                        return (
                            <div key={day.date}>
                                <div
                                    className={`p-3 rounded-xl border-2 transition-all ${getDayColor(day)} ${isToday ? "ring-4 ring-blue-500 scale-[1.02]" : ""}`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-4 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={day.checked}
                                                onChange={() => toggleDay(index)}
                                                className="w-10 h-10 cursor-pointer accent-green-600 flex-shrink-0"
                                                disabled={isFuture || day.date < (firstUseDate || "")}
                                            />
                                            <div className="flex-1">
                                                <p className="text-xl font-bold">
                                                    {getDayOfWeek(day.date)}, Day {getDayNumber(day.date)}
                                                    {isToday && <span className="ml-2 text-blue-600">• TODAY</span>}
                                                </p>
                                                <p className="text-base font-medium opacity-80">
                                                    {day.checked
                                                        ? "✅ Posted"
                                                        : isFuture
                                                            ? "⏳ Upcoming"
                                                            : day.date < (firstUseDate || "")
                                                                ? "--"
                                                                : isToday
                                                                    ? "Post for today!"
                                                                    : "❌ Not Posted"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-4xl">
                                            {day.checked ? "✅" : isFuture ? "⏳" : day.date < (firstUseDate || "") ? "--" : "❌"}
                                        </div>
                                    </div>
                                </div>
                                {isBroadcastDay && (
                                    <div
                                        className={`mt-2 p-4 rounded-xl border-2 transition-all ${broadcastDone
                                            ? "bg-purple-900 border-purple-600 text-purple-200"
                                            : canBroadcast
                                                ? "bg-gradient-to-r from-green-700 to-green-800 border-green-500 text-white"
                                                : "bg-gray-800 border-gray-700 text-gray-500 opacity-60"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-4 flex-1">
                                                <Radio size={32} strokeWidth={2.5} className="flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-xl font-bold">📢 Broadcast Post</p>
                                                    <p className="text-base font-medium opacity-90">
                                                        {broadcastDone
                                                            ? "✅ Broadcast Sent!"
                                                            : canBroadcast
                                                                ? "🎉 Ready to broadcast!"
                                                                : "🔒 Complete previous day first"}
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
                                            {broadcastDone && <div className="text-4xl">✅</div>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
