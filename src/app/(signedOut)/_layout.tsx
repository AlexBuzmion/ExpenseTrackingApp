import { View, Text} from "@/src/components/Themed"
import { Stack } from "expo-router"

const SignedOutStack = () =>{
    console.log('SignedOutStack');
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="login" />    
        </Stack>
    )
}

export default SignedOutStack;