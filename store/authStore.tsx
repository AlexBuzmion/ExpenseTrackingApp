import { useLocalStorage } from "@/utils/useLocalStorage";
import { create } from "zustand";

interface AuthState {
    userId: string;
    setUserId: (userId: string) => void;
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
    firstTimeUser: boolean;
    setFirstTimeUser: (firstTimeUser: boolean) => void;
}

const { setItem } = useLocalStorage('auth');

export const useAuthStore = create<AuthState>((set) => ({
    userId: '',
    setUserId: (userId: string) => set({ userId }),
    signedIn: false,
    setSignedIn: (signedIn: boolean) => set({ signedIn }),
    firstTimeUser: true,
    setFirstTimeUser: (firstTimeUser: boolean) => {
        set({ firstTimeUser })
        setItem({ firstTimeUser });
    },

}))