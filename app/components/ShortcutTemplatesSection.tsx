'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Copy, CheckCheck, Plus, X, Edit2, Trash2 } from 'lucide-react';

// Template structure
interface Template {
    id: string;
    title: string;
    message: string;
    icon: string;
}

type ShortcutTemplatesSectionProps = {
    isDark?: boolean;
};

export const defaultTemplates: Template[] = [
    {
        id: '1',
        title: 'New Order Confirmation',
        icon: '✅',
        message: `Hello! 👋

Thank you for your order!

We have received your request and will confirm the details shortly.

Order Date: [DATE]
Item: [ITEM]
Price: ₦[PRICE]

We'll get back to you soon!

Best regards,
[YOUR BUSINESS NAME]`
    },
    {
        id: '2',
        title: 'Order Ready for Delivery',
        icon: '🚚',
        message: `Good day! 🌟

Your order is ready for delivery!

Item: [ITEM]
Total: ₦[PRICE]
Delivery Date: [DATE]

Please confirm your delivery address.

Thank you for your business!
[YOUR BUSINESS NAME]`
    },
    {
        id: '3',
        title: 'Follow-up message',
        icon: '👣',
        message: `
Hi Rita, just checking in.
I noticed you were interested in our Abaya. 
↓ Check the full collection here ↓

https://bikudiratillah-store.vercel.app/

Complete your order at your own convenience, we’d be happy to deliver it to your doorstep.
Any questions? Just reply to this message.

Thank you.
            `
    },
    {
        id: '4',
        title: 'Order Delivered',
        icon: '🎉',
        message: `Thank you! 🙏

Your order has been delivered successfully!

We hope you enjoy your purchase.

Please leave us feedback and tell your friends about us! 😊

[YOUR BUSINESS NAME]`
    },
    {
        id: '5',
        title: 'Product Availability',
        icon: '📦',
        message: `Good day! 👋

We have the following items available:

• [ITEM 1] - ₦[PRICE]
• [ITEM 2] - ₦[PRICE]
• [ITEM 3] - ₦[PRICE]

Place your order now!

Contact us: [PHONE NUMBER]
[YOUR BUSINESS NAME]`
    },
    {
        id: '6',
        title: 'Thank You Message',
        icon: '🙏',
        message: `Thank you for your patronage! 🌟

We truly appreciate your business and trust in us.

Looking forward to serving you again!

Stay blessed! 🙏
[YOUR BUSINESS NAME]`
    }
];

