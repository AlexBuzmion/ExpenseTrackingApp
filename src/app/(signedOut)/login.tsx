import { View, Text, InputText } from "@/src/components/Themed";
import { KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { AuthInfo } from "@/store/authStore";
import { FirebaseError } from "@firebase/app";
import { getAuth } from '@react-native-firebase/auth';
import { getApp } from "@react-native-firebase/app";

export default function LoginScreen() {
    const router = useRouter();
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setUser = AuthInfo((state) => state.setUser);
    const setSignedIn = AuthInfo((state) => state.setSignedIn);
    
    const firebaseAuthApp = getAuth(getApp())

    async function handleLogin() {
        setLoading(true);
        try {
            firebaseAuthApp.signInWithEmailAndPassword(email, password); 
            // await auth().signInWithEmailAndPassword(email, password);
        } catch (error: any) {
            const err = error as FirebaseError;
            alert(`Login failed: ${err.message}`);
        } finally {
            setSignedIn(true);
            setLoading(false);
        }
        // setSignedIn(!isSignedIn);
    };
    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <View style={styles.container}>

                <Text>Username</Text>
                <View style={styles.inputtextcontainer} >
                    <InputText value={email} onChangeText={setEmail} autoCapitalize="none"/>
                </View>

                <Text>Password</Text>
                <View style={styles.inputtextcontainer}>
                    <InputText style={{ flex: 1 }} secureTextEntry={!passwordVisibillity} value={password} onChangeText={setPassword} autoCapitalize="none"/>
                    <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                        <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={30} color={Colors.dark.tint} style={{ margin: 3}} />
                    </TouchableOpacity>
                </View>


                <TouchableOpacity style={[styles.button, { borderWidth: 0, margin: 10 }]} onPress={handleLogin}>
                    <Text>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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