import { View, Text, InputText } from "@/src/components/Themed";
import { ActivityIndicator, Platform, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Colors from "@/src/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import {getApp} from "@firebase/app";
import { getAuth, signInWithEmailAndPassword} from "firebase/auth";
import CustomButton from "@/src/components/CustomButton";
import DismissKeyboardView from "@/src/components/DismissKeyboardView";
import { InputTextField } from "@/src/components/InputTextField";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibillity, setPasswordVisibillity] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isFirstTime = useAuthStore(state => state.firstTimeUser);
    const firebaseAuth = getAuth(getApp());
    const refToPass = useRef<TextInput>(null);

    async function handleLogin() {
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            const userVerified = getAuth().currentUser?.emailVerified;
            if(!userVerified) throw new Error('email not verified');
            alert(`Hello! ${firebaseAuth.currentUser?.displayName}`);
            console.log(`isFirstTimeUser ${isFirstTime}`);
            isFirstTime ? router.replace('/(onboarding)/onboarding') : router.replace('/(signedIn)');
            // console.log(firebaseAuth.currentUser);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DismissKeyboardView>
            <View style={styles.container}>
                <InputTextField
                    headerTitle='Email'
                    value={email}
                    onChangeText={setEmail}
                    placeholder='Enter email'
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={() => refToPass.current?.focus()}
                />
                <InputTextField
                    headerTitle='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Enter password'
                    autoCapitalize="none"
                    ref={refToPass}
                />
                    
                {isLoading 
                    ? <ActivityIndicator />
                    : (
                        <>
                            <CustomButton
                                title="Login"
                                onPressFunc={handleLogin}
                                variant="primary-inverted"
                                borderWidth={1}
                                margin={10}
                                disabled={isLoading}
                                buttonStyle={{ alignItems: 'center' }}
                            />
                            <CustomButton
                                title="Cancel"
                                onPressFunc={() =>router.navigate('/(1signedOut)')}
                                variant="secondary-inverted"
                            />
                        </>
                    )
                }

            </View>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputtextcontainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10,
        width: '90%',
        height: Platform.OS === 'ios' ? '7.5%' : '8%'
    },
});