import { 
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Alert,
} from "react-native";


import * as SecureStore from "expo-secure-store";

import { Stack, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BotanicalBackground from "@/components/BotanicalBackground";
import { styles } from "../styles/signInStyles";

import AuthHeader from "@/components/AuthHeader";

export default function SignInScreen() {

    const [email, setEmail ] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errorMessage, setErrorMessage ] = useState("");

    // sign in loading state
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = async () => {

        // check for empty fields
        if (!email.trim() || !password ) {
            setErrorMessage("Please enter your email and password.");
            return;
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (isSigningIn) return;

        // clear previous errors
        setErrorMessage("");
        setIsSigningIn(true);

        try {

            // connect to Better Bite Orlando backend
            const response = await fetch(
                "https://api-dev.betterbiteorlando.com/auth/login", 
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",                    
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const result = await response.json();

            // handle backend errors
            if (!response.ok) {
                setErrorMessage(
                    result.error || "Unable to sign in."
                );
                return;
            }


        // securely store the authentication token 
        await SecureStore.setItemAsync(
            "bbo_auth_token",
            token
        );

        //clear password field
        setPassword("");


        Alert.alert(
            "Sign In successful!",
            "Your credentials were verified successfully."
        );


    } catch (error) {

        setErrorMessage(
            "Unable to complete sign in or save your session. Please try again."
        );

    } finally {
        
        setIsSigningIn(false);

    }   
};


    return (
        <SafeAreaView style={styles.container}>
        
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark"/>

        {/* Reusable botanical background */}
        <BotanicalBackground />

        <AuthHeader />
        <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
        
        {/* Welcome Section */ }

        <View style={styles.welcomeSection}>
        
        <Text style={styles.welcomeTitle}>
            Welcome Back!
        </Text>

        <Text style={styles.welcomeDescription}>
            Continue your journey to healthier eating in Orlando.
        </Text>

        </View>


        {/* Sign in form container */}

        <View style={styles.signInCard}>
        
            <Text style={styles.signInTitle}>
                Sign In
            </Text>

            <Text style={styles.signInDescription}>
                Enter your account information to continue.
            </Text>

            {/* Email Address */ }

            <View style={styles.inputGroup}>

                <Text style={styles.inputLabel}>
                    Email Address
                </Text>

                <TextInput
                style={styles.textInput}
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


            {/* Password */ }

            <View style={styles.inputGroup}>

                <Text style={styles.inputLabel}>
                    Password
                </Text>

                <View style={styles.passwordContainer}>

                <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor="#777777"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                value={password}
                onChangeText={setPassword}
                accessibilityLabel="Password"
            />

        <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={
                showPassword ? "Hide password" : "Show Password"
                }
            >
        <Text style={styles.eyeIcon}>
            {showPassword ? "Hide" : "Show"}
        </Text>
    </Pressable>
        </View>
        </View>

        {/* Forgot Password Link */}

        <Link 
            href="/forgot-password"
            style={styles.forgotPasswordLink}
            >
                Forgot Password?
            </Link>

        {/* Validation Message */ }
        {errorMessage ? ( 
            <Text style={styles.errorMessage}>
                {errorMessage}
            </Text>  
        ) : null}

        {/* Sign In Button */}
        <Pressable
            style={({ pressed })=>[
                styles.signInButton,
                pressed && styles.signInButtonPressed,
            ]}
            onPress={handleSignIn}
            disabled={isSigningIn}
            accessibilityRole="button"
        >
            <Text style={styles.signInButtonText}>
                {isSigningIn ? "Signing in..." : "Sign In →"}
            </Text>
            </Pressable>

            {/* Sign Up Navigation */}

            <View style={styles.signUpContainer}>


                <Text style={styles.signUpText}>
                    Don't have an account?{" "}
                </Text>

                <Link
                    href="/sign-up"
                    style={styles.signUpLink}
                >
                    Sign Up
                </Link>

            </View>
        
        </View>

        </ScrollView>

        </SafeAreaView>
    );
}
