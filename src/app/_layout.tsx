import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useEntriesStore } from '@/store/entriesStore';
import { generateExampleExpenses } from '@/src/components/generateExampleExpenses';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } from '@env';
import  { AuthInfo } from '@/store/authStore';
import { getApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { useTaxStore } from '@/store/taxStore';
import { getFirestore } from 'firebase/firestore';

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



export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    const firebaseConfig = { 
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID
    }
    const app = initializeApp(firebaseConfig);

    // call init taxrates on mount 
    useEffect(() => {
        useTaxStore.getState().initTaxRates();
    }, []);
    
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
        SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
    
    const colorScheme = useColorScheme();

    const router = useRouter();
    const firebaseAuth = getAuth(getApp());
    const db = getFirestore(getApp());

    //todo: update this to firebase to store the auth state
    const signedIn = AuthInfo((state) => state.signedIn);
    useEffect(() => {
        console.log('use Effect called!');
        if (signedIn) {
          router.replace('/(signedIn)');
        } else {
          router.replace('/(1signedOut)');
        }
      }, [signedIn]);


  return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
        </ThemeProvider>
  );
}
