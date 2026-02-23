import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

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

const auth = new GoogleAuth({
    keyFile: './firebase-service-account.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});

export async function POST(request: Request): Promise<Response> {
    try {
        const { title, body, url, targetToken } = await request.json();

        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        const projectId = await auth.getProjectId();

        const tokensSet = loadTokens();
        const targetTokens: string[] = targetToken ? [targetToken] : Array.from(tokensSet);

        if (targetTokens.length === 0) {
            return NextResponse.json({ error: 'No FCM tokens found' }, { status: 404 });
        }

        const results = await Promise.allSettled(
            targetTokens.map(async (token) => {
                const res = await fetch(
                    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${accessToken.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: {
                                token,
                                notification: {
                                    title: title || 'New Notification',
                                    body: body || 'You have a new message',
                                },
                                data: { url: url || '/' },
                            },
                        }),
                    }
                );
                if (!res.ok) throw new Error(`FCM Error: ${await res.text()}`);
                return res.json();
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