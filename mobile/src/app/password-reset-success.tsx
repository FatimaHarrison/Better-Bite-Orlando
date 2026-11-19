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

import { styles } from "../styles/passwordResetSuccessStyles";

export default function PasswordResetSuccessScree() {

    const router = useRouter();

    // navigate to Sign In 
    const handleSignIn = () => {
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
                {/* Welcome Section */}

                <View style={styles.welcomeSection}>

                    <Text style={styles.welcomeTitle}>
                        You're All Set!
                    </Text>

                    <Text style={styles.welcomeDescription}>
                        Your password has been successfully reset.
                        You can now sign in to your account.
                    </Text>

                    </View>

  {/* Success Card */}

                <View style={styles.successCard}>

                    <View style={styles.messageContainer}>

                        <Text style={styles.successTitle}>
                            Password Reset{"\n"}Successful!
                        </Text>

                        <Text style={styles.successDescription}>
                            Your password has been updated.{"\n"}
                            You can now sign in with{"\n"}
                            your new password.
                        </Text>

                    </View>

                    {/* Sign In Button */}

                    <Pressable
                        style={({ pressed }) => [
                            styles.signInButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleSignIn}
                        accessibilityRole="button"
                        accessibilityLabel="Sign In"
                    >

                        <Text style={styles.signInButtonText}>
                            Sign In →
                        </Text>

                    </Pressable>

                </View>

                </ScrollView>
        </SafeAreaView>
    );
}