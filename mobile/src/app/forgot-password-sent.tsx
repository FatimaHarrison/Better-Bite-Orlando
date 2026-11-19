import {
    View,
    Text,
    Pressable,
    ScrollView,
} from "react-native";

import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import BotanicalBackground from "@/components/BotanicalBackground";

import { styles } from "../styles/forgotPasswordSentStyles";

// Navigate back to Sign In
export default function ForgotPasswordSentScreen() {
    const router = useRouter();

const handleBackToSignIn = () => {
    router.replace("/sign-in");
};

return (
    <SafeAreaView style={styles.container}>

        <Stack.Screen options={{ headerShown: false}} />
        <StatusBar style="dark" />

        <BotanicalBackground />

        <ScrollView
            contentContainerStyle={styles.content}
        >

            {/* Header section */}

            <View style={styles.headerSection} >

                <Text style={styles.headerTitle}>
                    Check Your Email
                </Text>
                
                <Text style={styles.headerDescription}>
                    If an account exists for that email address,
                    you will receive a password reset link shortly.
                </Text>

            </View>

        {/* Email sent card */}

        <View style={styles.emailSentCard}>

            {/* Success Message */}

            <View style={styles.messageContainer}>

                <Text style={styles.successTitle}>
                    Email Sent!
                </Text>

                <Text style={styles.successDescription}>
                    Please check your inbox for password reset instructions. {"\n"} 
                    Remember to check your spam folder too!
                </Text>              

            </View>

            {/* Expiration notice */}

            <View style={styles.expirationContainer}>
                <Text style={styles.expirationText}>
                        For your security, password reset links expire after 15 minutes.
                </Text> 

            </View>

            {/* back to sing in */}

            <Pressable
                style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.buttonPressed,
                ]}
                onPress={handleBackToSignIn}
                accessibilityRole="button"
                accessibilityLabel="Back to Sign In"
                >

                <Text style={styles.backButtonText}>
                        Back to Sign In
                </Text> 

                </Pressable>

        </View>


        

        </ScrollView>
    </SafeAreaView>
);
}