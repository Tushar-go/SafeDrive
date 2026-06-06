import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriveSession } from '../types';

const KEY = 'safedrive:history:v2';
const MAX_SESSIONS = 500;

// Serialise writes so concurrent calls don't race
let writeQueue: Promise<void> = Promise.resolve();

function enqueue(fn: () => Promise<void>): Promise<void> {
  writeQueue = writeQueue.then(fn).catch(() => {});
  return writeQueue;
}

export async function loadAllSessions(): Promise<DriveSession[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Basic guard: must be an array
    if (!Array.isArray(parsed)) return [];
    return parsed as DriveSession[];
  } catch (e) {
    console.error('[storage] loadAllSessions:', e);
    return [];
  }
}

export function saveSession(session: DriveSession): Promise<void> {
  return enqueue(async () => {
    try {
      const list = await loadAllSessions();
      const updated = [session, ...list].slice(0, MAX_SESSIONS);
      await AsyncStorage.setItem(KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('[storage] saveSession:', e);
    }
  });
}

export function deleteSession(id: string): Promise<void> {
  return enqueue(async () => {
    try {
      const list = await loadAllSessions();
      const filtered = list.filter(s => s.id !== id);
      // Skip write if nothing actually changed
      if (filtered.length === list.length) return;
      await AsyncStorage.setItem(KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('[storage] deleteSession:', e);
    }
  });
}

export function clearAllSessions(): Promise<void> {
  return enqueue(async () => {
    try {
      await AsyncStorage.removeItem(KEY);
    } catch (e) {
      console.error('[storage] clearAllSessions:', e);
    }
  });
}