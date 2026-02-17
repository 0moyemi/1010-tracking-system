// pages/api/push/cron.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllScheduledNotifications } from '@/app/lib/pushStore';
import { getAllDevices } from '@/app/lib/pushStore';
import webpush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
    'mailto:admin@example.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Get all scheduled notifications for now (or next X minutes)
    const notifications = await getAllScheduledNotifications();
    // 2. Get all device subscriptions
    const devices = await getAllDevices();
    // 3. Send notifications
    let sentCount = 0;
    for (const notif of notifications) {
        for (const device of devices) {
            const sub = device.subscription;
            if (!sub || !sub.endpoint) {
                console.warn('Skipping device with invalid subscription:', sub);
                continue;
            }
            try {
                await webpush.sendNotification(
                    sub as any,
                    JSON.stringify({ title: notif.title, body: notif.body, url: notif.url })
                );
                sentCount++;
            } catch (err) {
                console.error('Push failed for subscription:', sub, err);
            }
        }
    }
    res.status(200).json({ sent: sentCount });
}
