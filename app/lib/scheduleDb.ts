// IndexedDB helper for ScheduleSection media storage
// Uses idb-keyval for simplicity (can be replaced with custom logic)
import { openDB, DBSchema } from 'idb';

interface ScheduledMedia {
  id: string;
  blob: Blob;
  type: 'image' | 'video';
}

interface ScheduleDB extends DBSchema {
  media: {
    key: string; // post id
    value: ScheduledMedia;
  };
}

export async function getScheduleDb() {
  return openDB<ScheduleDB>('schedule-db', 1, {
    upgrade(db) {
      db.createObjectStore('media', { keyPath: 'id' });
    },
  });
}

export async function saveMedia(id: string, blob: Blob, type: 'image' | 'video') {
  const db = await getScheduleDb();
  await db.put('media', { id, blob, type });
}

export async function getMedia(id: string): Promise<ScheduledMedia | undefined> {
  const db = await getScheduleDb();
  return db.get('media', id);
}

export async function deleteMedia(id: string) {
  const db = await getScheduleDb();
  await db.delete('media', id);
}

export async function clearAllMedia() {
  const db = await getScheduleDb();
  await db.clear('media');
}
