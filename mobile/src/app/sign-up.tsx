import {
    View,
    Text,
    TextInput,
    ScrollView,
    Pressable,
    Alert,
} from "react-native";

import { Stack, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import BotanicalBackground from "@/components/BotanicalBackground";
import AuthHeader from "@/components/AuthHeader";

import { styles } from "../styles/signUpStyles";

export default function SignUpScreen() {

    // Registration form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [email, setEmail] = useState("");
    const [zipCode, setZipCode] = useState("");
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    //password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // live password validation requirements 
    const passwordRequirements = {
        minLength: password.length >= 12,
        maxLength: new TextEncoder().encode(password).length <= 72,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        specialCharacter: /[^A-Za-z0-9]/.test(password),
    };

    // registration validation
    const handleSignUp = () => {

    if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !zipCode ||
        !password ||
        !confirmPassword 
    )   {
        setErrorMessage("Please complete all fields.");
        return;
    } 

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        if (!/^\d{5}$/.test(zipCode)) {
            setErrorMessage("Please enter a valid 5-digit ZIP code.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Password do not match");
            return;
        }


if (!Object.values(passwordRequirements).every(Boolean)) {
    setErrorMessage(
        "Password must be 12–72 characters, maximum 72 bytes, and include uppercase, lowercase, and a special character."
    );
    return;
}

        if (!acceptedTerms) {
            setErrorMessage("Please accept the Terms of Service and Privacy Policy.")
            return;
        }

        setErrorMessage("");

        // Backend integration will be implemented next!
        Alert.alert(
            "Registration",
            "Form validation successful! Backend integration is next!"
        );    
};

return (
    <SafeAreaView style={styles.container}>

        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />

        <BotanicalBackground />
        <AuthHeader />

        <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >

        {/* Welcome Section */}

        <View style={styles.welcomeSection}>

            <Text style={styles.welcomeTitle}>
                    Join Better Bite Orlando!
            </Text>

            <Text style={styles.welcomeDescription}>
                Create an account to save your favorite places,
                recipes, and get personalized recommendations.
            </Text>

        </View>

        {/* Registration Card */}

        <View style={styles.signUpCard}>

            <Text style={styles.signUpTitle}>
                    Create Your Account
            </Text>

            <Text style={styles.signUpDescription}>
                It's free and only takes a minute.
            </Text>



        {/* First name and Last name */}

        <View style={styles.nameRow}>

            <View style={styles.nameInputGroup}>

                <Text style={styles.inputLabel}>
                    First Name
                </Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    placeholderTextColor="#777777"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                    />

            </View>
            {/* Last name */}
            <View style={styles.nameInputGroup}>

                <Text style={styles.inputLabel}>
                    Last Name
                </Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    placeholderTextColor="#777777"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                    />

            </View>

        </View>

        {/* Email Address */}

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
                    />

         </View>


        {/* ZIP Code */}

        <View style={styles.inputGroup}>

                <Text style={styles.inputLabel}>
                    ZIP Code
                </Text>

                <TextInput
                    style={styles.textInput}
                    placeholder="Enter your ZIP code"
                    placeholderTextColor="#777777"
                    keyboardType="number-pad"
                    maxLength={5}
                    autoComplete="postal-code"
                    value={zipCode}
                    onChangeText={(text) =>
                            setZipCode(text.replace(/\D/g, ""))
                    }
                />

            </View>


       {/* Password */}

        <View style={styles.inputGroup}>

                <Text style={styles.inputLabel}>
                    Password
                </Text>

                <View style={styles.passwordContainer}>

                <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter Password"
                    placeholderTextColor="#777777"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    value={password}
                    onChangeText={setPassword}
                    />
                
                <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    accessibilityRole="button"
                accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                }
        >

            <Text style={styles.eyeIcon}>
                {showPassword ? "Hide" : "Show"}
            </Text>


        </Pressable>

    </View> 
    </View>

      {/* Confirm Password */}

        <View style={styles.inputGroup}>

                <Text style={styles.inputLabel}>
                    Confirm Password
                </Text>

                <View style={styles.passwordContainer}>

                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    placeholderTextColor="#777777"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                
                <Pressable
                    onPress={() => 
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                style={styles.eyeButton}
                accessibilityRole="button"
                accessibilityLabel={
                    showConfirmPassword 
                    ? "Hide confirmation password" 
                    : "Show confirm password"
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
            ].map(({ label, valid}) => (

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

       {/* Terms and Conditions */}

        <View style={styles.termsContainer}>

            <Pressable
                style={styles.checkbox}
                onPress={() => setAcceptedTerms(!acceptedTerms)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: acceptedTerms }}
            >
                {acceptedTerms && (
                    <Text style={styles.checkmark}>✓</Text>
                )}
            </Pressable>

            <Text style={styles.termsText}>

                I agree to the {" "}
                <Text style={styles.legalLink}>
                    Terms of Service
                </Text>
                {" "}and{" "}
                <Text style={styles.legalLink}>
                    Privacy Policy
                </Text>
            </Text>

         </View>

        {/* Error Message */}

        {errorMessage ? (
            <Text style={styles.errorMessage}>
                {errorMessage}
            </Text>
        ) : null}

        {/* Create Account Button */}

        <Pressable
            style={({ pressed }) => [
                styles.createAccountButton,
                pressed && styles.buttonPressed,
            ]}
            onPress={handleSignUp}
        >
            <Text style={styles.createAccountButtonText}>
                Create Account →
            </Text>
        </Pressable>

        {/* Sign In Navigation */}

        <View style={styles.signInContainer}>

            <Text style={styles.signInText}>
            Already have an account?{" "}
            </Text>

            <Link  
                href="/sign-in"
                style={styles.signInLink}
            >
                Sign In
            </Link>

         </View>

         {/* Development Preview */}

{__DEV__ && (
    <Link
        href="/account-created"
        style={{
            textAlign: "center",
            color: "#E87522",
            marginTop: 20,
            fontSize: 14,
        }}
    >
        Preview Account Success Screen
    </Link>
)}

         </View>

        </ScrollView>

    </SafeAreaView>
);
}

