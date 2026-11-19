import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    // Main Screen

    container: {
        flex: 1,
        backgroundColor: "#FAF6F1",
    },

    content: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 32,
    },

    // Success Card

    successCard: {
        backgroundColor: "#A5C2A2",
        borderRadius: 24,
        padding: 24,
        minHeight: 420,
        justifyContent: "space-between",
    },

    // Success Message

    messageContainer: {
        alignItems: "center",
        marginTop: 30,
    },

    successTitle: {
        fontSize: 28,
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
        marginTop: 30,
    },

    // Continue to Login Button

    continueButton: {
        backgroundColor: "#315A29",
        borderRadius: 14,
        minHeight: 55,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    buttonPressed: {
        opacity: 0.85,
    },

    continueButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },

});