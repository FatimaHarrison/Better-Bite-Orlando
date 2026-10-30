import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
    marginBottom: 5,
  },

  brandLogo: {
    width: 115,
    height: 48,
  },

  headerTag: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#3D622C",
    backgroundColor: "#F4ECE5",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 20,
  },


  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },


  logo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#3D622C",
  },


  // Hero section 

  hero: {
    height: 165,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: "#DCEAF6",
  },

  heroBackground: {
    flex: 1,
    width: "100%",
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    padding: 18,
    justifyContent: "center",
  },

  heroContent: {
    padding: 25,
    minHeight: 240,
    justifyContent: "center",
  },


  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3D622C",
    lineHeight: 27,
  },

  heroDescription: {
    fontSize: 12,
    color: "#3D622C",
    lineHeight: 17,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D622C",
    marginBottom: 18,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    minHeight: 90,
  },

  // Green for Groceries 
  groceryCard: {
    backgroundColor: "#DDF5DF",
    borderLeftWidth: 5,
    borderLeftColor: "#55A868",
  },

  // Orange for Restaurants
  restaurantCard: {
    backgroundColor: "#FFE1CC",
    borderLeftWidth: 5,
    borderLeftColor: "#FF8A30",
  },

  // Purple for Recipes
  recipeCard: {
    backgroundColor: "#EEDBF5",
    borderLeftWidth: 5,
    borderLeftColor: "#A538CF",
  },

  cardIcon: {
    fontSize: 26,
    marginRight: 12,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#3D622C",
  },

  cardDescription: {
    fontSize: 11,
    color: "#555555",
    lineHeight: 15,
    marginTop: 4,
  },

  cardLink: {
    fontSize: 11,
    fontWeight: "700",
    color: "#3D622C",
    marginTop: 7,
  },

  arrow: {
    fontSize: 28,
    color: "#3D622C",
  },

  footerText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 11,
    fontWeight: "600",
    color: "#3D622C",
  },

});