export default function ShortcutTemplatesSection({ isDark = false }: ShortcutTemplatesSectionProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', icon: '', message: '' });

    // Load templates from localStorage on mount
    useEffect(() => {
        let savedTemplates = null;
        if (typeof window !== "undefined") {
            savedTemplates = localStorage.getItem('messageTemplates');
        }
        if (savedTemplates) {
            setTemplates(JSON.parse(savedTemplates));
        } else {
            // Initialize with default templates
            setTemplates(defaultTemplates);
            if (typeof window !== "undefined") {
                localStorage.setItem('messageTemplates', JSON.stringify(defaultTemplates));
            }
        }
    }, []);

    // Save templates to localStorage whenever they change
    useEffect(() => {
        if (templates.length > 0 && typeof window !== "undefined") {
            localStorage.setItem('messageTemplates', JSON.stringify(templates));
        }
    }, [templates]);

    // Add new template
    const handleAddTemplate = () => {
        if (!formData.title.trim() || !formData.message.trim()) return;

        const newTemplate: Template = {
            id: Date.now().toString(),
            title: formData.title,
            icon: formData.icon || '💬',
            message: formData.message
        };

        setTemplates([...templates, newTemplate]);
        setFormData({ title: '', icon: '', message: '' });
        setIsAdding(false);
    };

    // Edit existing template
    const handleEditTemplate = () => {
        if (!editingId || !formData.title.trim() || !formData.message.trim()) return;

        setTemplates(templates.map(t =>
            t.id === editingId
                ? { ...t, title: formData.title, icon: formData.icon || t.icon, message: formData.message }
                : t
        ));
        setEditingId(null);
        setFormData({ title: '', icon: '', message: '' });
    };

    // Delete template
    const handleDeleteTemplate = (id: string) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(t => t.id !== id));
        }
    };

    // Start editing
    const startEdit = (template: Template) => {
        setEditingId(template.id);
        setFormData({ title: template.title, icon: template.icon, message: template.message });
        setIsAdding(false);
    };

    // Cancel form
    const cancelForm = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ title: '', icon: '', message: '' });
    };


    // Copy template to clipboard and prepare for WhatsApp
    const copyToWhatsApp = async (template: Template) => {
        try {
            // Copy to clipboard
            if (typeof window !== "undefined" && navigator.clipboard) {
                await navigator.clipboard.writeText(template.message);
            }

            // Show success feedback
            setCopied(template.id);
            setTimeout(() => setCopied(null), 2000);

            // Show a toast/alert for extra clarity
            if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(100);
            }
            // Optionally, show a toast (replace with your toast system if available)
            // alert('Copied! Paste in WhatsApp or anywhere.');
        } catch (err) {
            alert('Failed to copy. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 lg:pl-72">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                {/* Section Title - Sticky */}
                <div className="mb-4">
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 rounded-xl bg-blue-900/30">
                                <MessageSquare size={28} className="text-blue-400" strokeWidth={2.5} />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white">Message Templates</h1>
                        </div>
                        <p className="text-gray-400 text-lg">Save and quickly copy WhatsApp message templates</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-800/50 rounded-2xl p-6 mb-6 shadow-lg">
                        <div className="flex items-start gap-3">
                            <Copy size={24} className="text-blue-200 flex-shrink-0 mt-1" />
                            <div>
                                <p className="text-white text-base leading-relaxed">
                                    <strong className="text-lg">Quick Copy:</strong><br />
                                    Tap any template to copy it, then paste into WhatsApp to send to your customers!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add New Template Button */}
                {!isAdding && !editingId && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full mb-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <Plus size={24} />
                        <span>Add New Template</span>
                    </button>
                )}

                {/* Add/Edit Template Form */}
                {(isAdding || editingId) && (
                    <div className={`mb-6 p-6 rounded-xl border-2 ${isDark ? 'bg-gray-800 border-green-500' : 'bg-white border-green-400'} shadow-lg`}>
                        <div className="flex items-center gap-3 mb-5">
                            {editingId ? <Edit2 size={24} className="text-green-500" /> : <Plus size={24} className="text-green-500" />}
                            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                                {editingId ? 'Edit Template' : 'New Template'}
                            </h3>
                        </div>

                        <input
                            type="text"
                            placeholder="Template title (e.g., New Order Confirmation)"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={`w-full p-4 text-lg rounded-xl mb-4 border-2 transition-all focus:ring-2 focus:ring-green-500 ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500'
                                }`}
                        />

                        <input
                            type="text"
                            placeholder="Icon (emoji, e.g., ✅ 🚚 📦)"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className={`w-full p-4 text-lg rounded-xl mb-4 border-2 transition-all focus:ring-2 focus:ring-green-500 ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500'
                                }`}
                        />

                        <textarea
                            placeholder="Template message..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={8}
                            className={`w-full p-4 text-lg rounded-xl mb-4 border-2 transition-all focus:ring-2 focus:ring-green-500 resize-none ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-green-500'
                                : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-green-500'
                                }`}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={cancelForm}
                                className={`py-4 text-lg font-bold rounded-xl transition-all ${isDark
                                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } active:scale-95`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={editingId ? handleEditTemplate : handleAddTemplate}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-bold rounded-xl active:scale-95 transition-all shadow-md hover:shadow-lg"
                            >
                                {editingId ? 'Save Changes' : 'Add Template'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Templates Grid */}
                <div className="space-y-4">
                    {templates.length === 0 ? (
                        <div className="text-center py-12 bg-gray-950 rounded-xl border-2 border-dashed border-blue-700">
                            <MessageSquare size={48} className="mx-auto mb-3 text-blue-600" />
                            <p className="text-lg text-gray-400">
                                No templates yet. Tap "Add New Template" to create one.
                            </p>
                        </div>
                    ) : (
                        templates.map(template => (
                            <div
                                key={template.id}
                                className="rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all bg-gray-950 border-blue-700"
                            >
                                {/* Template Header */}
                                <div className="p-5 bg-gray-950">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{template.icon}</span>
                                        <h3 className="text-lg font-bold flex-1 text-white">
                                            {template.title}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(template)}
                                                className="p-2 rounded-lg transition-all bg-blue-700 hover:bg-blue-800 text-white"
                                                title="Edit template"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTemplate(template.id)}
                                                className="p-2 rounded-lg transition-all bg-red-700 hover:bg-red-800 text-white"
                                                title="Delete template"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Template Preview */}
                                <div className="p-5">
                                    <pre className="text-sm whitespace-pre-wrap font-sans mb-4 text-gray-300">
                                        {template.message}
                                    </pre>

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => copyToWhatsApp(template)}
                                        className={`w-full py-4 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${copied === template.id
                                            ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                                            : 'bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:from-blue-800 hover:to-blue-950 active:scale-95 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        {copied === template.id ? (
                                            <>
                                                <CheckCheck size={24} />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={24} />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-5 rounded-xl bg-gray-950 border-2 border-blue-700">
                    <div className="flex items-start gap-3">
                        <MessageSquare size={20} className="text-blue-400" />
                        <p className="text-sm text-gray-300">
                            <strong>Tip:</strong> Replace [ITEM], [PRICE], [DATE], etc. with your actual order details before sending.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
