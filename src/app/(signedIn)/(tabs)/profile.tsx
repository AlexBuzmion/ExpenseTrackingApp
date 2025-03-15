import { View, Text } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { AuthInfo } from "@/store/authStore";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export default function ProfileScreen() {
    const setUser = AuthInfo(state => state.setUserId);
    const [isLoading, setIsLoading] = useState(false);
    const firebaseAuth = getAuth(getApp());
    
    async function logOut() {
        try {
            await firebaseAuth.signOut() 
            setIsLoading(false)
            setUser('');
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity style={[styles.loginButton, { borderWidth: 1.5, margin: 10}]} onPress={logOut}>
                {isLoading? <ActivityIndicator /> : <Text>LogOut</Text>}
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
