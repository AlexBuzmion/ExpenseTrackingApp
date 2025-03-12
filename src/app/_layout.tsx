import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useExpenseListStore } from '@/store/expenseListStore';
import { generateExampleExpenses } from '@/src/components/generateExampleExpenses';
import  { AuthInfo } from '@/store/signedInState';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

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
    const setExpenseList = useExpenseListStore(state => state.setExpenseList); // Get setExpenseList
    const router = useRouter();

    // Use useEffect to initialize the store *once* when the component mounts
    useEffect(() => {
        const exampleExpenses = generateExampleExpenses(12); // Generate 20 example expenses
        setExpenseList(exampleExpenses); // Set the expenses in the store
    }, []); // Empty dependency array ensures this runs only once

    //todo: update this to firebase to store the auth state
    const signedIn = AuthInfo((state) => state.signedIn);
    useEffect(() => {
        console.log('use Effect called!');
        if (signedIn) {
          router.replace('/(signedIn)');
        } else {
          router.replace('/(signedOut)');
        }
      }, [signedIn]);


  return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Slot />
        </ThemeProvider>
  );
}
