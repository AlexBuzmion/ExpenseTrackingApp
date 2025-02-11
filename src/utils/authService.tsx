import auth from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/app';

export const signUp = async (inEmail: string, inPassword: string) => {
    try {
        const response = await auth().createUserWithEmailAndPassword(inEmail, inPassword);
        return response;
    } catch (error) {
        const err = error as FirebaseError
        throw err;
    }
};

export const logIn = async (inEmail: string, inPassword: string) => {
    try {
        const response = await auth().signInWithEmailAndPassword(inEmail, inPassword);
        return response; 
    } catch (error) {
        const err = error as FirebaseError
        throw err;
    } 
};

export const signOut = async () => {
    try {
        await auth().signOut();
    } catch (error) {
        const err = error as FirebaseError
        throw err;
    }
};