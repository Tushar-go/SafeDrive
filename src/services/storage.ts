import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriveSession } from '../types';

const KEY = 'safedrive:history:v2';

export async function saveSession(session: DriveSession): Promise<void> {
  try {
    const list = await loadAllSessions();
    await AsyncStorage.setItem(KEY, JSON.stringify([session, ...list]));
  } catch (e) {
    console.error('[storage] saveSession:', e);
  }
}

export async function loadAllSessions(): Promise<DriveSession[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as DriveSession[]) : [];
  } catch (e) {
    console.error('[storage] loadAllSessions:', e);
    return [];
  }
}

export async function clearAllSessions(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export async function deleteSession(id: string): Promise<void> {
  const list = await loadAllSessions();
  await AsyncStorage.setItem(KEY, JSON.stringify(list.filter(s => s.id !== id)));
}
