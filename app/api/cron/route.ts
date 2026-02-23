import { NextResponse } from "next/server";
import { sendPush } from "@/lib/fcm";
import { getDueNotifications, markAsSent } from "@/lib/db";

export async function GET() {
    const due = getDueNotifications();

    for (const item of due) {
        try {
            await sendPush(item.token, item.title, item.body);
            markAsSent(item.id);
        } catch (e) {
            // Optionally log error
        }
    }

    return NextResponse.json({ ok: true, sent: due.length });
}
