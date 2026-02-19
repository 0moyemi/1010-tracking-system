'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp, DollarSign, Package as PackageIcon, CheckCircle as CheckIcon, XCircle, Clock } from 'lucide-react';

// Order type definition
export interface Order {
    id: string;
    date: string; // ISO format: YYYY-MM-DD for sorting
    dateDisplay: string; // Human-readable format
    item: string;
    status: 'Confirmed' | 'Cancelled';
    price: number;
}

type OrdersSectionProps = {
    isDark?: boolean;
};

export default function OrdersSection({ isDark = false }: OrdersSectionProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [newItem, setNewItem] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [isAddingOrder, setIsAddingOrder] = useState(false);

    // Load orders from localStorage on mount
    useEffect(() => {
        let savedOrders = null;
        if (typeof window !== "undefined") {
            savedOrders = localStorage.getItem('orders');
        }
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
        }
    }, []);

    // Auto-save orders whenever they change
    useEffect(() => {
        if (orders.length > 0 && typeof window !== "undefined") {
            localStorage.setItem('orders', JSON.stringify(orders));
        }
    }, [orders]);

    // Format date as ISO string for storage and sorting
    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    // Format date for display (e.g., "Feb 1, 2026")
    const formatDateDisplay = (isoDate: string): string => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Quick add order function
    const handleQuickAdd = () => {
        if (!newItem.trim() || !newPrice.trim()) return;

        const now = new Date();
        const isoDate = formatDate(now);
        const order: Order = {
            id: Date.now().toString(),
            date: isoDate,
            dateDisplay: formatDateDisplay(isoDate),
            item: newItem.trim(),
            status: 'Confirmed',
            price: parseFloat(newPrice)
        };

        setOrders([order, ...orders]);
        setNewItem('');
        setNewPrice('');
        setIsAddingOrder(false);
    };

    // Update order status
    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(orders.map(order =>
            order.id === id ? { ...order, status } : order
        ));
    };

    // Calculate totals
    const calculateWeeklyRevenue = () => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekAgoStr = formatDate(weekAgo);
        const todayStr = formatDate(now);

        return orders
            .filter(o => {
                const orderDate = o.date;
                return orderDate >= weekAgoStr && orderDate <= todayStr && o.status === 'Confirmed';
            })
            .reduce((sum, o) => sum + o.price, 0);
    };

    const calculateMonthlyRevenue = () => {
        const now = new Date();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const monthAgoStr = formatDate(monthAgo);
        const todayStr = formatDate(now);

        return orders
            .filter(o => {
                const orderDate = o.date;
                return orderDate >= monthAgoStr && orderDate <= todayStr && o.status === 'Confirmed';
            })
            .reduce((sum, o) => sum + o.price, 0);
    };

    // Calculate progress (confirmed orders this week)
    const calculateWeeklyProgress = () => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekAgoStr = formatDate(weekAgo);
        const todayStr = formatDate(now);

        const weekOrders = orders.filter(o => {
            const orderDate = o.date;
            return orderDate >= weekAgoStr && orderDate <= todayStr;
        });

        const completed = weekOrders.filter(o => o.status === 'Confirmed').length;
        return { completed, total: weekOrders.length };
    };

    const progress = calculateWeeklyProgress();
    const weeklyRevenue = calculateWeeklyRevenue();
    const monthlyRevenue = calculateMonthlyRevenue();

    return (
        <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Section Title - Sticky */}
            <div className={`sticky top-0 z-10 pb-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <PackageIcon size={32} className={isDark ? 'text-blue-400' : 'text-[#081F44]'} />
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                        Orders
                    </h2>
                </div>

                {/* Totals Display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-5 rounded-xl ${isDark ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-[#081F44] to-blue-800'} shadow-lg`}>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={20} className="text-blue-200" />
                            <p className="text-sm text-blue-100 font-medium">Weekly Revenue</p>
                        </div>
                        <p className="text-2xl font-bold text-white">₦{weeklyRevenue.toLocaleString()}</p>
                    </div>
                    <div className={`p-5 rounded-xl ${isDark ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-green-600 to-green-700'} shadow-lg`}>
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign size={20} className="text-green-100" />
                            <p className="text-sm text-green-100 font-medium">Monthly Revenue</p>
                        </div>
                        <p className="text-2xl font-bold text-white">₦{monthlyRevenue.toLocaleString()}</p>
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className={`p-5 rounded-xl mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <CheckIcon size={20} className={isDark ? 'text-green-400' : 'text-green-600'} />
                            <p className={`text-base font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                Weekly Progress
                            </p>
                        </div>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {progress.completed} / {progress.total}
                        </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* Quick Add Button */}
                {!isAddingOrder && (
                    <button
                        onClick={() => setIsAddingOrder(true)}
                        className="w-full bg-[#081F44] hover:bg-blue-800 text-white text-xl font-bold py-5 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Plus size={28} />
                        <span>Quick Add Order</span>
                    </button>
                )}
            </div>

            {/* Quick Add Form */}
            {isAddingOrder && (
                <div className={`mb-6 p-6 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-blue-500' : 'bg-white border-blue-400'} shadow-lg`}>
                    <div className="flex items-center gap-3 mb-5">
                        <Plus size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                            Add New Order
                        </h3>
                    </div>

                    {/* Item Input */}
                    <input
                        type="text"
                        placeholder="Item name"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className={`w-full p-4 text-lg rounded-xl mb-4 border-2 transition-all focus:ring-2 focus:ring-blue-500 ${isDark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                            }`}
                    />

                    {/* Price Input */}
                    <div className="relative mb-4">
                        <span className={`absolute left-4 top-4 text-lg font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            ₦
                        </span>
                        <input
                            type="number"
                            placeholder="Price"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className={`w-full p-4 pl-10 text-lg rounded-xl border-2 transition-all focus:ring-2 focus:ring-blue-500 ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                                }`}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => {
                                setIsAddingOrder(false);
                                setNewItem('');
                                setNewPrice('');
                            }}
                            className={`py-4 text-lg font-bold rounded-xl transition-all ${isDark
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                } active:scale-95`}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleQuickAdd}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-bold rounded-xl active:scale-95 transition-all shadow-md hover:shadow-lg"
                        >
                            Add Order
                        </button>
                    </div>
                </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl border-2 border-dashed ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                        <PackageIcon size={48} className={`mx-auto mb-3 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            No orders yet. Tap "Quick Add Order" to start.
                        </p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div
                            key={order.id}
                            className={`p-5 rounded-xl border-2 shadow-sm hover:shadow-md transition-all ${order.status === 'Confirmed'
                                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-400'
                                : 'bg-gradient-to-r from-red-50 to-red-100 border-red-400'
                                }`}
                        >
                            {/* Date and Price Row */}
                            <div className="flex justify-between items-start mb-3">
                                <span className={`text-sm font-semibold ${order.status === 'Confirmed'
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                    }`}>
                                    {order.dateDisplay || formatDateDisplay(order.date)}
                                </span>
                                <span className={`text-xl font-bold ${order.status === 'Confirmed'
                                    ? 'text-green-700'
                                    : 'text-red-700'
                                    }`}>
                                    ₦{order.price.toLocaleString()}
                                </span>
                            </div>

                            {/* Item Name */}
                            <p className={`text-lg font-semibold mb-3 ${order.status === 'Confirmed'
                                ? 'text-green-800'
                                : 'text-red-800'
                                }`}>
                                {order.item}
                            </p>

                            {/* Status Toggle - Large for 60+ users */}
                            <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`w-full p-4 text-lg font-bold rounded-xl border-2 cursor-pointer transition-all ${order.status === 'Confirmed'
                                    ? 'bg-green-50 border-green-500 text-green-800 hover:bg-green-100'
                                    : 'bg-red-50 border-red-500 text-red-800 hover:bg-red-100'
                                    }`}
                            >
                                <option value="Confirmed">✅ Confirmed</option>
                                <option value="Cancelled">❌ Cancelled</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
