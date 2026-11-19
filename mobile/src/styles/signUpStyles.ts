import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FAF6F1",
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    welcomeSection: {
        alignItems: "center",
        marginTop: 35,
        marginBottom: 30,
    },

    welcomeTitle: {
        fontSize: 27,
        fontWeight: "800",
        color: "#315A29",
        textAlign: "center",
    },

    welcomeDescription: {
        fontSize: 14,
        color: "#555555",
        textAlign: "center",
        marginTop: 15,
        lineHeight: 22,
    },

    signUpCard: {
        backgroundColor: "#A5C2A2",
        borderRadius: 24,
        padding: 24,
        paddingBottom: 35,
    },

    signUpTitle: {
        fontSize: 27,
        fontWeight: "800",
        color: "#315A29",
        textAlign: "center",
    },

    signUpDescription: {
        fontSize: 14,
        color: "#444444",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 28,
    },

    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    nameInputGroup: {
        flex: 1,
        marginBottom: 18,
    },

    inputGroup: {
        marginBottom: 18,
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#315A29",
        marginBottom: 9,
    },

    textInput: {
        backgroundColor: "#D7E3D5",
        borderRadius: 14,
        paddingHorizontal: 15,
        height: 52,
        fontSize: 14,
        color: "#333333",
    },

    termsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
        marginBottom: 25,
        gap: 10,
    },

    checkbox: {
        width: 21,
        height: 21,
        borderWidth: 1.5,
        borderColor: "#315A29",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },

    checkmark: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#315A29",
    },

    termsText: {
        flex: 1,
        fontSize: 12,
        color: "#315A29",
        lineHeight: 19,
    },

    legalLink: {
        color: "#E87522",
        textDecorationLine: "underline",
        fontWeight: "600",
    },

    errorMessage: {
        color: "#A52626",
        fontSize: 13,
        marginBottom: 15,
        textAlign: "center",
    },

    createAccountButton: {
        backgroundColor: "#315A29",
        borderRadius: 14,
        minHeight: 55,
        alignItems: "center",
        justifyContent: "center",
    },

    buttonPressed: {
        opacity: 0.85,
    },

    createAccountButtonText: {
        fontSize: 17,
        fontWeight: "700",
        color: "#FFFFFF",
    },

    signInContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
        flexWrap: "wrap",
    },

    signInText: {
        fontSize: 14,
        color: "#315A29",
    },

    signInLink: {
        fontSize: 14,
        color: "#E87522",
        fontWeight: "700",
        textDecorationLine: "underline",
    },

// Password input container

passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D7E3D5",
    borderRadius: 14,
    height: 52,
},

passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#333333",
},

eyeButton: {
    paddingHorizontal: 15,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
},

eyeIcon: {
    fontSize: 14,
    fontWeight: "600",
    color: "#315A29",
},


});