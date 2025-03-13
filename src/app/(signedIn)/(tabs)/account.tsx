import { View, Text } from "@/src/components/Themed";
import { Pressable } from "react-native";
import { getAuth } from '@react-native-firebase/auth';
import { getApp } from "@react-native-firebase/app";
import { useRouter } from "expo-router";

export default function AccountScreen() {
    const firebaseAuthApp = getAuth(getApp()); 
    const router = useRouter();

    async function LogOut() {
        await firebaseAuthApp.signOut();
        router.replace('/(signedOut)');
    }
    return (
        <View>
            <Pressable onPress={LogOut}>
                <Text>SignOut</Text>
                </Pressable>
        </View>
    );
}