import { create } from "zustand";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
// import { addCategoryToFB, addSubcategoryToFB, editCatInFB, editSubcatInFB, removeCatFromFB, removeSubcatFromFB } from "@/utils/firebaseUtils";
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

    setCategories: (newCategories) => {
        setItem(newCategories);
        set({ categories: newCategories })
    },

    initCategories: async () => {
        console.log('initializing categories');
        const storedCategories = await getItem();
        const user = getAuth().currentUser;
        if (user) {
            // try {
            //     const docRef = doc(getFirestore(getApp()), "users", user.uid);
            //     const docSnap = await getDoc(docRef);
            //     if (docSnap.exists()) {
            //         const data = docSnap.data() as { categories: Record<string, string[]> };
            //         const newCats = data.categories;
            //         set({ categories: newCats });
            //         // console.log("Fetched categories:", newCats);
            //         // console.log("Setting categories:", useCategories.getState().categories);
            //         return newCats;
            //     }
            // } catch (error: any) {
            //     alert(error.message);
            //     console.error("Error fetching categories:", error.message);
            // }
        }
        set ({ categories: storedCategories || {} });
        return {};
    },

    addCategory: async (category: string) => {
        set((state) => { 
            const updatedCategories = { ...state.categories, [category]: [] }
            return { categories: updatedCategories};
        });
        const updatedCategories = useCategories.getState().categories;
        setItem(updatedCategories);
    }, 

    deleteCategory: (category: string) => {
        const updatedCategories = { ...useCategories.getState().categories };
        delete updatedCategories[category];
        set((state) => {
        // removeCatFromFB(category).catch((err:any) => console.error(err));
            return { categories: updatedCategories };
        });
        setItem(updatedCategories);

    },

    editCategory: (oldCategory: string, newCategory: string) => {
        const categoriesCopy = useCategories.getState().categories;
        if (!categoriesCopy[oldCategory]) return; // the category to edit doesn't exist, return
        const updatedCategories = { ...categoriesCopy };
        updatedCategories[newCategory] = updatedCategories[oldCategory];
        delete updatedCategories[oldCategory];
        set((state) => {
            // editCatInFB(oldCategory, newCategory).catch((err:any) => console.error(err));
            return { categories: updatedCategories };
        });
        setItem(updatedCategories);
    },

    addSubcategory: (category: string, subcategory: string) => {
        const currentCategories = useCategories.getState().categories;
        const updatedCategories = { ...currentCategories, [category]: [...(currentCategories[category] || []), subcategory] };
        set((state) => {
            return { categories:  updatedCategories }
        })   
        setItem(updatedCategories);
        // addSubcategoryToFB(category, subcategory).catch((err:any) => console.error(err));
    },

    editSubcategory: (category: string, oldSubcategory: string, newSubcategory: string) => {
        const currentCategories = useCategories.getState().categories;
        if (!currentCategories[category]) return; // the category to edit doesn't exist, return 
        const updatedCategories = { ...currentCategories, [category]: [...(currentCategories[category] || []).map((sub) => sub === oldSubcategory ? newSubcategory : sub)] };
        set((state) => {
            return { categories: updatedCategories } 
        })
        setItem(updatedCategories);
        // editSubcatInFB(category, oldSubcategory, newSubcategory).catch((err) => console.error(err));
        // addSubcategoryToFB(category, newSubcategory).catch((err:any) => console.error(err));
        // removeSubcatFromFB(category, oldSubcategory).catch((err:any) => console.error(err));
    }, 

    deleteSubcategory: (category: string, subcategory: string) => {
        const currentCategories = useCategories.getState().categories;
        const updatedCategories = { ...currentCategories, [category]: [...(currentCategories[category] || []).filter((sub) => sub !== subcategory)]}
        if (!currentCategories[category]) return;
        set((state) => {
            return { categories: updatedCategories }
        })
        setItem(updatedCategories);
        // removeSubcatFromFB(category, subcategory).catch((err:any) => console.error(err));
    }

})); 
