import { NextResponse } from 'next/server';

export async function GET() {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    if (!publicKey) {
        return NextResponse.json({ error: 'Missing VAPID public key.' }, { status: 500 });
    }
    return NextResponse.json({ publicKey });
}
