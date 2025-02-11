import { Text, View, InputText } from '@/src/components/Themed';
import { Stack } from 'expo-router';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import {logIn, signUp, signOut}  from '@/src/utils/authService';
import { useState } from 'react';
import Colors from '@/src/constants/Colors';
import auth from '@react-native-firebase/auth';

export default function Login() {
    // ! Login  and authentication related: 
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const user = auth().currentUser;
        console.log(user);

        const handleSignUp = async () => {
            setLoading(true);
            try {
                const response = await signUp(email, password);
                alert("Registration successful!");
              } catch (error: any) {
                alert(`Registration failed: ${error.message}`);
              } finally {
                setLoading(false);
              }
        };
    
        const handleLogIn = async () => {
            setLoading(true);
            try {
                const response = await logIn(email, password);
                alert(`welcome! ${response.user?.email}`);
            } catch (error: any) {
                alert(`Login failed: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
    
        const handleLogOut = async () => {
            try {
                const response = await signOut();
                alert("Logout successful!");
            } catch (error: any) {
                alert(`Logout failed: ${error.message}`);
            }
        }
        // ! End of login and authentication related
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Stack.Screen options={{ headerShown: false}}></Stack.Screen>
            <View >
					<Text style={{ marginTop: 10}} >email: </Text>
					<InputText
						style={{ marginLeft: 10, color: Colors.dark.tint, borderColor: Colors.dark.tint, borderWidth: 1, marginTop: 10 }}
						placeholder="Email"
						value={email}
						autoCapitalize='none'
						onChangeText={setEmail}
					/>
					<Text style={{ marginTop: 10}}>password: </Text>
					<InputText
						style={{ marginLeft: 10, color: Colors.dark.tint, borderColor: Colors.dark.tint, borderWidth: 1, marginTop: 10 }}
						placeholder="Password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>
					{loading ? (
						<ActivityIndicator size="small" color="#ccc" style={{ margin: 28}} />
					) : (
						<View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}	> 
							<TouchableOpacity 
								style={{ marginTop: 10, borderWidth: 1, backgroundColor: Colors.dark.tint, borderRadius: 5, padding: 10, width: 100}} 
								onPress={handleLogIn}
							>
								<Text style={{ textAlign: 'center'}}>Login</Text>
							</TouchableOpacity>
							<TouchableOpacity 
								style={{ marginTop: 10, borderWidth: 1, backgroundColor: Colors.dark.tint, borderRadius: 5, padding: 10, width: 100}} 
								onPress={handleSignUp}
							>
								<Text style={{ textAlign: 'center'}}>Sign Up</Text>
							</TouchableOpacity>
							{user ? (<TouchableOpacity 
                                    style={{ marginTop: 10, borderWidth: 1, backgroundColor: Colors.dark.tint, borderRadius: 5, padding: 10, width: 100}} 
                                    onPress={handleLogOut}
                                >
                                    <Text style={{ textAlign: 'center'}}>Log Out</Text>
                                </TouchableOpacity> 
                                ) : (null)
                            }
						</View>
					)}
				</View>
        </View>
    );
}