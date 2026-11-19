import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    inputGroup: {
        marginTop: 24,
    },

    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#315A29",
        marginBottom: 10,
    },

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


    // Live Password Validation

requirementsContainer: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 5,
},

requirementsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#315A29",
    marginBottom: 10,
},

requirementText: {
    fontSize: 13,
    color: "#A52626",
    marginBottom: 6,
},

requirementMet: {
    color: "#2E7D32",
    fontWeight: "600",
},

// Reset Password Button

resetButton: {
    backgroundColor: "#315A29",
    borderRadius: 14,
    minHeight: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
},

resetButtonPressed: {
    opacity: 0.85,
},

resetButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
},

// Validation Error

errorMessage: {
    fontSize: 13,
    color: "#A52626",
    textAlign: "center",
    marginTop: 15,
},

});