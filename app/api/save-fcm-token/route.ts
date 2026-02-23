
import { NextResponse } from 'next/server';

// Simple in-memory storage (use database in production)
import fs from 'fs';
import path from 'path';
const TOKENS_FILE = path.resolve(process.cwd(), 'data', 'push-store.json');
function loadTokens(): Set<string> {
    try {
        const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            return new Set(parsed);
        } else if (parsed && Array.isArray(parsed.tokens)) {
            return new Set(parsed.tokens);
        } else {
            return new Set();
        }
    } catch {
        return new Set();
    }
}
function saveTokens(tokens: Set<string>) {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(Array.from(tokens)), 'utf-8');
}
const tokens = loadTokens();

export async function POST(request: Request): Promise<Response> {
    try {
        const { token } = await request.json();
        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }
        tokens.add(token);
        saveTokens(tokens);
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
