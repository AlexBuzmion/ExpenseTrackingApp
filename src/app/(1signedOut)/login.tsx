import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from "@/src/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { AuthInfo } from "@/store/authStore";
import {getApp} from "@firebase/app";
import { getAuth , signInAnonymously, signInWithEmailAndPassword} from "firebase/auth";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isSignedIn = AuthInfo(state => state.signedIn);
    const setSignedIn = AuthInfo((state) => state.setSignedIn);
    const firebaseAuth = getAuth(getApp());

    async function handleLogin() {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            const userVerified = getAuth().currentUser?.emailVerified;
            if(!userVerified) throw new Error('email not verified');
            setSignedIn(!isSignedIn);
            // console.log(firebaseAuth.currentUser);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>

            <Text>Username</Text>
            <View style={styles.inputtextcontainer} lightColor="fff" darkColor="#222">
                <InputText style={{ flex: 1 }} onChangeText={setEmail} value={email} autoCapitalize="none"
                    lightColor="fff"
                    darkColor="#222"
                />
                
            </View>

            <Text>Password</Text>
            <View style={styles.inputtextcontainer} lightColor="fff" darkColor="#222">
                <InputText style={{ flex: 1 }} 
                    secureTextEntry={!passwordVisibillity} 
                    onChangeText={setPassword} 
                    value={password} 
                    autoCapitalize="none"
                    lightColor="fff"
                    darkColor="#222"
                />
                <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                    <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={30} color={Colors.dark.tint} style={{ margin: 3}} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, { borderWidth: 0, margin: 10 }]} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Login</Text>}
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
        width: '60%',
    },
    buttonText: {
        color: Colors.dark.tint,
        fontSize: 16,
        fontWeight: 'bold',
    }
});