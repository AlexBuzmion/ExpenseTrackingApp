import { create } from 'zustand';
import uuid from 'react-native-uuid';
// import { getAuth } from 'firebase/auth';
// import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
// import { convertDBMap, editEntryDetailsInFB, removeEntryFromFB, saveExpenseToFirestore } from '@/utils/firebaseUtils';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useLocalStorage } from '@/utils/useLocalStorage';
import { useFirebaseUtils } from '@/utils/useFirebaseUtils';

const { setItem, getItem } = useLocalStorage('itemEntries');
const { saveEntryToDB } = useFirebaseUtils();

export type ExpenseEntry = {
    name: string;
    date: string;
    category: string;
    subcategory: string;
    subtotal: number;
    hst: number;
    total: number;
    creationDate: string;
    note: string;
};

type ExpenseListStore = {
    itemEntryList: Record<string, ExpenseEntry> ;
    setExpenseList: (expenses: Record<string, ExpenseEntry>) => void;
    addEntry: (expense: ExpenseEntry) => void; 
    deleteEntry: (id: string) => void;
    updateEntry: (id: string, updatedFields: Partial<ExpenseEntry>) => void;
    initExpenseList: () => Promise<Record<string, ExpenseEntry>>;
};

export const useEntriesStore = create<ExpenseListStore>((set) => ({
    itemEntryList: {},
    setExpenseList: (expenses) => set({ itemEntryList: expenses }),
    
    initExpenseList: async () => {
        // get local user storage first 
        const storageItemEntryList = await getItem();
        const user = getAuth().currentUser;
        //todo add a check for user signed in before running firebase function 
        if (user) {
        // try {
        //     const docRef = doc(getFirestore(), 'users', user.uid);
        //     const docSnap = await getDoc(docRef);
        //     if (docSnap.exists()) {
        //         const data = docSnap.data();
        //         const itemEntries = data.itemEntries;
        //         set ({ itemEntryList: itemEntries });
        //         return itemEntries;
        //     }
        // } catch (error: any) {
        //     alert(error.message);
        //     return error;
        // } 
        }
       
        // console.log('No user signed in; using local storage data.');
        set({ itemEntryList: storageItemEntryList || {} });
        return storageItemEntryList || {};

    }, 

    // use this as reference to follow to ensure a snappy update in UI and managing storage in the background 
    addEntry: async (expense) => { // this function is set to be async in case we need to call await for setItem() or saveEntryToDB(). 
        const newId = uuid.v4() as string; // create a unique id
        // 1. update the state.
        set((state) =>  { 
            const updatedEntries = { ...state.itemEntryList, [newId]: expense }; // create an object literal getting all existing entries and adding the new entry
            return { itemEntryList: updatedEntries }
        });
        const updatedEntries = useEntriesStore.getState().itemEntryList;
        // 2. save to local storage.
        setItem(updatedEntries); // This function should persist the entire record.
        // 3. push to cloud storage
        if (getAuth().currentUser) {
        //   await saveEntryToDB({ id: newId, ...expense });
        }
    },
    
    deleteEntry: async (id: string) => {
        set((state) => {
            const newItemEntryList = { ...state.itemEntryList };
            delete newItemEntryList[id];
            return { itemEntryList: newItemEntryList };
        });
        const updatedEntries = useEntriesStore.getState().itemEntryList;
        await setItem(updatedEntries);
        if (getAuth().currentUser) {
            // await deleteEntry(id);
        }
    },

    updateEntry: async (id: string, updatedFields: Partial<ExpenseEntry>) => {
        set((state) => {
            const updatedExpense = { ...state.itemEntryList[id], ...updatedFields };
            const newItemEntryList = { ...state.itemEntryList, [id]: updatedExpense };
            return { itemEntryList: newItemEntryList };
        });
        const updatedEntries = useEntriesStore.getState().itemEntryList;
        await setItem(updatedEntries);
        const user = getAuth().currentUser;
        if (user) {
            // await editEntryDetailsInFB({ id, ...updatedFields }).catch((err) =>
            //     console.error("Error updating entry in Firebase:", err)
            // );
        }
    },

}));
