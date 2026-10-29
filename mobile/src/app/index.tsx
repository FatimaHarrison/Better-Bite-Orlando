import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const categories = [
    {
      icon: "🛒",
      title: "Find Groceries",
      description: "Supermarkets, farmer markets & fresh food",
    },
    {
      icon: "🥗",
      title: "Healthy Restaurants",
      description: "Discover nutritious meals around Orlando",
    },
    {
      icon:"📖",
      title:"Recipes",
      description:"Explore balanced recipes",
    },
  ];

 



  
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            🌿 Better Bite Orlando
          </Text>
        </View>

        {/* HERO SECTION */}
        <View style={styles.hero}>

          <Text style={styles.heroTitle}>
            Better Choices.{"\n"}Healthier You.
          </Text>

          <Text style={styles.heroDescription}>
            Find healthier food that fits your budget
            and lifestyle, right here in Orlando.
          </Text>

        </View>

        {/* FOOD CATEGORIES */}
        <Text style={styles.sectionTitle}>
          What are you looking for?
        </Text>

        {categories.map((category) => (

          <Pressable
            key={category.title}
            style={styles.card}
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                category.title,
                "This section is coming soon!"
              )
            }
          >

            <Text style={styles.cardIcon}>
              {category.icon}
            </Text>

            <View style={styles.cardContent}>

              <Text style={styles.cardTitle}>
                {category.title}
              </Text>

              <Text style={styles.cardDescription}>
                {category.description}
              </Text>

            </View>

            <Text style={styles.arrow}>›</Text>

          </Pressable>

        ))}

        {/* BOTTOM MESSAGE */}
        <Text style={styles.footerText}>
          Better Food. A Healthier Orlando.
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    paddingVertical: 20,
  },

  logo: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#3D622C",
  },

  hero: {
    backgroundColor: "#F4ECE5",
    padding: 25,
    borderRadius: 18,
    marginTop: 15,
    marginBottom: 30,
  },

  heroTitle: {
    fontSize: 29,
    fontWeight: "bold",
    color: "#559439",
    marginBottom: 12,
  },

  heroDescription: {
    fontSize: 14,
    color: "#3D622C",
    lineHeight: 22,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3D622C",
    marginBottom: 18,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4ECE5",
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
  },

  cardIcon: {
    fontSize: 30,
    marginRight: 15,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3D622C",
  },

  cardDescription: {
    fontSize: 12,
    color: "#555555",
    marginTop: 5,
  },

  arrow: {
    fontSize: 28,
    color: "#3D622C",
  },

  footerText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
    fontWeight: "600",
    color: "#3D622C",
  },

});