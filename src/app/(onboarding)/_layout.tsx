import { Stack } from "expo-router";

const OnboardingStack = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />    
        </Stack>
    )
}

export default OnboardingStack;