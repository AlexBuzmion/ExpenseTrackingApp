import { ExpenseEntry } from "@/store/entriesStore";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";

type FBItemEntry = {
    a: string;
    b: string;
    c: string;
    d: string;
    e: number;
    f: number;
    g: number;
};

// generic helper functions
function formatEntry(expense: any): Record<string, any> {
    return {
        a: expense.name, 
        b: expense.date,
        c: expense.category,
        d: expense.subcategory,
        e: expense.subtotal,
        f: expense.hst,
        g: expense.total
    }
}

export const useFirebaseUtils = () => {
    const saveEntryToDB = async (expense: ExpenseEntry) => {
        const user = getAuth().currentUser;
        if (!user) {
            throw new Error('no user signed in');
        }
        const formattedData = formatEntry(expense);
        console.log('formattedData', formattedData);
        console.log('firebaseUtils saveEntryToDB');
        try {
            await updateDoc(doc(getFirestore(), 'users', user.uid), {
                    [`itemEntries.${expense.id}`]: formattedData
                }
            );
        } catch (error: any) {
            alert(error.message);
            return error;
        }
    }
    
    const convertDBMap =  (expenseMap: Record<string, FBItemEntry>): any[] => {
        return Object.entries(expenseMap).map(([id, data]) => ({
            id,                // key from the Firestore map
            name: data.a,      // 'a' maps to name
            date: data.b,      // 'b' maps to date; if this is also the creationDate, we can use it for both
            category: data.c,  // 'c' maps to category
            subcategory: data.d, // 'd' maps to subcategory
            subtotal: data.e,  // 'e' maps to subtotal
            hst: data.f,       // 'f' maps to tax/hst
            total: data.g,     // 'g' maps to total
            creationDate: data.b // if creationDate is the same as b, otherwise adjust accordingly
        }));
    }
    return { 
        saveEntryToDB,
        convertDBMap, 

    };

};