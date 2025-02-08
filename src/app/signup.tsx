import { View, Text, InputText } from "../components/Themed";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { Button } from "react-native";
import Colors from "../constants/Colors";

export default function SignUpScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
             <Text>Username</Text>
            <InputText 
                style={{ borderWidth: 1, borderColor: 'grey'}}
            />
            <Text>Email address</Text>
            <InputText 
                style={{ borderWidth: 1, borderColor: 'grey'}}
            />
            <Text>Password</Text>
            <InputText 
                style={{ borderWidth: 1, borderColor: 'grey'}}
            />
            <Text>Confirm Password</Text>
            <InputText 
                style={{ borderWidth: 1, borderColor: 'grey'}}
            />

            <TouchableOpacity 
                style={[styles.button, { borderWidth: 0, margin: 10 }]}
                >
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
    },
    button: {
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
    }
});