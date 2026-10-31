import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    // Main screen 

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  // page header 
  PageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "#3D622C",
    marginBottom: 8,
  },

  pageDescription: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 25,
    lineHeight: 21,
  },

  // section header 

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#3D622C",
    marginTop: 20,
    marginBottom: 15,
  },

  sectionDescription: {
    fontSize: 13,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 18,
  },
  
  // resrource cards

  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderLeftWidth: 5,
    padding: 16,
    marginBottom: 12,
    minHeight: 105,
  },

  // card Icon

  cardIcon: {
    fontSize: 29,
    marginRight: 15,
  },


  // card content

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#3D622C",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 12,
    color: "#555555",
    lineHeight: 18,
  },

  // navigation arrow
  navigationArrow: {
    fontSize: 28,
    color: "#3D622C",
    marginLeft: 8,
  },


// =====
// help & support cards
// =====

  supportCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F4ECE5",

    borderRadius: 12,

    paddingVertical: 13,
    paddingHorizontal: 14,

    marginBottom: 10,

    minHeight: 72,
  },


  supportIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  supportContent: {
    flex: 1,
  },

  supportTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3D622C",
  },

  supportDescription: {
    fontSize: 11,
    color: "#666666",
    marginTop: 3,
    lineHeight: 15,
  },

});