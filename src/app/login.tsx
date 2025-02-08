import { View, Text, InputText } from "../components/Themed";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { Button } from "react-native";
import Colors from "../constants/Colors";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    return (
        <View style={styles.container}>
             <Text>Username</Text>
            <InputText 
                style={{ borderWidth: 1, borderColor: 'grey'}}
            />
            <Text>Password</Text>
            <InputText 
                style={{ borderWidth: 1, borderColor: 'grey'}}
            />

            <Ionicons name='eye' size={30} color={Colors.dark.tint} />

            <TouchableOpacity 
                style={[styles.button, { borderWidth: 0, margin: 10 }]}
                >
                <Text>Login</Text>
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