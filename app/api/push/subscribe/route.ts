import { NextResponse } from 'next/server';
import { upsertDevice } from '@/app/lib/pushStore';

export async function POST(req: Request) {
    try {
        const { deviceId, subscription } = await req.json();

        if (!deviceId || !subscription) {
            return NextResponse.json({ error: 'Missing deviceId or subscription.' }, { status: 400 });
        }

        await upsertDevice(deviceId, { subscription });
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 500 });
    }
}
