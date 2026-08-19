import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const mmkvInstance: MMKV = createMMKV({
  id: 'looop-app-storage',
});

/**
 * Custom StateStorage adapter for Zustand persist middleware backed by MMKV
 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = mmkvInstance.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvInstance.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvInstance.remove(name);
  },
};
