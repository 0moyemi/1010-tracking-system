import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.resolve(process.cwd(), 'data', 'push-store.json');
function loadTokens(): string[] {
    try {
        const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.tokens)) return parsed.tokens;
        return [];
    } catch {
        return [];
    }
}

const auth = new GoogleAuth({
    keyFile: './firebase-service-account.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});

export async function POST(request: Request) {
    // Example: send a daily reminder to all tokens
    const tokens = loadTokens();
    if (!tokens.length) {
        return NextResponse.json({ error: 'No tokens found' }, { status: 404 });
    }
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const projectId = await auth.getProjectId();

    const results = await Promise.allSettled(
        tokens.map(async (token) => {
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
                                title: 'Daily Reminder',
                                body: 'Don\'t forget to check your daily status and follow-ups!',
                            },
                            data: { url: '/' },
                        },
                    }),
                }
            );
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`FCM Error: ${errorText}`);
            }
            return res.json();
        })
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({ success: true, sent: successful, failed });
}
