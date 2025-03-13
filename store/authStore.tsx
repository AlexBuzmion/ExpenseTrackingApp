import { create } from "zustand";

interface AuthState {
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
}

export const AuthInfo = create<AuthState>((set) => ({
    signedIn: false,
    setSignedIn: (signedIn: boolean) => set({ signedIn }),
}))