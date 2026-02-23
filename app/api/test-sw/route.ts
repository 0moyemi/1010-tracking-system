import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
    keyFile: './firebase-service-account.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});

export async function POST(request: Request) {
    const { token } = await request.json();
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const projectId = await auth.getProjectId();

    const body = {
        message: {
            token,
            data: {
                title: 'SW Test',
                body: 'If you see this, your SW is working',
                url: '/',
            },
        },
    };

    const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    );

    const result = await res.json();
    return NextResponse.json(result);
}
