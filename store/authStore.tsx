import { useLocalStorage } from "@/utils/useLocalStorage";
import { create } from "zustand";

interface AuthState {
    userId: string;
    setUserId: (userId: string) => void;
    signedIn: boolean;
    setSignedIn: (signedIn: boolean) => void;
    firstTimeUser: boolean;
    setFirstTimeUser: (firstTimeUser: boolean) => void;
    initFirstTimeUser: () => Promise<void>;
}

const { setItem, getItem } = useLocalStorage('auth');

export const useAuthStore = create<AuthState>((set) => ({
    
    userId: '',
    setUserId: async (userId: string) => {
        set({ userId })
        await getItem()
    },
    signedIn: false,
    setSignedIn: (signedIn: boolean) => set({ signedIn }),
    
    firstTimeUser: true,
    setFirstTimeUser: async (bfirstTimeUser: boolean) => {
        console.log(`setting firstTimeUser to ${bfirstTimeUser}`);
        set({ firstTimeUser: bfirstTimeUser })
        await setItem({ firstTimeUser: bfirstTimeUser });
    },
    initFirstTimeUser: async () => {
        const storedData = await getItem();
        const isFirstTime = storedData?.firstTimeUser ?? true;
        set({ firstTimeUser: isFirstTime });
    }
}))