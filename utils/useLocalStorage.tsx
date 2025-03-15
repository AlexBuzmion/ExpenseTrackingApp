import { ExpenseEntry } from "@/store/entriesStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const useLocalStorage = (key: string) => {
    const setItem = async (value: unknown) => {
        try {
            Platform.OS === 'web' 
            ? window.localStorage.setItem(key, JSON.stringify(value))
            :  await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    }

    const getItem = async (): Promise<Record<string,ExpenseEntry> | undefined> => {
        try {
            const storeData = Platform.OS === 'web' 
            ? window.localStorage.getItem(key)
            : await AsyncStorage.getItem(key);
            return storeData ? JSON.parse(storeData) : {};
        } catch (error) {
            console.error('Error reading from storage', error);
            return undefined;
        }
    };
    
    const deleteEntry = async (id: string) => {
        try {
            // get the current record from AsyncStorage
            const storedData = await AsyncStorage.getItem(key);
            const entries: Record<string, ExpenseEntry> = storedData ? JSON.parse(storedData) : {};
        
            // remove the entry with the specified id
            delete entries[id];
        
            // save the updated record back
            Platform.OS === 'web'
            ? window.localStorage.setItem(key, JSON.stringify(entries))
            : await AsyncStorage.setItem(key, JSON.stringify(entries));
        } catch (error) {
            console.error('Error removing from storage', error);
        }
    }

    return {
        setItem,
        getItem,
        deleteEntry,
    }
}; 