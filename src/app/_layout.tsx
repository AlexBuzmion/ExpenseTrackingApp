import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, usePathname, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/components/useColorScheme';
// import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@/.env';
import  { useAuthStore } from '@/store/authStore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { useTaxStore } from '@/store/taxStore';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    // initialRouteName: '(1signedOut)/index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const firebaseConfig = { 
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
}

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); 
}
//! turning this off now to ensure the user auth is not stored locally while working on the app
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // call init taxrates on mount 
    useEffect(() => {
        useTaxStore.getState().initTaxRates();
    }, []);
    
    useEffect(() => {
        console.log(`first time user? ${useAuthStore.getState().firstTimeUser}`)
    }, [useAuthStore.getState().firstTimeUser]);
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
        SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) { return null; }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const db = getFirestore(getApp());
    
    getAuth().onAuthStateChanged(onAuthStateChanged);
    async function onAuthStateChanged(user: any) {
        console.log("user", user);
        const FTU = await useAuthStore.getState().initFirstTimeUser();
        if (user) {
            // user is signed in (either anonymous or not)
            // setUser(user.uid);
            if (useAuthStore.getState().firstTimeUser ) {
                router.replace('/(onboarding)/onboarding');
            } else {
                router.replace('/(signedIn)');
            }
        } else {
            console.log("User is signed out.");
            router.replace('/(1signedOut)');
        }
    }
    //todo: update this to firebase to store the auth state

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
        </ThemeProvider>
    );
}
