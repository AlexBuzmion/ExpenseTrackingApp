import { taxRatesStore } from "@/store/provincialTaxStore";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

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

// helper function to convert Firestore map to ExpenseEntry[]
export function convertDBMap(
    expenseMap: Record<string, { a: string; b: string; c: string; d: string; e: number; f: number; g: number }>
  ): any[] {
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

// firestore specific functions 
export async function saveExpenseToFirestore(expense: any) {
    const user = getAuth().currentUser;
    if (!user) {
      	throw new Error('no user signed in');
    }
    const formattedData = formatEntry(expense);
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

// retrieves users(folder)->userid(folder)->ALL contents
export async function getUserDataFromFirestore() {
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
            console.log('itemEntries:' ,itemEntries);
            return itemEntries;
        }
    } catch (error: any) {
        alert(error.message);
        return error;
    }
}


export async function fetchProvTaxRates() {
        // create the doc ref, then get the doc
        const docRef = doc(getFirestore(getApp()), "app-configs", "provincial-tax-rates");
        let docSnap;
        try {
            // get the doc
            docSnap = await getDoc(docRef);
            if (docSnap?.exists()) {
                const data = docSnap.data() as Record<string, { GST: number; HST: number; PST: number }>;
                console.log(data);
                return data;
            }
        } catch (error: any) {
            alert(error.message);
        }
    }
// fireauth specific functions 