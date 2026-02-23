import fs from 'fs';
import path from 'path';

const SCHEDULED_FILE = path.resolve(process.cwd(), 'data', 'scheduled-reminders.json');

export type ScheduledReminder = {
    id: string;
    token: string;
    title: string;
    body: string;
    scheduledAt: string; // ISO string
    sent: boolean;
};

export function saveScheduledReminder(reminder: ScheduledReminder) {
    const reminders = getAllReminders();
    reminders.push(reminder);
    fs.mkdirSync(path.dirname(SCHEDULED_FILE), { recursive: true });
    fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(reminders, null, 2), 'utf-8');
}

export function getAllReminders(): ScheduledReminder[] {
    try {
        const data = fs.readFileSync(SCHEDULED_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function getDueNotifications(): ScheduledReminder[] {
    const now = new Date();
    return getAllReminders().filter(r => !r.sent && new Date(r.scheduledAt) <= now);
}

export function markAsSent(id: string) {
    const reminders = getAllReminders();
    const idx = reminders.findIndex(r => r.id === id);
    if (idx !== -1) {
        reminders[idx].sent = true;
        fs.writeFileSync(SCHEDULED_FILE, JSON.stringify(reminders, null, 2), 'utf-8');
    }
}
