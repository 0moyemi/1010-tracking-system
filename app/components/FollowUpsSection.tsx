'use client';

import { useState, useEffect } from 'react';
import { Plus, UserCheck, Trash2, Edit2, X, Check } from 'lucide-react';

// Follow-up type definition
export interface FollowUp {
    id: string;
    customerName: string;
    items: string;
    dateAdded: string;
    notes?: string;
}

interface FollowUpsSectionProps {
    isDark: boolean;
}

export default function FollowUpsSection({ isDark }: FollowUpsSectionProps) {
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newItems, setNewItems] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCustomerName, setEditCustomerName] = useState('');
    const [editItems, setEditItems] = useState('');
    const [editNotes, setEditNotes] = useState('');

    // Load follow-ups from localStorage on mount
    useEffect(() => {
        const savedFollowUps = localStorage.getItem('followUps');
        if (savedFollowUps) {
            setFollowUps(JSON.parse(savedFollowUps));
        }
    }, []);

    // Auto-save follow-ups whenever they change
    useEffect(() => {
        if (followUps.length > 0) {
            localStorage.setItem('followUps', JSON.stringify(followUps));
        } else {
            localStorage.removeItem('followUps');
        }
    }, [followUps]);

    // Format date for display
    const formatDisplayDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
    };

    // Add new follow-up
    const handleAdd = () => {
        if (!newCustomerName.trim() || !newItems.trim()) return;

        const followUp: FollowUp = {
            id: Date.now().toString(),
            customerName: newCustomerName.trim(),
            items: newItems.trim(),
            dateAdded: new Date().toISOString(),
            notes: newNotes.trim() || undefined
        };

        setFollowUps([followUp, ...followUps]);
        setNewCustomerName('');
        setNewItems('');
        setNewNotes('');
        setIsAdding(false);
    };

    // Start editing
    const startEdit = (followUp: FollowUp) => {
        setEditingId(followUp.id);
        setEditCustomerName(followUp.customerName);
        setEditItems(followUp.items);
        setEditNotes(followUp.notes || '');
    };

    // Save edit
    const saveEdit = (id: string) => {
        if (!editCustomerName.trim() || !editItems.trim()) return;

        setFollowUps(followUps.map(fu =>
            fu.id === id
                ? {
                    ...fu,
                    customerName: editCustomerName.trim(),
                    items: editItems.trim(),
                    notes: editNotes.trim() || undefined
                }
                : fu
        ));
        setEditingId(null);
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditingId(null);
        setEditCustomerName('');
        setEditItems('');
        setEditNotes('');
    };

    // Delete follow-up
    const deleteFollowUp = (id: string) => {
        if (confirm('Are you sure you want to remove this follow-up?')) {
            setFollowUps(followUps.filter(fu => fu.id !== id));
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} lg:pl-72`}>
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                            <UserCheck size={28} className={isDark ? 'text-purple-400' : 'text-purple-600'} strokeWidth={2.5} />
                        </div>
                        <h1 className={`text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                            Follow-Ups
                        </h1>
                    </div>
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
                        Track customers with pending deals
                    </p>
                </div>

                {/* Stats Card */}
                <div className={`${isDark ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-800/50' : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200'} border rounded-2xl p-6 mb-6 shadow-lg`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'} mb-1`}>
                                Pending Follow-Ups
                            </p>
                            <p className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                                {followUps.length}
                            </p>
                        </div>
                        <div className={`p-4 rounded-xl ${isDark ? 'bg-purple-900/40' : 'bg-purple-200/50'}`}>
                            <UserCheck size={32} className={isDark ? 'text-purple-400' : 'text-purple-600'} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                {/* Add New Follow-Up Button */}
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className={`w-full mb-6 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl active:scale-98 ${isDark
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                            }`}
                    >
                        <Plus size={24} strokeWidth={2.5} />
                        Add New Follow-Up
                    </button>
                )}

                {/* Add New Form */}
                {isAdding && (
                    <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-6 mb-6 shadow-xl`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                            New Follow-Up
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    value={newCustomerName}
                                    onChange={(e) => setNewCustomerName(e.target.value)}
                                    placeholder="Enter customer name"
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Items of Interest *
                                </label>
                                <input
                                    type="text"
                                    value={newItems}
                                    onChange={(e) => setNewItems(e.target.value)}
                                    placeholder="e.g., iPhone 13, Sneakers, etc."
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={newNotes}
                                    onChange={(e) => setNewNotes(e.target.value)}
                                    placeholder="Additional notes..."
                                    rows={2}
                                    className={`w-full px-4 py-3 rounded-xl border ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                                        } focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none`}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleAdd}
                                    className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-98 ${isDark
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                        }`}
                                >
                                    Add Follow-Up
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAdding(false);
                                        setNewCustomerName('');
                                        setNewItems('');
                                        setNewNotes('');
                                    }}
                                    className={`py-3 px-6 rounded-xl font-bold transition-all ${isDark
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Follow-Ups List */}
                <div className="space-y-4">
                    {followUps.length === 0 ? (
                        <div className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-12 text-center shadow-md`}>
                            <UserCheck size={64} className={`mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} strokeWidth={1.5} />
                            <p className={`text-xl font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                No follow-ups yet
                            </p>
                            <p className={`mt-2 ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
                                Add customers who need follow-up
                            </p>
                        </div>
                    ) : (
                        followUps.map((followUp) => (
                            <div
                                key={followUp.id}
                                className={`${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-2xl p-5 shadow-md hover:shadow-lg transition-all`}
                            >
                                {editingId === followUp.id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Customer Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editCustomerName}
                                                onChange={(e) => setEditCustomerName(e.target.value)}
                                                className={`w-full px-4 py-2 rounded-xl border ${isDark
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } focus:ring-2 focus:ring-purple-500 outline-none`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Items of Interest
                                            </label>
                                            <input
                                                type="text"
                                                value={editItems}
                                                onChange={(e) => setEditItems(e.target.value)}
                                                className={`w-full px-4 py-2 rounded-xl border ${isDark
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } focus:ring-2 focus:ring-purple-500 outline-none`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Notes
                                            </label>
                                            <textarea
                                                value={editNotes}
                                                onChange={(e) => setEditNotes(e.target.value)}
                                                rows={2}
                                                className={`w-full px-4 py-2 rounded-xl border ${isDark
                                                    ? 'bg-gray-800 border-gray-700 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    } focus:ring-2 focus:ring-purple-500 outline-none resize-none`}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => saveEdit(followUp.id)}
                                                className={`flex-1 py-2 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isDark
                                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                                    }`}
                                            >
                                                <Check size={18} />
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className={`py-2 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${isDark
                                                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                                    }`}
                                            >
                                                <X size={18} />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div>
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#081F44]'} mb-1`}>
                                                    {followUp.customerName}
                                                </h3>
                                                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Added: {formatDisplayDate(followUp.dateAdded)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => startEdit(followUp)}
                                                    className={`p-2 rounded-lg transition-all ${isDark
                                                        ? 'bg-gray-800 hover:bg-gray-700 text-blue-400'
                                                        : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                                                        }`}
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteFollowUp(followUp.id)}
                                                    className={`p-2 rounded-lg transition-all ${isDark
                                                        ? 'bg-gray-800 hover:bg-red-900/30 text-red-400'
                                                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-xl p-4 mb-3`}>
                                            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
                                                Items of Interest
                                            </p>
                                            <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                                {followUp.items}
                                            </p>
                                        </div>
                                        {followUp.notes && (
                                            <div className={`${isDark ? 'bg-purple-900/20 border-purple-800/30' : 'bg-purple-50 border-purple-200'} border rounded-xl p-4`}>
                                                <p className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-700'} mb-1`}>
                                                    Notes
                                                </p>
                                                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    {followUp.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
