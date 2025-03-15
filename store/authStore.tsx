import { create } from "zustand";

interface AuthState {
    userId: string;
    setUserId: (userId: string) => void;
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
}

export const AuthInfo = create<AuthState>((set) => ({
    userId: '',
    setUserId: (userId: string) => set({ userId }),
    signedIn: false,
    setSignedIn: (signedIn: boolean) => set({ signedIn }),
}))