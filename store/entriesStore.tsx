import { create } from 'zustand';
import uuid from 'react-native-uuid';
// import { getAuth } from 'firebase/auth';
// import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { convertDBMap, saveExpenseToFirestore } from '@/utils/firebaseUtils';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

type ExpenseEntry = {
    id: string;
    name: string;
    date: string;
    category: string;
    subcategory: string;
    subtotal: number;
    hst: number;
    total: number;
    creationDate: string;
};

type ExpenseListStore = {
    expenseList: ExpenseEntry[];
    setExpenseList: (expenses: ExpenseEntry[]) => void;
    addExpense: (expense: Omit<ExpenseEntry, "id">) => void; 
    removeExpense: (id: string) => void;
    updateExpense: (id: string, updatedFields: Partial<ExpenseEntry>) => void;
    initExpenseList: () => Promise<Record<string, ExpenseEntry>>;
};


export const useEntriesStore = create<ExpenseListStore>((set) => ({
    expenseList: [],
    setExpenseList: (expenses) => set({ expenseList: expenses }),
    addExpense: (expense) => set((state) => {
        const newExpense = { ...expense, id: uuid.v4() as string };
        saveExpenseToFirestore(newExpense).catch((err) => console.error(err));
        return {
          expenseList: [...state.expenseList, newExpense],
        };
    }),
    initExpenseList: async () => {
        const user = getAuth().currentUser;
        if (!user) {
            throw new Error('no user signed in');
        }
        console.log('fetching expenses');
        try {
            const docRef = doc(getFirestore(), 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const itemEntries = data.itemEntries;
                const convertedList = convertDBMap(itemEntries);
                set({ expenseList: convertedList });
                return itemEntries;
            }
        } catch (error: any) {
            alert(error.message);
            return error;
        } return {};
    }, 
    removeExpense: (id: string) => set((state) => ({
        expenseList: state.expenseList.filter(expense => expense.id !== id),
    })),
    updateExpense: (id: string, updatedFields: Partial<ExpenseEntry>) => 
        set((state) => ({
            expenseList: state.expenseList.map(expense =>
                expense.id === id ? { ...expense, ...updatedFields } : expense
            ),
    })),

}));
