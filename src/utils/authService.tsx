import auth from '@react-native-firebase/auth';
import { FirebaseError } from '@firebase/app';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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

export const googleSignIn = async () => {
    GoogleSignin.configure({
        scopes: ['profile', 'email'],
        webClientId: '887240321177-2mmpr2s2ugc7e0a4nnmkfo4peb557f4u.apps.googleusercontent.com',
    });

    try {
        // sign out any previous sessions
        await GoogleSignin.signOut();
        // ensure play services are available
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // attempt google sign in
        const googleSignInResult = await GoogleSignin.signIn();

        alert (`google signin result: ${JSON.stringify(googleSignInResult)}`);
        // create firebase credential from the idToken
        const googleCredential = auth.GoogleAuthProvider.credential(googleSignInResult.data?.idToken);
        
        // show welcome alert once data is available
        alert(`welcome! ${googleSignInResult.data?.user.email}`);
        
        // sign in with firebase using the google credential
        return await auth().signInWithCredential(googleCredential);
    } catch (error) {
        console.error('google sign in error:', error);
        alert(`google sign in error: ${error}`);
        throw error;
    }
};
