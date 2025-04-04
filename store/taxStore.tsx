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
                const provinceAcronyms: Record<string, string> = {
                    "Alberta": "AB",
                    "British Columbia": "BC",
                    "Manitoba": "MB",
                    "New Brunswick": "NB",
                    "Newfoundland & Labrador": "NL",
                    "Northwest Territories": "NT",
                    "Nova Scotia": "NS",
                    "Nunavut": "NU",
                    "Ontario": "ON",
                    "Prince Edward Island": "PE", // or "PEI" if preferred
                    "Quebec": "QC",
                    "Saskatchewan": "SK",
                    "Yukon": "YT"
                };
        
                // Transform the data keys to acronyms
                const transformedData: Record<string, { GST: number; HST: number; PST: number }> = {};
                for (const [province, rates] of Object.entries(data)) {
                    const acronym = provinceAcronyms[province] || province;
                    transformedData[acronym] = rates;
                }
        
                console.log("Fetched provincial tax rates:", transformedData);
                set({ taxRates: transformedData });
                return transformedData;
            }
            return {};
        } catch (error: any) {
        console.error("Error fetching provincial tax rates:", error.message);
        return {};
        }
    }
}));
