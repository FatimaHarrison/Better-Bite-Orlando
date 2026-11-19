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


import { styles } from "../styles/accountCreatedStyles";

export default function AccountCreatedScreen(){

    const router = useRouter();
    
    // navigate to sign in 
    const handleContinue = () => {
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

                {/* Success Card */ }

                <View style={styles.successCard}>

                    {/* Success message */ }

                    <View style={styles.messageContainer}>

                        <Text style={styles.successTitle}>
                            Account Created{"\n"}Successfully!
                        </Text>

                        <Text style={styles.successDescription}>
                            Welcome to Better Bite Orlando!{"\n"}
                            Your account is ready.
                        </Text>

                    </View>

                    {/* Continue to login button */}

                    <Pressable
                        style={({ pressed })=>[
                            styles.continueButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleContinue}
                        accessibilityRole="button"
                        accessibilityLabel="Continue to Login"
                        >
                            <Text style={styles.continueButtonText}>
                                Continue to Login
                            </Text>

                        </Pressable>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}