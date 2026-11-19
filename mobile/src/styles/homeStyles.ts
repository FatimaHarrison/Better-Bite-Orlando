import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },

  brandLogo: {
    width: 180,
    height: 65,
  },

  // Location badge

locationBadge: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  backgroundColor: colors.surface,

  paddingVertical: 12,
  paddingHorizontal: 14,

  borderRadius: 30,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 5,
  elevation: 3,
},

locationIcon: {
  fontSize: 18,
  marginRight: 4,
},

locationText: {
  fontSize: 13,
  fontWeight: "700",
  color: colors.primary,
},

  headerTag: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3D622C",
    backgroundColor: "#F4ECE5",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
  },


  container: {
    flex: 1,
    backgroundColor: colors.background,

  },

  content: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
    zIndex: 1,
  },


  logo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#3D622C",
  },


  // Hero section 

  hero: {
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 12,
    backgroundColor:  "transparent",
  },

  heroBackground: {
    flex: 1,
    width: "100%",
  },
  // Orlando skyline illustration
skylineImage: {
  position: "absolute",
  width: "100%",
  height: 160,
  bottom: 45,
  alignSelf: "center",
},

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 12,
    justifyContent: "space-between",
  },

  heroContent: {
    padding: 25,
    minHeight: 240,
    justifyContent: "center",
  },


  heroTitle: {
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: "#3D622C",
    lineHeight: 36,
    marginBottom: 8,
  },

  heroDescription: {
    fontSize: 16,
    color: "#0f190a",
    textAlign: "center",
    lineHeight: 22,
  },

  heroBottomText: {
  fontSize: 17,
  fontWeight: "700",
  color: "#3D622C",
  backgroundColor: "rgba(244, 250, 240, 0.9)",
  padding: 12,
  borderRadius: 12,
  textAlign: "center",
},

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D622C",
    marginBottom: 12,
  },

  // Container for the three food categories
cardsRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "stretch",
  gap: 8,
  marginBottom: 12,
},

card: {
  flex: 1,
  minWidth: 0,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",

  borderRadius: 18,

  paddingVertical: 12,
  paddingHorizontal: 8,
  minHeight: 155,
},

  // Green for Groceries 
  groceryCard: {
    backgroundColor: colors.successLight,
    borderLeftWidth: 5,
    borderLeftColor: colors.success,
  },

  // Orange for Restaurants
  restaurantCard: {
    backgroundColor: colors.warningLight,
    borderLeftWidth: 5,
    borderLeftColor: colors.warning,
  },

  // Purple for Recipes
  recipeCard: {
    backgroundColor: colors.accentLight,
    borderLeftWidth: 5,
    borderLeftColor: colors.accent,
  },


cardIcon: {
  width: 54,
  height: 54,
  marginBottom: 10,
  alignSelf: "center",
},

  cardContent: {
    width: "100%",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3D622C",
    textAlign: "center",
    lineHeight: 17,
  },

  cardDescription: {
    fontSize: 12,
    color: "#555555",
    textAlign: "center",
    lineHeight: 15,
    marginTop: 8,
  },

  cardLink: {
    fontSize: 11,
    fontWeight: "700",
    color: "#3D622C",
    textAlign: "center",
    marginTop: 8,
  },

  arrow: {
    fontSize: 28,
    color: "#3D622C",
  },

  // Quick Start Guide

quickStartCard: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: colors.surface,
  borderRadius: 18,
  padding: 12,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: colors.border,
},

quickStartIconContainer: {
  width: 48,
  height: 48,
  borderRadius: 14,
  backgroundColor: "#E2F0DD",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,
},

quickStartIcon: {
  fontSize: 25,
},

quickStartContent: {
  flex: 1,
},

quickStartTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: colors.primary,
  marginBottom: 4,
},

quickStartDescription: {
  fontSize: 12,
  color: "#555555",
  lineHeight: 18,
},

quickStartArrow: {
  fontSize: 22,
  fontWeight: "700",
  color: "#3D622C",
  marginLeft: 10,
},

 footerText: {
  textAlign: "center",
  marginTop: 8,
  fontSize: 12,
  fontWeight: "600",
  color: "#3D622C",
},

});