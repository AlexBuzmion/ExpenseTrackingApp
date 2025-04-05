import { View, Text } from "@/src/components/Themed";
import Colors from "@/src/constants/Colors";
import { useAuthStore } from "@/store/authStore";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "expo-router";
import CustomButton from "@/src/components/CustomButton";

export default function ProfileScreen() {
    const router = useRouter();
    const setUser = useAuthStore(state => state.setUserId);
    const [isLoading, setIsLoading] = useState(false);
    const firebaseAuth = getAuth(getApp());
    async function logOut() {
        console.log(`user: ${firebaseAuth.currentUser}`);
        try {
            await firebaseAuth.signOut() 
            setIsLoading(false)
            setUser('');
            router.replace('/(1signedOut)');
        } catch (error: any) {
            alert(error.message);
        }
    }
    
    function handleCategoriesPage()
    {
        router.push("/categoryModal");
    }

    return (
        <View style={ styles.container }>
            {isLoading
                ? <ActivityIndicator /> 
                : ( getAuth().currentUser?.isAnonymous || getAuth().currentUser === null
                    ? (
                            <>
                                <Text style={{ width: 200, textAlign: 'center', marginBottom: 10, fontSize: 20}}>Lets unlock all your features! </Text>
                                <CustomButton
                                    title="Login"
                                    onPressFunc={() => router.navigate("/login")}
                                    variant="primary"
                                    borderWidth={1.5}
                                    margin={10}
                                />
                    
                                <CustomButton
                                    title="Sign Up"
                                    onPressFunc={() => router.navigate("/signup")}
                                    variant="secondary"
                                    borderWidth={1.5}
                                    margin={10}
                                />
                            </>
                        )
                    : (
                        <View style={styles.container}>
                            <CustomButton
                                title="See all Categories"
                                onPressFunc={handleCategoriesPage}
                                variant="primary"
                                borderWidth={1.5}
                                margin={10}
                                width={200}
                            />
                            <CustomButton
                                title="Logout"
                                onPressFunc={logOut}
                                variant="primary-alternative"
                                borderWidth={1.5}
                                margin={10}
                                width={200}
                            />

                        </View>
                    )
                ) 
            }
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

})
