import { View, Text, InputText } from "../components/Themed";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "../constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";

function handleLogin() {

};

export default function LoginScreen() {
    const router = useRouter();

    const [passwordVisibillity, setPasswordVisibillity] = useState(false);

    return (
        <View style={styles.container}>

            <Text>Username</Text>
            <View style={styles.inputtextcontainer}>
                <InputText/>
            </View>

            <Text>Password</Text>
            <View style={styles.inputtextcontainer}>
                <InputText secureTextEntry={!passwordVisibillity} />
                <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                    <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={30} color={Colors.dark.tint} style={{ margin: 3}} />
                </TouchableOpacity>
            </View>


            <TouchableOpacity style={[styles.button, { borderWidth: 0, margin: 10 }]} onPress={handleLogin}>
                <Text>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        padding: 10,
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
    },
    inputtextcontainer: {
        borderColor: '#ccc', 
        borderWidth: 1, 
        borderRadius: 8,  
        flexDirection: 'row',
        marginBottom: 10,
        width: '60%' 
    }
});