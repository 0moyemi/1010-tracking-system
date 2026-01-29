'use client';

import { useState } from 'react';
import { MessageSquare, Copy, CheckCheck, Plus, X } from 'lucide-react';

// Template structure
interface Template {
    id: string;
    title: string;
    message: string;
    icon: string;
}

interface ShortcutTemplatesSectionProps {
    isDark: boolean;
}

export default function ShortcutTemplatesSection({ isDark }: ShortcutTemplatesSectionProps) {
    const [copied, setCopied] = useState<string | null>(null);

    // Pre-filled WhatsApp message templates for Nigerian SMEs
    const templates: Template[] = [
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

    // Copy template to clipboard and prepare for WhatsApp
    const copyToWhatsApp = async (template: Template) => {
        try {
            // Copy to clipboard
            await navigator.clipboard.writeText(template.message);

            // Show success feedback
            setCopied(template.id);
            setTimeout(() => setCopied(null), 2000);

            // Open WhatsApp Web (optional - user can paste manually)
            // Uncomment below to auto-open WhatsApp:
            // const encodedMessage = encodeURIComponent(template.message);
            // window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');

        } catch (err) {
            alert('Failed to copy. Please try again.');
        }
    };

    return (
        <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Section Title - Sticky */}
            <div className={`sticky top-0 z-10 pb-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare size={32} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-[#081F44]'}`}>
                        Message Templates
                    </h2>
                </div>

                {/* Instructions */}
                <div className={`p-5 rounded-xl mb-6 border-2 ${isDark ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-[#081F44] to-blue-800'} shadow-lg`}>
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

            {/* Templates Grid */}
            <div className="space-y-4">
                {templates.map(template => (
                    <div
                        key={template.id}
                        className={`rounded-xl border-2 overflow-hidden shadow-sm hover:shadow-md transition-all ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}
                    >
                        {/* Template Header */}
                        <div className={`p-5 ${isDark ? 'bg-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{template.icon}</span>
                                <h3 className={`text-lg font-bold flex-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {template.title}
                                </h3>
                            </div>
                        </div>

                        {/* Template Preview */}
                        <div className="p-5">
                            <pre className={`text-sm whitespace-pre-wrap font-sans mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                {template.message}
                            </pre>

                            {/* Copy Button */}
                            <button
                                onClick={() => copyToWhatsApp(template)}
                                className={`w-full py-4 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${copied === template.id
                                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white'
                                    : 'bg-gradient-to-r from-[#081F44] to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 active:scale-95 shadow-md hover:shadow-lg'
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
                                        <span>Copy to WhatsApp</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Additional Info */}
            <div className={`mt-6 p-5 rounded-xl ${isDark ? 'bg-gray-800 border-2 border-gray-700' : 'bg-blue-50 border-2 border-blue-200'}`}>
                <div className="flex items-start gap-3">
                    <MessageSquare size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                    <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <strong>Tip:</strong> Replace [ITEM], [PRICE], [DATE], etc. with your actual order details before sending.
                    </p>
                </div>
            </div>
        </div>
    );
}
