import { promises as fs } from 'fs';
import path from 'path';

export interface DeviceRecord {
    subscription?: PushSubscriptionJSON;
    followUps?: any[];
    dailyStatus?: any[];
    broadcasts?: any[];
    lastDailyStatusReminderDate?: string;
    lastBroadcastReminderDate?: string;
    followUpReminderMap?: Record<string, string | string[]>;
}

interface StoreShape {
    devices: Record<string, DeviceRecord>;
}

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'push-store.json');

const ensureStore = async (): Promise<StoreShape> => {
    try {
        const raw = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(raw) as StoreShape;
    } catch (err) {
        await fs.mkdir(dataDir, { recursive: true });
        const empty: StoreShape = { devices: {} };
        await fs.writeFile(dataFile, JSON.stringify(empty, null, 2));
        return empty;
    }
};

const writeStore = async (store: StoreShape) => {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2));
};

export const upsertDevice = async (deviceId: string, updates: Partial<DeviceRecord>) => {
    const store = await ensureStore();
    const existing = store.devices[deviceId] || {};
    store.devices[deviceId] = { ...existing, ...updates };
    await writeStore(store);
    return store.devices[deviceId];
};

export const getStore = async () => {
    return ensureStore();
};

export const updateDevice = async (deviceId: string, updates: Partial<DeviceRecord>) => {
    return upsertDevice(deviceId, updates);
};
