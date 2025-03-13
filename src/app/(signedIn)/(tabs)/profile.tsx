import { View, Text } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { AuthInfo } from "@/store/signedInState";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function ProfileScreen() {
    const setSignedIn = AuthInfo(state => state.setSignedIn);
    const [isLoading, setIsLoading] = useState(false);
    const firebaseAuth = getAuth(getApp());
    
    async function logOut() {
        try {
            await firebaseAuth.signOut() 
            setIsLoading(false);
            setSignedIn(false);
        } catch (error: any) {
            alert(error.message);
        }

    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={[styles.loginButton, { borderWidth: 1.5, margin: 10}]} onPress={logOut}>
                <Text>LogOut</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        borderColor: Colors.light.tint, 
        borderRadius: 20,
        width: 100,
        height: 40, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        justifyContent: 'center', 
        alignItems: 'center',
    },
})
