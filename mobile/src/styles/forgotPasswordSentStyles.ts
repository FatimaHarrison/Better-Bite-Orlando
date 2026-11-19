
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FAF6F1",
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },

    // Header Section

    headerSection: {
        alignItems: "center",
        marginBottom: 30,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#315A29",
        textAlign: "center",
    },

    headerDescription: {
        fontSize: 14,
        color: "#555555",
        textAlign: "center",
        lineHeight: 22,
        marginTop: 15,
    },

    // Email Sent Card

    emailSentCard: {
        backgroundColor: "#A5C2A2",
        borderRadius: 24,
        padding: 24,
        minHeight: 450,
        justifyContent: "space-between",
    },

    messageContainer: {
        alignItems: "center",
        marginTop: 25,
    },

    successTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#315A29",
        textAlign: "center",
    },

    successDescription: {
        fontSize: 15,
        color: "#315A29",
        textAlign: "center",
        lineHeight: 24,
        marginTop: 20,
    },

    // Expiration Notice

    expirationContainer: {
        backgroundColor: "#D7E3D5",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#315A29",
        padding: 18,
        alignItems: "center",
    },

    expirationText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#315A29",
        textAlign: "center",
        lineHeight: 22,
    },

    // Back to Sign In Button

    backButton: {
        backgroundColor: "#315A29",
        borderRadius: 14,
        minHeight: 55,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },

    buttonPressed: {
        opacity: 0.85,
    },

    backButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

});
