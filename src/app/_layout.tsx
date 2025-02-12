import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/components/useColorScheme';
import auth,{ firebase, FirebaseAuthTypes } from '@react-native-firebase/auth';
import { ActivityIndicator, Platform } from 'react-native';
import { View } from '../components/Themed';

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
    // ! Login related functions 
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
    
    const router = useRouter();
    const segments = useSegments();

    const [loaded, error] = useFonts({
        SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (initializing) return;
        const loggedInGroup = segments[0] === '(tabs)';

        if (user && !loggedInGroup) { 
            router.replace('/(tabs)');
        } else if (!user && loggedInGroup ){ 
            router.replace('/loginTest'); 
            alert(`Login required!`);
        }
    }, [user, initializing]);
    
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            console.log('onAuthStateChanged', user);
            setUser(user);
            if (initializing) setInitializing(false);
          });
          return subscriber;
    }, []);
    
    // ! Login related functions ends

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (initializing || !loaded) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        );
    }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack initialRouteName='loginTest'>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" 
                    options={{ presentation: 'card',  
                        headerShown: true, 
                        headerTitle: 'Add New Item' ,
                        headerBackButtonDisplayMode: 'minimal',
                    }}
                />
                <Stack.Screen name="loginTest"  options={{ headerShown: false}} />
            </Stack>
        </ThemeProvider>
    );
}
