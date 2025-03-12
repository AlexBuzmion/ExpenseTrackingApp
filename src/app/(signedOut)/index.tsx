import { View, Text, InputText } from "@/src/components/Themed";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { Button } from "react-native";
import Colors from "@/src/constants/Colors";

export default function AccountScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>

            <Text style={styles.title}>Welcome</Text>

            <TouchableOpacity style={[styles.loginButton, { borderWidth: 1.5, margin: 10}]} onPress={() => router.navigate("/login")}>
                <Text>Login</Text>
            </TouchableOpacity>

            <Text>- or -</Text>

            <TouchableOpacity style={[styles.signupButton, { borderWidth: 0, margin: 10 }]} onPress={() => router.navigate("/signup")}>
                <Text>Sign Up</Text>
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
});