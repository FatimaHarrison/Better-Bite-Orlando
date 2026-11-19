import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    Alert,
} from "react-native";

import { Stack, Link, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BotanicalBackground from "@/components/BotanicalBackground";
import AuthHeader from "@/components/AuthHeader";

import { styles } from "../styles/resetPasswordStyles";

export default function ResetPasswordScreen() {
    // password form state
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // password visibility 
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // validation message
    const [errorMessage, setErrorMessage] = useState("");

    // Live password validation requirements
const passwordRequirements = {
    minLength: password.length >= 12,
    maxLength: new TextEncoder().encode(password).length <= 72,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    specialCharacter: /[^A-Za-z0-9]/.test(password),
};

    // reset token received from the password reset link 
    const { token } = useLocalSearchParams<{ token?: string }> ();

    // Handle Reset Password
const handleResetPassword = () => {

    // Check for empty fields
    if (!password || !confirmPassword) {
        setErrorMessage("Please complete both password fields.");
        return;
    }

    // Check password requirements
    if (!Object.values(passwordRequirements).every(Boolean)) {
        setErrorMessage(
            "Your password does not meet all the requirements."
        );
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
    }

    // Clear previous errors
    setErrorMessage("");

    // Backend integration will be implemented next
    Alert.alert(
        "Validation Successful",
        "Your password meets all requirements. Backend integration is next."
    );

};

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FAF6F1" }}>

            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <BotanicalBackground />
            <AuthHeader />

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 24,
                    paddingTop: 35,
                }}
            >

                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "800",
                        color: "#315A29",
                        textAlign: "center",
                    }}
                    >
                        Reset Your Password
                    </Text>

                    <Text
                        style={{
                            fontSize: 14,
                            color: "#555555",
                            textAlign: "center",
                            marginTop: 15,
                        }}
                    >
                        Create a new secure password for your account.
                    </Text>



            {/* New Password */ }

            <View style={styles.inputGroup}>

                <Text style={styles.inputLabel}>
                    New Password
                </Text>

                <View style={styles.passwordContainer}>

                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Enter your new password"
                        placeholderTextColor="#777777"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="new-password"
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Show / hide password */}

                    <Pressable
                        onPress={()=> setShowPassword(!showPassword)}
                        style={styles.eyeButton}
                        accessibilityRole="button"
                        accessibilityLabel={
                            showPassword ? "Hide password" : "Show password"
                            }
                    >

                        <Text style={styles.eyeIcon}>
                            {showPassword ? "Hide" : "Show" }
                        </Text>

                    </Pressable>

                </View>

            </View>

{/* Confirm New Password */}

<View style={styles.inputGroup}>

    <Text style={styles.inputLabel}>
        Confirm New Password
    </Text>

    <View style={styles.passwordContainer}>

        <TextInput
            style={styles.passwordInput}
            placeholder="Confirm your new password"
            placeholderTextColor="#777777"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
        />

        {/* Show / Hide Confirm Password */}

        <Pressable
            onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
            }
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={
                showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
            }
        >

            <Text style={styles.eyeIcon}>
                {showConfirmPassword ? "Hide" : "Show"}
            </Text>

        </Pressable>

    </View>

</View>

{/* Password Match Validation */}

{confirmPassword.length > 0 && (

    <Text
        style={[
            styles.requirementText,
            password === confirmPassword && styles.requirementMet,
        ]}
    >
        {password === confirmPassword
            ? "✓ Passwords match"
            : "○ Passwords do not match"}
    </Text>

)}


{/* Live Password Requirements */}

<View style={styles.requirementsContainer}>

    <Text style={styles.requirementsTitle}>
        Password Requirements
    </Text>

    {[
        {
            label: "At least 12 characters",
            valid: passwordRequirements.minLength,
        },
        {
            label: "Maximum 72 bytes",
            valid: passwordRequirements.maxLength,
        },
        {
            label: "One uppercase letter",
            valid: passwordRequirements.uppercase,
        },
        {
            label: "One lowercase letter",
            valid: passwordRequirements.lowercase,
        },
        {
            label: "One special character",
            valid: passwordRequirements.specialCharacter,
        },
    ].map(({ label, valid }) => (

        <Text
            key={label}
            style={[
                styles.requirementText,
                valid && styles.requirementMet,
            ]}
        >
            {valid ? "✓" : "○"} {label}
        </Text>

    ))}

</View>


{/* Error Message */}

{errorMessage ? (
    <Text style={styles.errorMessage}>
        {errorMessage}
    </Text>
) : null}


{/* Confirm Reset Password Button */}

<Pressable
    style={({ pressed }) => [
        styles.resetButton,
        pressed && styles.resetButtonPressed,
    ]}
    onPress={handleResetPassword}
    accessibilityRole="button"
    accessibilityLabel="Reset Password"
>
    <Text style={styles.resetButtonText}>
        Reset Password →
    </Text>
</Pressable>



{/* Development Preview */}

{__DEV__ && (
    <Link
        href="/password-reset-success"
        style={{
            textAlign: "center",
            color: "#E87522",
            marginTop: 20,
            fontSize: 14,
            textDecorationLine: "underline",
        }}
    >
        Preview Password Reset Success →
    </Link>
)}

            </ScrollView>

        </SafeAreaView>
    );
}