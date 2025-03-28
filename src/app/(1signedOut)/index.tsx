import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { getAuth, signInAnonymously } from "firebase/auth";
import { useState } from "react";
import CustomButton from "@/src/components/CustomButton";

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
            {/* <TouchableOpacity style={[styles.loginButton, { borderWidth: 1.5, margin: 10}]} onPress={() => router.navigate("/login")}>
                <Text>Login</Text>
            </TouchableOpacity> */}
            <CustomButton 
                title="Login"
                onPressFunc={() => router.navigate("/login")}
                variant="primary-inverted"
                borderWidth={1}
                margin={10}
            />
            <Text>- or -</Text>
            
            <CustomButton 
                title="Sign Up"
                onPressFunc={() => router.navigate("/signup")}
                variant="secondary"
                borderWidth={1}
                margin={10}
            />

            <CustomButton
                title="Continue as Guest . . ."
                onPressFunc={handleAnonymousLogin}
                variant="secondary-alternative"
                borderWidth={1}
                margin={10}
                buttonStyle={ {position: 'absolute', bottom: 80}}
            />
            
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
    // loginButton: {
    //     borderColor: Colors.light.tint, 
    //     borderRadius: 20,
	// 	width: 100,
	// 	height: 40, 
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
	// 	justifyContent: 'center', 
	// 	alignItems: 'center',
	// },
    // signupButton: {
    //     backgroundColor: Colors.light.tint,
    //     borderRadius: 20,
	// 	width: 100,
	// 	height: 40, 
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 4,
	// 	justifyContent: 'center', 
	// 	alignItems: 'center',
	// },
    // buttonText: {
    //     color: Colors.dark.tint,
    //     fontSize: 16,
    //     fontWeight: 'bold',
    // }
});