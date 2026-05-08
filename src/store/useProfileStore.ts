import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface Order {
    id: string;
    date: string;
    status: "Delivered" | "Processing" | "Shipped" | "Cancelled";
    total: number;
    items: string[];
}

export interface Address {
    id?: string;
    _id?: string;
    type: "Home" | "Work" | "Other";
    name: string;
    email: string;
    phone: string;
    flat: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

interface ProfileState {
    addresses: Address[];
    orders: Order[];
    isLoading: boolean;
    fetchAddresses: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    addAddress: (address: Partial<Address>) => Promise<void>;
    removeAddress: (id: string) => Promise<void>;
    updateAddress: (id: string, updates: Partial<Address>) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useProfileStore = create<ProfileState>((set, get) => ({
    addresses: [],
    orders: [], // Will be hydrated when orders API is built
    isLoading: false,

    fetchOrders: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/user/orders');
            if (res.ok) {
                const data = await res.json();
                set({ orders: data.orders });
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchAddresses: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/user/addresses');
            if (res.ok) {
                const data = await res.json();
                set({ addresses: data.addresses });
            }
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateProfile: async (updates) => {
        try {
            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to update profile');

            // Trigger a re-fetch of the global auth session
            await useAuthStore.getState().checkAuth();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    addAddress: async (address) => {
        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(address)
            });
            if (!res.ok) throw new Error('Failed to add address');
            const data = await res.json();
            set({ addresses: data.addresses });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    removeAddress: async (id) => {
        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error('Failed to delete address');
            const data = await res.json();
            set({ addresses: data.addresses });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateAddress: async (id, updates) => {
        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!res.ok) throw new Error('Failed to update address');
            const data = await res.json();
            set({ addresses: data.addresses });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}));
