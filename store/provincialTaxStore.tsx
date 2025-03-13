import { create } from 'zustand';

type TaxRatesStore = {
    taxRates: Record<string, { GST: number; HST: number; PST: number }>;
    setTaxRates: (newRates: Record<string, { GST: number; HST: number; PST: number }>) => void;
};

export const taxRatesStore = create<TaxRatesStore>((set) => ({
    taxRates: {},
    setTaxRates: (newRates) => set({ taxRates: newRates }),
}));

/* //! use this function to retrieve the provincial tax rates
const taxStore = taxRatesStore((state) => state.setTaxRates);
async function fetchProvTaxRates() {
    // create the doc ref, then get the doc
    const docRef = doc(db, "app-configs", "provincial-tax-rates");
    let docSnap;
    try {
        // get the doc
        docSnap = await getDoc(docRef);
    } catch (error: any) {
        alert(error.message);
    }
    if (docSnap?.exists()) {
        const data = docSnap.data() as Record<string, { GST: number; HST: number; PST: number }>;
        taxStore(data);
        // const updatedTaxRates = taxRatesStore.getState().taxRates;
        // console.log('data tax rates: ', data);
        // console.log('state Tax Rates: ', updatedTaxRates);
    }
}
    */