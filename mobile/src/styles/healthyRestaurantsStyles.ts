import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  // page title 
title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3D622C"
  },

  // page description
  description: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 14,
    color: "#666666",
  },

  // Search input field 
  searchInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },

  // individual meal card 
  card: {
    backgroundColor: "#F4ECE5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5D8CC",
  },
  // meal name
  mealName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3D622C",
    marginBottom: 6,
  },

  //restaurant name
  mealRestaurant: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },

  //nutritional information
  mealNutrition: {
    fontSize: 14,
    color: "#3D622C",
    fontWeight: "500",
  },

  // empty search results
  emptyText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 30,
  },

  // filter container
  filterContainer: {
    flexGrow: 0,
    marginBottom: 20,
  },

  // default filter button
  filterButton: {
    backgroundColor: "#F4ECE5",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#D8C9BC",
  },

  // selected filter button
  filterButtonActive: {
    backgroundColor: "#3D622C",
    borderColor: "#3D622C",
  },

  // default filter  text
  filterButtonText: {
    fontSize: 14,
    color: "#3D622C",
    fontWeight: "500",
  },

  // selected filter text
  filterButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },


});