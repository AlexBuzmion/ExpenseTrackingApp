import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Colors from "@/src/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {getApp} from "@firebase/app";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isSignedIn = useAuthStore(state => state.signedIn);
    const setSignedIn = useAuthStore((state) => state.setSignedIn);
    const firebaseAuth = getAuth(getApp());

    const refToPass = useRef<TextInput>(null);
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

            <Text>Email Address</Text>
            <View style={styles.inputtextcontainer}>
                <InputText 
                    style={{ flex: 1 }} 
                    onChangeText={setEmail} 
                    value={email} 
                    autoCapitalize="none"
                    keyboardType="email-address"    
                    placeholder="email address"
                    returnKeyType="next"
                    onSubmitEditing={() => refToPass.current?.focus()}
                    lightColor="fff"
                    darkColor="#222"
                />
            </View>

            <Text>Password</Text>
            <View style={styles.inputtextcontainer}>
                <InputText 
                    style={{ flex: 1 }} 
                    secureTextEntry={!passwordVisibillity} 
                    onChangeText={setPassword} 
                    value={password} 
                    autoCapitalize="none"
                    placeholder="password"
                    ref={refToPass}
                    lightColor="fff"
                    darkColor="#222"
                />
                <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                    <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={24} color={Colors.dark.tint} style={{ paddingRight: 6, paddingTop: 6 }} />
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
        alignItems: 'center',
        justifyContent: 'center',
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