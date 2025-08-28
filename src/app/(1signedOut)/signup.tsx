import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import Colors from "@/src/constants/Colors";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getApp } from "@firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { useTaxStore } from "@/store/taxStore";
import DismissKeyboardView from "@/src/components/DismissKeyboardView";
import CustomButton from "@/src/components/CustomButton";
import { InputTextField } from "@/src/components/InputTextField";


const SignupScreen = () => {
    const router = useRouter();
    const firebaseAuth = getAuth(getApp());
    const db = getFirestore(getApp());
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);

    const refToEmail = useRef<any>(null);
    const refToPass = useRef<any>(null);
    const refToConfirmPass = useRef<any>(null);

    async function handleSignup() {
        await firebaseAuth.signOut()
        setIsLoading(true);

        const passwordValidityMessage = checkPasswordValidity();
        if (passwordValidityMessage != '') {
            alert(passwordValidityMessage);
            setIsLoading(false);  // Stop loading if validation fails
            return;
        }

        const emailValidityMessage = checkEmailValidity();
        if (emailValidityMessage != '') {
            alert(emailValidityMessage);
            setIsLoading(false);  // Stop loading if validation fails
            return;
        }

        try {
            await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const user = firebaseAuth.currentUser;
            if (user) {
                try {
                    await updateProfile(user, { displayName: name });
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
                        firstTime: true,// flag for first time login
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
            if (error.code === 'auth/email-already-in-use') {
                alert("This email address is already in use. Please try logging in or using a different email.");
            } else {
                alert(error.message); // Display other potential errors
            }
        } finally {
            setIsLoading(false);
        }
    };

    function checkPasswordValidity() {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        // Regex checks
        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;  // Expanded special characters
        const numericRegex = /[0-9]/;

        if (!uppercaseRegex.test(password)) {
            return "Password must contain at least one uppercase character.";
        }
        if (!lowercaseRegex.test(password)) {
            return "Password must contain at least one lowercase character.";
        }
        if (!specialCharRegex.test(password)) {
            return "Password must contain at least one special character. Ex.: !@#$%^&*(),.?\":{}|<>";
        }
        if (!numericRegex.test(password)) {
            return "Password must contain at least one numeric character.";
        }

        return ''; // Password is valid
    }

    function checkEmailValidity() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }
        return ''; // Email is valid
    }

    return (
        <DismissKeyboardView>
            <View style={styles.container}>
                <InputTextField
                    headerTitle='Your Name'
                    onChangeText={setName}
                    value={name}
                    placeholder="Enter your full name"
                    autoCapitalize="words"
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={() => refToEmail.current?.focus()}
                />

                <InputTextField
                    headerTitle='Email Address'
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    ref={refToEmail}
                    returnKeyType="next"
                    onSubmitEditing={() => refToPass.current?.focus()}
                />

                <InputTextField
                    headerTitle='Password'
                    secureTextEntry={!passwordVisibillity}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    autoCapitalize="none"
                    ref={refToPass}
                    returnKeyType="next"
                    onSubmitEditing={() => refToConfirmPass.current?.focus()}
                    inputInstructions={
                        <View>
                            <Text>Password must be at least 8 characters long.</Text>
                            <Text>Include one uppercase letter.</Text>
                            <Text>Include one lowercase letter.</Text>
                            <Text>Include one number.</Text>
                            <Text>Include one special character.</Text>
                        </View>
                    }
                />
                <InputTextField
                    headerTitle='Confirm Password'
                    secureTextEntry={!passwordVisibillity}
                    onChangeText={setConfirmPassword}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    autoCapitalize="none"
                    ref={refToConfirmPass}
                />


                {isLoading
                    ? <ActivityIndicator />
                    : (
                        <>
                            <CustomButton
                                title="Sign Up"
                                onPressFunc={handleSignup}
                                variant="primary"
                                borderWidth={1.5}
                                margin={10}
                            />
                            <CustomButton
                                title="Cancel"
                                onPressFunc={() => router.navigate('/(1signedOut)')}
                                variant="secondary"
                            />
                        </>
                    )}


            </View>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    inputtextcontainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        marginBottom: 10,
        width: '60%'
    },
});

export default SignupScreen;