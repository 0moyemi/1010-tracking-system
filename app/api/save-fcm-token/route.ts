
import { NextResponse } from 'next/server';

// Simple in-memory storage (use database in production)
const tokens = new Set<string>();

export async function POST(request: Request): Promise<Response> {
    try {
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }
        // Store token (replace with database in production)
        tokens.add(token);
        console.log('FCM Token saved:', token.substring(0, 20) + '...');
        console.log('Total tokens:', tokens.size);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error saving token:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

// Export for use in send API
export { tokens };
