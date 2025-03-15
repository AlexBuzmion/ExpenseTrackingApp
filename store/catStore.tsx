import { create } from "zustand";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
import { addCategoryToFB, addSubcategoryToFB, editCatInFB, editSubcatInFB, removeCatFromFB, removeSubcatFromFB } from "@/utils/firebaseUtils";
import { useLocalStorage } from "@/utils/useLocalStorage";

const { setItem, getItem } = useLocalStorage('categories');

type CategoriesType = {
    categories: Record<string, string[]>;  
    setCategories: (categories: Record<string, string[]>) => void
    initCategories: () => Promise<Record<string, string[]>>
    addCategory: (category: string) => void
    deleteCategory: (category: string) => void
    editCategory: (oldCategory: string, newCategory: string) => void
    addSubcategory: (category: string, subcategory: string) => void
    deleteSubcategory: (category: string, subcategory: string) => void
    editSubcategory: (category: string, oldSubcategory: string, newSubcategory: string) => void
};

export const useCategories = create<CategoriesType>((set) => ({
    categories: {},

    setCategories: (newCategories) => set({ categories: newCategories }),

    initCategories: async () => {
        const user = getAuth().currentUser;
        if (!user) {
            console.log('no user signed in');
            return {};
        }
        console.log('initializing categories');
        try {
            const docRef = doc(getFirestore(getApp()), "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as { categories: Record<string, string[]> };
                const newCats = data.categories;
                set({ categories: newCats });
                // console.log("Fetched categories:", newCats);
                // console.log("Setting categories:", useCategories.getState().categories);
                return newCats;
            }
        } catch (error: any) {
            alert(error.message);
            console.error("Error fetching categories:", error.message);
        }
        return {};
    },

    addCategory: (category: string) => set((state) => {
        // console.log('adding category', category);
        addCategoryToFB(category).catch((err:any) => console.error(err));
        return { categories: { ...state.categories, [category]: [] }, };
    }),

    deleteCategory: (category: string) => set((state) => {
        removeCatFromFB(category).catch((err:any) => console.error(err));
        const updated = { ...state.categories };
        delete updated[category];
        return { categories: updated };
    }),

    editCategory: (oldCategory: string, newCategory: string) => set((state) => {
        editCatInFB(oldCategory, newCategory).catch((err:any) => console.error(err));
        const updated = { ...state.categories };
        updated[newCategory] = updated[oldCategory];
        delete updated[oldCategory];
        return { categories: updated };
    }),

    addSubcategory: (category: string, subcategory: string) => set((state) => {
        addSubcategoryToFB(category, subcategory).catch((err:any) => console.error(err));
        return {
            categories: {
                ...state.categories,
                [category]: [...(state.categories[category] || []), subcategory],
            },
        }
    }),

    editSubcategory: (category: string, oldSubcategory: string, newSubcategory: string) => set((state) => {
        // editSubcatInFB(category, oldSubcategory, newSubcategory).catch((err) => console.error(err));
        addSubcategoryToFB(category, newSubcategory).catch((err:any) => console.error(err));
        removeSubcatFromFB(category, oldSubcategory).catch((err:any) => console.error(err));
        return {
            categories: {
                ...state.categories,
                [category]: (state.categories[category] || []).map((sub) => sub === oldSubcategory ? newSubcategory : sub)
              },
        }
    }), 

    deleteSubcategory: (category: string, subcategory: string) => set((state) => {
        removeSubcatFromFB(category, subcategory).catch((err:any) => console.error(err));
        return {
            categories: {
                ...state.categories,
                [category]: (state.categories[category] || []).filter((sub) => sub !== subcategory)
            },
        }
    })
}));

