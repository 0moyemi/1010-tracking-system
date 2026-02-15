import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { getStore, updateDevice } from '@/app/lib/pushStore';

const DAY_MS = 24 * 60 * 60 * 1000;

const getTodayInTimeZone = (timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    return formatter.format(new Date());
};

const getNowInTimeZone = (timeZone: string) => {
    const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')?.value || '1970';
    const month = parts.find(p => p.type === 'month')?.value || '01';
    const day = parts.find(p => p.type === 'day')?.value || '01';
    return new Date(`${year}-${month}-${day}T12:00:00`);
};

const shouldSendDailyStatus = (dailyStatus: any[], today: string, lastSent?: string) => {
    if (lastSent === today) return false;
    const todayStatus = dailyStatus.find(d => d.date === today);
    return !!todayStatus && !todayStatus.checked;
};

const shouldSendBroadcast = (dailyStatus: any[], broadcasts: any[], today: string, lastSent?: string) => {
    if (lastSent === today) return false;
    const todayIndex = dailyStatus.findIndex(d => d.date === today);
    if (todayIndex < 5) return false;
    const isBroadcastDay = (todayIndex + 1) % 6 === 0;
    if (!isBroadcastDay) return false;
    const alreadyBroadcasted = broadcasts.some((b: any) => b.date === today && b.checked);
    return !alreadyBroadcasted;
};

const hashString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const pickLine = (lines: string[], seed: string) => {
    if (lines.length === 0) return '';
    return lines[hashString(seed) % lines.length];
};

const dailyStatusLines = [
    'Consistency matters. Post today.',
    'Show up today. It compounds.',
    'Visibility builds trust. Post now.',
    'Small step today. Big momentum.',
    'No zero days. Post now.',
    'Ship it today. Done beats perfect.'
];

const broadcastLines = [
    'Broadcast day. Be seen.',
    'Visibility creates opportunity. Send it.',
    'Be consistent. Stay visible today.',
    'Momentum beats mood. Broadcast now.',
    'Action wins. Send the broadcast.',
    'Execution beats ideas. Broadcast today.'
];

const followUpLines = [
    'Follow up today. It changes outcomes.',
    'Send the message. It matters.',
    'One follow-up can change everything.',
    'Conversations create revenue. Reach out.',
    'You are one message away. Send it.',
    'Just press send. Keep momentum.'
];

export async function GET() {
    try {
        const publicKey = process.env.VAPID_PUBLIC_KEY;
        const privateKey = process.env.VAPID_PRIVATE_KEY;
        const email = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
        const timeZone = process.env.NOTIF_TIMEZONE || 'Africa/Lagos';

        if (!publicKey || !privateKey) {
            return NextResponse.json({ error: 'Missing VAPID keys.' }, { status: 500 });
        }

        webpush.setVapidDetails(email, publicKey, privateKey);

        const store = await getStore();
        const today = getTodayInTimeZone(timeZone);
        const now = getNowInTimeZone(timeZone);

        const results: Array<{ deviceId: string; sent: string[] }> = [];

        for (const [deviceId, device] of Object.entries(store.devices)) {
            const sent: string[] = [];
            const followUps = device.followUps || [];
            const dailyStatus = device.dailyStatus || [];
            const broadcasts = device.broadcasts || [];
            const followUpReminderMap = device.followUpReminderMap || {};

            if (!device.subscription) {
                results.push({ deviceId, sent });
                continue;
            }

            const notifications: Array<{ title: string; body: string; tag: string }> = [];

            if (dailyStatus.length > 0 && shouldSendDailyStatus(dailyStatus, today, device.lastDailyStatusReminderDate)) {
                notifications.push({
                    title: 'Daily status reminder',
                    body: pickLine(dailyStatusLines, `${deviceId}-${today}-daily`),
                    tag: 'daily-status',
                });
            }

            if (dailyStatus.length > 0 && shouldSendBroadcast(dailyStatus, broadcasts, today, device.lastBroadcastReminderDate)) {
                notifications.push({
                    title: 'Broadcast reminder',
                    body: pickLine(broadcastLines, `${deviceId}-${today}-broadcast`),
                    tag: 'broadcast-day',
                });
            }

            followUps.forEach((followUp: any) => {
                if (!followUp?.dateAdded || !followUp?.id) return;
                const daysPending = Math.floor((now.getTime() - new Date(followUp.dateAdded).getTime()) / DAY_MS);
                if (![7, 8, 9].includes(daysPending)) return;
                const historyValue = followUpReminderMap[followUp.id];
                const sentDates = Array.isArray(historyValue)
                    ? historyValue
                    : historyValue
                        ? [historyValue]
                        : [];
                if (sentDates.includes(today)) return;
                if (sentDates.length >= 3) return;

                notifications.push({
                    title: 'Follow-up reminder',
                    body: `${followUp.customerName}: ${pickLine(followUpLines, `${deviceId}-${followUp.id}`)}`,
                    tag: `followup-${followUp.id}`,
                });
                sentDates.push(today);
                followUpReminderMap[followUp.id] = sentDates;
            });

            if (notifications.length === 0) {
                results.push({ deviceId, sent });
                continue;
            }

            for (const notification of notifications) {
                try {
                    // Convert PushSubscriptionJSON to PushSubscription
                    const { endpoint, keys } = device.subscription || {};
                    if (!endpoint || !keys || !keys.p256dh || !keys.auth) continue;
                    // Use web-push's PushSubscription type
                    const pushSub = {
                        endpoint,
                        keys: {
                            p256dh: keys.p256dh,
                            auth: keys.auth
                        }
                    };
                    await webpush.sendNotification(pushSub as any, JSON.stringify(notification));
                    sent.push(notification.tag);
                } catch (err: any) {
                    if (err?.statusCode === 404 || err?.statusCode === 410) {
                        await updateDevice(deviceId, { subscription: undefined });
                    }
                }
            }

            await updateDevice(deviceId, {
                lastDailyStatusReminderDate: notifications.some(n => n.tag === 'daily-status') ? today : device.lastDailyStatusReminderDate,
                lastBroadcastReminderDate: notifications.some(n => n.tag === 'broadcast-day') ? today : device.lastBroadcastReminderDate,
                followUpReminderMap,
            });

            results.push({ deviceId, sent });
        }

        return NextResponse.json({ ok: true, results });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to send reminders.' }, { status: 500 });
    }
}
