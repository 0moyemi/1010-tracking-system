import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import { tokens } from '../save-fcm-token/route';

// Initialize Google Auth with service account
const auth = new GoogleAuth({
    keyFile: './firebase-service-account.json', // Path to your JSON file
    scopes: ['https://www.googleapis.com/auth/firebase.messaging']
});

export async function POST(request: Request): Promise<Response> {
    try {
        const { title, body, url, targetToken }: { title?: string; body?: string; url?: string; targetToken?: string } = await request.json();

        // Get access token
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();

        // Determine target tokens
        const targetTokens: string[] = targetToken
            ? [targetToken]
            : Array.from(tokens) as string[];

        if (targetTokens.length === 0) {
            return NextResponse.json(
                { error: 'No FCM tokens found' },
                { status: 404 }
            );
        }

        // Get project ID from service account
        const projectId = await auth.getProjectId();

        // Send to each token
        const results = await Promise.allSettled(
            targetTokens.map(async (token) => {
                const response = await fetch(
                    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message: {
                                token: token,
                                notification: {
                                    title: title || 'New Notification',
                                    body: body || 'You have a new message',
                                    image: '/icon-192x192.png',
                                },
                                data: {
                                    url: url || '/',
                                    click_action: url || '/',
                                },
                                webpush: {
                                    headers: {
                                        Urgency: 'high',
                                    },
                                    notification: {
                                        icon: '/icon-192x192.png',
                                        badge: '/badge-72x72.png',
                                        requireInteraction: false,
                                        tag: 'notification-1',
                                    },
                                    fcm_options: {
                                        link: url || '/',
                                    },
                                },
                            },
                        }),
                    }
                );
                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(`FCM Error: ${error}`);
                }
                return response.json();
            })
        );

        const successful = results.filter((r) => r.status === 'fulfilled').length;
        const failed = results.filter((r) => r.status === 'rejected').length;

        return NextResponse.json({
            success: true,
            sent: successful,
            failed: failed,

            total: targetTokens.length,
        });
    } catch (error: any) {
        console.error('Send notification error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
