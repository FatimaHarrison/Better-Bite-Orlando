import { 
    View,
    Text,
    TextInput,
    Pressable,
    Alert,
    ScrollView,
} from "react-native";

import { Stack, Link } from "expo-router";
import { useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";

import BotanicalBackground from "@/components/BotanicalBackground";
import AuthHeader from "@/components/AuthHeader";
import { colors } from "../theme/colors";

export default function ForgotPasswordScreen() {

    // forgot password form state 
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Validate the email before requesting a reset link
    const handleForgotPassword = () => {

    if (!email.trim()) {
        setErrorMessage("Please enter your email address.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
        setErrorMessage("Please enter a valid email address.");
        return;
    }

    // Clear previous errors
    setErrorMessage("");

    // Backend integration will be implemented next
    Alert.alert(
        "Validation Successful",
        "Your email format is valid. Password reset email delivery will be connected next."
    );

};

    return (
        <SafeAreaView
        style={{
            flex: 1,
            backgroundColor: colors.background,
        }}
    >
        <Stack.Screen options={{ headerShown: false }} />

        <BotanicalBackground />
        <AuthHeader />

        <ScrollView
            contentContainerStyle={{
                 padding: 24,
                 alignItems: "center",
                 paddingBottom: 40,
                 }} 
                 keyboardShouldPersistTaps="handled"
            >
            <Text
                style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: colors.primary,
                }}
            >
                Forgot Password?
            </Text>

            <Text style={{ marginTop: 12, textAlign: "center" }} >
                Enter your email address to receive a password reset link.
            </Text>

        
{/* Email Address */}

<View style={{ width: "100%", marginTop: 30 }}>

    <Text
        style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.primary,
            marginBottom: 10,
        }}
    >
        Email Address
    </Text>

    <TextInput
        style={{
            backgroundColor: "#D7E3D5",
            borderRadius: 14,
            height: 52,
            paddingHorizontal: 15,
            fontSize: 14,
            color: "#333333",
        }}
        placeholder="example@email.com"
        placeholderTextColor="#777777"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        accessibilityLabel="Email Address"
    />

</View>

{/* Error Message */}

{errorMessage ? (
    <Text
        style={{
            color: "#A52626",
            fontSize: 13,
            marginTop: 15,
            textAlign: "center",
        }}
    >
        {errorMessage}
    </Text>
) : null}


{/* Send Reset Link Button */}

<Pressable
    style={({ pressed }) => ({
        backgroundColor: colors.primary,
        borderRadius: 14,
        height: 55,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        opacity: pressed ? 0.85 : 1,
    })}
    onPress={handleForgotPassword}
    accessibilityRole="button"
>
    <Text
        style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "700",
        }}
    >
        Send Reset Link →
    </Text>
</Pressable>


{/* Back to Sign In */}

<Link
    href="/sign-in"
    style={{
        color: "#E87522",
        fontSize: 14,
        fontWeight: "600",
        textDecorationLine: "underline",
        marginTop: 25,
        textAlign: "center",
    }}
    >
    ← Back to Sign In
        </Link>

{/* Development Preview: Email Sent Screen */}

{__DEV__ && (
    <Link
        href="/forgot-password-sent"
        style={{
            color: "#E87522",
            fontSize: 14,
            fontWeight: "600",
            textDecorationLine: "underline",
            marginTop: 20,
            textAlign: "center",
        }}
    >
        Preview Email Sent Screen →
    </Link>
)}


{/* Development Preview: Reset Password */}

{__DEV__ && (
    <Link
        href="/reset-password"
        style={{
            color: "#E87522",
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            textDecorationLine: "underline",
        }}
    >
        Preview Reset Password Screen →
    </Link>
)}


        </ScrollView>
    </SafeAreaView>
    );
}