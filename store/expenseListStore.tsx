import { create } from 'zustand';
import uuid from 'react-native-uuid';
import { getAuth } from 'firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

type CategoriesType = {
    [key: string]: string[];  // 
};

export const categories : CategoriesType= {
    'Advertising and Marketing': [
        'Business Cards, Flyers, Brochures',
        'Photography & Videography',
        'Post Installation',
        'Printing Advertisements',
        'Property Staging',
        'Signage & Banners',
        'Social Meida Promotions',
        'Website Design, Maintenance',
    ], 
    'Bank and Financial Fees': [
        'Bank Fees for Business Accounts',
        'Credit Card processing fees',
        'Interest on Business Loans',
    ], 
    'Business Supplies and Equipment': [
        'Computer, Laptops, Tables & Accessories',
        'Mobile Phone & Phone Plans',
        'Software Subscriptions',
        'Stationery & Office Supplies',
    ],
    'Client Related Expenses': [
        'Client Gifts',
        'Meals & Entertainment',
        'Open House Expenses',
        'Status Certificate For Listings', 
    ],
    'Fees & Licenses': [
        'Licenses Renewal Costs',
        'Brokerage Fees',
        'MLS Subscriptions',
        'Real Estate Board Fees',
    ],
    'Home Office Expenses': [
        'Furniture and Equipment',
        'Home Insurance',
        'Internet',
        'Phone Cost',
    ],
    'Insurance': [
        'Business Liability Insurance',
        'Health & Disability Insurance',
        'RECO (Error & Omission) Insurance',
    ],
    'Miscellaneous': [
        'Courier and postage costs',
        'Personal protective equipment',
        'Small tools and supplies',
        'Donations',
    ],
    'Professional Development': [
        'Certification & Accreditations',
        'Professional Associations Memberships (CREA, OREA)',
        'Real Estate Course & Continuing Education',
        'Seminar, Conferences & Workshops',
    ],
    'Professional Services': [
        'Accountant or bookkeeper fees',
        'Consulting fees',
        'Legal fees for contracts or disputes',
    ],
    'Sales / Commission / Income': [
        'Commission Income',
        'CRA',
        'Revenue Share',
    ],
    'Travel Expenses': [
        'Hotel Accommodation',
        'Meal during business travel',
        'Transportation Cost for out of town work',
    ],
    'Vehicle Expenses': [
        'Car Insurance',
        'Gas/Fuel',
        'Parking Fees',
        'Licensing & Registration Fees',
        'Repair & Service Maintenance'
    ],
};

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
    categories: CategoriesType;
    addCategory: (category: string) => void;
    addSubcategory: (category: string, subcategory: string) => void;
    renameCategory: (oldCategory: string, newCategory: string) => void;
    renameSubcategory: (category: string, oldSubcategory: string, newSubcategory: string) => void;
};

const db = getFirestore();

async function saveExpenseToFirestore(expense: ExpenseEntry) {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error('no user signed in');
    }
    await setDoc(
      doc(db, 'users', user.uid, 'item-entries', expense.id),
      expense
    );
  }

export const useExpenseListStore = create<ExpenseListStore>((set) => ({
    expenseList: [],
    categories,
    setExpenseList: (expenses) => set({ expenseList: expenses }),
    // addExpense: (expense) => set((state) => ({
    //     expenseList: [
    //         ...state.expenseList,
    //         { ...expense, id: uuid.v4() as string }, 
    //         // this is where the cloud storing happens
    //     ],
    // })),
    addExpense: (expense) => set((state) => {
        const newExpense = { ...expense, id: uuid.v4() as string };
        saveExpenseToFirestore(newExpense).catch((err) => console.error(err));
        return {
          expenseList: [...state.expenseList, newExpense],
        };
    }),
    removeExpense: (id: string) => set((state) => ({
        expenseList: state.expenseList.filter(expense => expense.id !== id),
    })),
    updateExpense: (id: string, updatedFields: Partial<ExpenseEntry>) => 
        set((state) => ({
            expenseList: state.expenseList.map(expense =>
                expense.id === id ? { ...expense, ...updatedFields } : expense
            ),
    })),

    // Adding new categories
    addCategory: (category) => set((state) => ({
        categories: { ...state.categories, [category]: [] },
    })),
    addSubcategory: (category, subcategory) => set((state) => ({
        categories: {
            ...state.categories,
            [category]: [...(state.categories[category] || []), subcategory],
        },
    })),

    // Renaming a category
    renameCategory: (oldCategory, newCategory) => set((state) => {
        if (!state.categories[oldCategory]) return state;
        const newCategories = { ...state.categories };
        newCategories[newCategory] = newCategories[oldCategory];
        delete newCategories[oldCategory];
        return { categories: newCategories };
    }),

    // Renaming a subcategory
    renameSubcategory: (category, oldSubcategory, newSubcategory) => set((state) => {
        if (!state.categories[category]) return state;
        const newSubcategories = state.categories[category].map(sub =>
            sub === oldSubcategory ? newSubcategory : sub
        );
        return { categories: { ...state.categories, [category]: newSubcategories } };
    }),
}));
