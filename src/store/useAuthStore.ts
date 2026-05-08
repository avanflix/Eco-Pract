import { create } from 'zustand';
import { useCartStore } from './useCartStore';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Start true while we check session on load
    error: null,

    setUser: (user) => set({ user, isAuthenticated: !!user, error: null }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),

    checkAuth: async () => {
        try {
            set({ isLoading: true, error: null });
            const res = await fetch('/api/auth/me');

            if (res.ok) {
                const data = await res.json();
                set({ user: data.user, isAuthenticated: true, isLoading: false });
                // Sync cart on login
                useCartStore.getState().syncCartWithServer();
            } else {
                // If token is invalid or expired, forcefully log out to clear cookies
                if (res.status === 401) {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    // Optional: clear localStorage cache here if needed, but Zustand doesn't persist `useAuthStore` currently, 
                    // However if it did, we would do it. Instead we just set to null.
                }
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    logout: async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            set({ user: null, isAuthenticated: false });

            // Optionally, you could handle clearing cart or profile stores here too,
            // or let the page reload handle it.
            window.location.href = '/auth/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
}));
