import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    // Main Screen

    container: {
        flex: 1,
        backgroundColor: "#FAF6F1",
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },

    // Welcome Section

    welcomeSection: {
        alignItems: "center",
        marginBottom: 30,
    },

    welcomeTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: "#315A29",
        textAlign: "center",
    },

    welcomeDescription: {
        fontSize: 14,
        color: "#555555",
        textAlign: "center",
        lineHeight: 22,
        marginTop: 15,
    },

    // Success Card

    successCard: {
        backgroundColor: "#A5C2A2",
        borderRadius: 24,
        padding: 24,
        minHeight: 460,
        justifyContent: "space-between",
    },

    // Success Message

    messageContainer: {
        alignItems: "center",
        marginTop: 20,
    },

    successTitle: {
        fontSize: 27,
        fontWeight: "800",
        color: "#315A29",
        textAlign: "center",
        lineHeight: 36,
    },

    successDescription: {
        fontSize: 15,
        color: "#315A29",
        textAlign: "center",
        lineHeight: 24,
        marginTop: 25,
    },

    // Sign In Button

    signInButton: {
        backgroundColor: "#315A29",
        borderRadius: 14,
        minHeight: 55,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 50,
    },

    buttonPressed: {
        opacity: 0.85,
    },

    signInButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

});