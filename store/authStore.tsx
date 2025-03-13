import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { create } from "zustand";

interface AuthState {
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
    user: FirebaseAuthTypes.User | null;
    setUser: (user: FirebaseAuthTypes.User | null) => void;
}

export const AuthInfo = create<AuthState>((set) => ({
    signedIn: false,
    setSignedIn: (signedIn: boolean) => set({ signedIn }),
    user: null,
    setUser: (user: FirebaseAuthTypes.User | null) => set({ user }),
}))