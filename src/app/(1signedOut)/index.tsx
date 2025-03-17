import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useState } from "react";


export default function AccountScreen() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleAnonymousLogin() {
        setIsLoading(true);
        const auth = getAuth();
        try {
            await signInAnonymously(auth);
            setIsLoading(false);
            //   console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    const router = useRouter();
    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Welcome</Text>
            <TouchableOpacity style={[styles.loginButton, { borderWidth: 1.5, margin: 10}]} onPress={() => router.navigate("/login")}>
                <Text>Login</Text>
            </TouchableOpacity>

            <Text>- or -</Text>

            <TouchableOpacity style={[styles.signupButton, { borderWidth: 0, margin: 10 }]} onPress={() => router.navigate("/signup")}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[ { borderWidth: 0, margin: 10, position: 'absolute', bottom: 200 }]} onPress={handleAnonymousLogin} disabled={isLoading}>
                <Text>continue as guest</Text>
            </TouchableOpacity> 
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10
    },
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
    signupButton: {
        backgroundColor: Colors.light.tint,
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
    buttonText: {
        color: Colors.dark.tint,
        fontSize: 16,
        fontWeight: 'bold',
    }
});