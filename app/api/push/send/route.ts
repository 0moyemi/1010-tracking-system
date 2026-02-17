import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
    'mailto:your@email.com',
    VAPID_PUBLIC_KEY!,
    VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
    const { subscription, title, body, url } = await req.json();
    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({ title, body, url })
        );
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
