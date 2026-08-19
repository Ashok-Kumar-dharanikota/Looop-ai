import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv-storage';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isGuest: boolean;
  providerId?: string;
  lastLoginAt?: string;
}

interface UserState {
  user: AppUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isPremium: boolean;
  
  // Actions
  setUser: (user: Partial<AppUser> & { uid: string }) => void;
  setGuest: (guestName?: string) => void;
  setIsPremium: (isPremium: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isGuest: false,
      isPremium: false,

      setUser: (userData) =>
        set(() => ({
          user: {
            isGuest: false,
            providerId: 'google.com',
            lastLoginAt: new Date().toISOString(),
            ...userData,
            uid: userData.uid,
            email: userData.email ?? null,
            displayName: userData.displayName ?? null,
            photoURL: userData.photoURL ?? null,
          },
          isAuthenticated: true,
          isGuest: false,
        })),

      setGuest: (guestName = 'Guest Explorer') =>
        set({
          user: {
            uid: `guest_${Date.now()}`,
            email: null,
            displayName: guestName,
            photoURL: null,
            isGuest: true,
            providerId: 'guest',
            lastLoginAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          isGuest: true,
        }),

      setIsPremium: (isPremium: boolean) => set({ isPremium }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
          isGuest: false,
        }),
    }),
    {
      name: 'looop-user-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
