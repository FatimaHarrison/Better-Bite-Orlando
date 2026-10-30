import {StyleSheet } from "react-native";

export const styles = StyleSheet.create ({

    // Main screen 
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
   },

   content: {
    padding: 20,
    paddingBottom: 30,
   },


   // header
   pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#3D622C",
    marginBottom: 8,
   },


   pageDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 25,
   },

   // category selection
    categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 25,
   },

   categoryTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    borderWidth: 2,
    borderColor: "#EEEEEE",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
   },

   categoryIcon: {
    fontSize: 25,
    marginBottom: 8,
   },

   categoryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3D622CC",
    textAlign: "center",
   },

   //Empty favorites section 
   emptyCard: {
    backgroundColor: "#F4ECE5",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 250,
   },

   emptyIcon: {
    fontSize: 48,
    color: "#559439",
    marginBottom: 15,
   },

   emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D622C",
    textAlign: "center",
    marginBottom: 10,
   },

   emptyDescription: {
     fontSize: 13,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
   },

   // Explore button 
   exploreButton: {
    backgroundColor: "#3D622C",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    },


    exploreButtonText: {
        color:"white",
        fontSize: 14,
        fontWeight: "700",
    },

});