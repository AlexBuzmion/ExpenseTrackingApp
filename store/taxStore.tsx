import { create } from 'zustand';
import { getApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

type TaxRatesStore = {
    taxRates: Record<string, { GST: number; HST: number; PST: number }>;
    setTaxRates: (newRates: Record<string, { GST: number; HST: number; PST: number }>) => void;
    initTaxRates: () => Promise<Record<string, { GST: number; HST: number; PST: number }>>;
};

export const useTaxStore = create<TaxRatesStore>((set) => ({
    taxRates: {},
    setTaxRates: (newRates) => set({ taxRates: newRates }),
    initTaxRates: async () => {
        console.log("Fetching provincial tax rates...");
        try {
            const docRef = doc(getFirestore(getApp()), "app-configs", "provincial-tax-rates");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as Record<string, { GST: number; HST: number; PST: number }>;
                set({ taxRates: data });
                return data;
            }
            return {};
        } catch (error: any) {
        console.error("Error fetching provincial tax rates:", error.message);
        return {};
        }
    }
}));
