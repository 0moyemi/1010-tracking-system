import { GoogleAuth } from 'google-auth-library';

const auth = new GoogleAuth({
    keyFile: './firebase-service-account.json',
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});

export async function sendPush(token: string, title: string, body: string) {
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const projectId = await auth.getProjectId();

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
                        title,
                        body,
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
}
