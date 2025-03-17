import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {getApp} from "@firebase/app";
import { getAuth , createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { useTaxStore } from "@/store/taxStore";


export default function SignupScreen() {
    const router = useRouter();
    const firebaseAuth = getAuth(getApp());
    const db = getFirestore(getApp());
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);

    const refToEmail = useRef<TextInput>(null); 
    const refToPass = useRef<TextInput>(null);
    const refToConfirmPass = useRef<TextInput>(null);

    async function handleSignup(){
        setIsLoading(true);
        // if (checkPasswordValidity() != '') {
        //     alert(checkPasswordValidity());
        //     return;
        // }
        // if (checkEmailValidity() != '') {
        //     alert(checkEmailValidity());
        //     return;
        // }
        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = firebaseAuth.currentUser;
            if (user) {
                try {
                    await updateProfile(user, { displayName: username });
                } catch (error: any) {
                    alert(error.message);
                }
                try { 
                    await sendEmailVerification(user);
                } catch (error: any) {
                    alert(error.message);
                }
                try {
                    await setDoc(doc(db, "users", user.uid), {
                        // more user data here
                        firstTime: true ,// flag for first time login
                        itemEntries: {},
                        categories: {},
                    });

                } catch (error: any) {
                    alert(error);
                }
            }
            alert("Please check your email to verify your account.");
            router.push('/(1signedOut)/login');
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    //todo ensure this function works
    function checkPasswordValidity() {
        return 'Tiago, add password validation check'; 
    }

    //todo ensure there is a email regex check
    function checkEmailValidity() {
        return 'Tiago, add email validation check';
    }

    return (
        <View style={styles.container}>
            <Text>Username</Text>
            <InputText 
                style={styles.inputtextcontainer} 
                onChangeText={setUsername} 
                value={username} 
                placeholder="Username"
                autoCapitalize="none"
                autoFocus 
                returnKeyType="next" 
                onSubmitEditing={() => refToEmail.current?.focus()}
            />

            <Text>Email address</Text>
            <InputText 
                style={styles.inputtextcontainer} 
                onChangeText={setEmail} 
                value={email} 
                placeholder="Email address"
                keyboardType="email-address"
                autoCapitalize="none" 
                ref={refToEmail}
                returnKeyType="next" 
                onSubmitEditing={() => refToPass.current?.focus()}
            />

            <Text>Password</Text>
            <View style={styles.inputtextcontainer}>
                <InputText 
                    style={{ flex: 1 }} 
                    secureTextEntry={!passwordVisibillity} 
                    onChangeText={setPassword} 
                    value={password} 
                    placeholder="Password"
                    autoCapitalize="none"
                    ref={refToPass}
                    returnKeyType="next" 
                    onSubmitEditing={() => refToConfirmPass.current?.focus()}
                />
                <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                    <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={24} color={Colors.dark.tint} style={{ paddingRight: 6, paddingTop: 6}} />
                </TouchableOpacity>
            </View>

            <Text>Confirm Password</Text>
            <View style={styles.inputtextcontainer}>
                <InputText 
                    style={{ flex: 1 }} 
                    secureTextEntry={!passwordVisibillity} 
                    onChangeText={setConfirmPassword} 
                    value={confirmPassword} 
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    ref={refToConfirmPass}
                />
                <TouchableOpacity onPress={() => setPasswordVisibillity(!passwordVisibillity)}>
                    {/* <Ionicons name={passwordVisibillity ? 'eye' : 'eye-off'} size={30} color={Colors.dark.tint} style={{ margin: 3}} /> */}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, { borderWidth: 0, margin: 10 }]} onPress={handleSignup} disabled={isLoading}>
                {isLoading ? <ActivityIndicator /> : <Text>Sign Up</Text>}
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
        width: '60%' 
    }
});