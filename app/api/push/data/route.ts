import { NextResponse } from 'next/server';
import { upsertDevice } from '@/app/lib/pushStore';

export async function POST(req: Request) {
    try {
        const { deviceId, followUps, dailyStatus, broadcasts, scheduledPosts } = await req.json();

        if (!deviceId) {
            return NextResponse.json({ error: 'Missing deviceId.' }, { status: 400 });
        }

        await upsertDevice(deviceId, {
            followUps: Array.isArray(followUps) ? followUps : [],
            dailyStatus: Array.isArray(dailyStatus) ? dailyStatus : [],
            broadcasts: Array.isArray(broadcasts) ? broadcasts : [],
            scheduledPosts: Array.isArray(scheduledPosts) ? scheduledPosts : [],
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save data.' }, { status: 500 });
    }
}
