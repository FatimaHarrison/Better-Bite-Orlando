import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 30,
  },

  welcomeSection: {
    alignItems: "center",
    marginBottom: 25,
  },

  welcomeTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 10,
  },

  welcomeDescription: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    lineHeight: 21,
  },

  signInCard: {
    backgroundColor: "rgba(161, 190, 157, 0.95)",
    borderRadius: 22,
    padding: 22,
    minHeight: 340,
  },

  signInTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },

  signInDescription: {
    fontSize: 13,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },

  inputGroup: {
  marginBottom: 18,
},

inputLabel: {
  fontSize: 14,
  fontWeight: "600",
  color: colors.primary,
  marginBottom: 8,
},

textInput: {
  height: 48,
  backgroundColor: "rgba(255, 255, 255, 0.50)",
  borderRadius: 12,
  paddingHorizontal: 14,
  fontSize: 14,
  color: colors.text,
  borderWidth: 1,
  borderColor: "rgba(61, 98, 44, 0.15)",
},



// Password Input

passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.50)",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(61, 98, 44, 0.15)",
  height: 48,
},

passwordInput: {
  flex: 1,
  height: "100%",
  paddingHorizontal: 14,
  fontSize: 14,
  color: colors.text,
},

eyeButton: {
  width: 48,
  height: 48,
  alignItems: "center",
  justifyContent: "center",
},

eyeIcon: {
  fontSize: 21,
},

passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.50)",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "rgba(61, 98, 44, 0.15)",
  height: 48,
},


passwordInput: {
  flex: 1,
  height: "100%",
  paddingHorizontal: 14,
  fontSize: 14,
  color: colors.text,
},

eyeButton: {
  minWidth: 48,
  height: 48,
  paddingHorizontal: 8,
  alignItems: "center",
  justifyContent: "center",
},

eyeIcon: {
  fontSize: 12,
  fontWeight: "700",
  color: colors.primary,
},


// Forgot Password Link

forgotPasswordLink: {
  alignSelf: "flex-end",
  fontSize: 12,
  fontWeight: "600",
  color: "#E87522",
  textDecorationLine: "underline",
  marginTop: -4,
  marginBottom: 16,
},


// Sign In Button
signInButton: {
    backgroundColor: "#355F2E",
    borderRadius: 14,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    width: "100%",
},

signInButtonPressed: {
    opacity: 0.8,
},

signInButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
},

// Validation Error
errorMessage: {
    color: "#A12626",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 15,
},


// Sign Up Section

signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
},

signUpText: {
    fontSize: 14,
    color: "#315A29",
    fontWeight: "400",
},

signUpLink: {
    fontSize: 14,
    color: "#E87522",
    fontWeight: "700",
    textDecorationLine: "underline",
},

// Live Password Requirements

requirementsContainer: {
    marginTop: -5,
    marginBottom: 20,
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

});