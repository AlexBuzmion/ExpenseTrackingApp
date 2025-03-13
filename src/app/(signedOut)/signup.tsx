import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import auth from '@react-native-firebase/auth';
import { FirebaseError } from "@firebase/app";
import { onAuthStateChanged } from "@react-native-firebase/auth";

export default function SignupScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handleSignup(){
        setLoading(true);
        if (!checkPasswordMatch()) return;
        try {
            await auth().createUserWithEmailAndPassword(email, password);
            alert('Check your emails')
        } catch (error: any) {
            const err = error as FirebaseError;
            alert(`Sign up failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };


    //todo create a regex checker for email and password
    //todo create confirmation page 

    function checkPasswordMatch() {
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            setLoading(false);
            return false;
        }
        return true;
    }
    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <View style={styles.container}>
                {/* <Text>Username</Text>
                <InputText style={styles.inputtextcontainer}/> */}

                <Text>Email address</Text>
                <InputText style={styles.inputtextcontainer} value={email} onChangeText={setEmail} autoCapitalize="none"/>

                <Text>Password</Text>
                <View style={styles.inputtextcontainer}>
                    <InputText style={{ flex: 1 }} value={password} onChangeText={setPassword} secureTextEntry={!passwordVisibillity} autoCapitalize="none"/>
                    <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                        <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={30} color={Colors.dark.tint} style={{ margin: 3}} />
                    </TouchableOpacity>
                </View>

                <Text>Confirm Password</Text>
                <View style={styles.inputtextcontainer}>
                    <InputText style={{ flex: 1 }} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!passwordVisibillity} autoCapitalize="none"/>
                    <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                        <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={30} color={Colors.dark.tint} style={{ margin: 3}} />
                    </TouchableOpacity>
                </View>
                { loading ? (
                    <ActivityIndicator size="small" color={Colors.light.tint} />
                ) : (
                    <TouchableOpacity style={[styles.button, { borderWidth: 0, margin: 10 }]} onPress={handleSignup}>
                        <Text>Sign Up</Text>
                    </TouchableOpacity>
                )
                }
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