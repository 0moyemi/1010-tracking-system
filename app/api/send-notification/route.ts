
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { sendPush } from '@/lib/fcm';

const TOKENS_FILE = path.resolve(process.cwd(), 'data', 'push-store.json');
function loadTokens(): Set<string> {
    try {
        const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return new Set(parsed);
        if (parsed?.tokens && Array.isArray(parsed.tokens)) return new Set(parsed.tokens);
        return new Set();
    } catch {
        return new Set();
    }
}

export async function POST(request: Request): Promise<Response> {
    try {
        const { title, body, url, targetToken } = await request.json();
        const tokensSet = loadTokens();
        const targetTokens: string[] = targetToken ? [targetToken] : Array.from(tokensSet);
        if (targetTokens.length === 0) {
            return NextResponse.json({ error: 'No FCM tokens found' }, { status: 404 });
        }
        const results = await Promise.allSettled(
            targetTokens.map(async (token) => {
                try {
                    await sendPush(token, title || 'New Notification', body || 'You have a new message');
                    return { status: 'fulfilled' };
                } catch (err) {
                    return { status: 'rejected', reason: err };
                }
            })
        );
        return NextResponse.json({
            success: true,
            sent: results.filter((r) => r.status === 'fulfilled').length,
            failed: results.filter((r) => r.status === 'rejected').length,
            total: targetTokens.length,
        });
    } catch (error: any) {
        console.error('Send notification error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}