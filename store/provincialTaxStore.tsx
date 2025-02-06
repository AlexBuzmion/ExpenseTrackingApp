import { create } from 'zustand';

type TaxRatesStore = {
    taxRates: Record<string, { GST: number; HST: number; PST: number }>;
    setTaxRates: (newRates: Record<string, { GST: number; HST: number; PST: number }>) => void;
};

export const useTaxRatesStore = create<TaxRatesStore>((set) => ({
    taxRates: {
        "Alberta": { GST: 0.05, HST: 0, PST: 0 },
        "British Columbia": { GST: 0.05, HST: 0, PST: 0.07 },
        "Manitoba": { GST: 0.05, HST: 0, PST: 0.07 },
        "New Brunswick": { GST: 0, HST: 0.15, PST: 0 },
        "Newfoundland & Labrador": { GST: 0, HST: 0.15, PST: 0 },
        "Northwest Territories": { GST: 0.05, HST: 0, PST: 0 },
        "Nova Scotia": { GST: 0, HST: 0.15, PST: 0 },
        "Nunavut": { GST: 0.05, HST: 0, PST: 0 },
        "Ontario": { GST: 0, HST: 0.13, PST: 0 },
        "Prince Edward Island": { GST: 0, HST: 0.15, PST: 0 },
        "Quebec": { GST: 0.05, HST: 0, PST: 0.0975 },
        "Saskatchewan": { GST: 0.05, HST: 0, PST: 0.06 },
        "Yukon": { GST: 0.05, HST: 0, PST: 0 }
    },
    setTaxRates: (newRates) => set({ taxRates: newRates }),
}));
