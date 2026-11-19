import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";

import { StatusBar } from "expo-status-bar";

import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/homeStyles";

import { useRouter } from "expo-router";

import BotanicalBackground from "../../components/BotanicalBackground";
export default function HomeScreen() {

  const router = useRouter();
  
  const categories = [
  // existing categories
    {
      icon: require("../../../assets/images/icon-groceries.png"),
      title: "Find Groceries",
      description: "Markets & food pantries",
    },
    {
      icon: require("../../../assets/images/icon-restaurant.png"),
      title: "Healthy Restaurants",
      description: "Healthier meals nearby",
    },
    {
      icon:require("../../../assets/images/icon-resources.png"),
      title:"Recipes",
      description:"Cook healthy meals at home",
    },
  ];



  return (
    <SafeAreaView style={styles.container}>

      <StatusBar style="dark" />

    {/* Reusable Botanical Background */}
     <BotanicalBackground />

      <ScrollView contentContainerStyle={styles.content}>

        {/* == HEADER == */}

      <View style={styles.header}>

      <Image
        source={require("../../../assets/images/better-bite-logo.png")}
        style={styles.brandLogo}
        resizeMode="contain"
        accessibilityLabel="Better Bite Orlando Logo"
        />

<View style={styles.locationBadge} >

        <Text style={styles.locationIcon}>
          📍
        </Text>
        <Text style={styles.locationText}>
          Orlando, FL
        </Text>
    
</View>
</View>


      

        {/* === HERO SECTION === */}
        <View style={styles.hero}>

          <View style={styles.heroBackground}>

          {/* Orlando skyline decoration */}
          <Image
            source={require("../../../assets/images/orlando-skyline.png")}
            style={styles.skylineImage}
            resizeMode="contain"
            pointerEvents="none"
          />
            


            {/* Background Overlay */}
            <View style={styles.heroOverlay}> 
          
            <View>
              <Text style={styles.heroTitle}>
              Welcome Back!
              </Text>
              
              <Text style={styles.heroDescription}>
                Discover healthy options near you.
              </Text>
            </View>

            <Text style={styles.heroBottomText}>
              Choose how you want to eat healthy.
            </Text>
          </View>
      </View>

      </View>
    




        {/* FOOD CATEGORIES */}

        <Text style={styles.sectionTitle}>
          What are you looking for?
        </Text>

    <View style={styles.cardsRow}>
        {categories.map((category, index) => (

          <Pressable
            key={category.title}

            style={[
            styles.card,

            index === 0 
              ? styles.groceryCard
              : index === 1
              ? styles.restaurantCard
            : styles.recipeCard,
        ]}

        accessibilityRole="button"

        onPress={() => {
          if (category.title === "Healthy Restaurants") {
            router.push("/healthy-restaurants");
          } else {
            Alert.alert(
              category.title,
              "This section is coming soon!"
            );

          }
          
        }}
          >

          {/* Category Icon */}
          
            <Image
              source={category.icon}
              style={styles.cardIcon}
              resizeMode="contain"
            />


            {/* Category Information */}
            
            <View style={styles.cardContent}>

              <Text style={styles.cardTitle}>
                {category.title}
              </Text>

              <Text style={styles.cardDescription}>
                {category.description}
              </Text>

            <Text style={styles.cardLink}>
              Explore →
              </Text>

        </View>

       </Pressable>
      

        ))}
</View>


{/* QUICK START GUIDE */}

<Pressable
  style={styles.quickStartCard}
  accessibilityRole="button"
  accessibilityLabel="Learn how to use Better Bite Orlando"
  onPress={() => router.push("/resources")}
>

<View style={styles.quickStartIconContainer}>
  <Text style={styles.quickStartIcon}>📖</Text>
</View>

<View style={styles.quickStartContent}>

  <Text style={styles.quickStartTitle}>
    New here?
  </Text>

  <Text style={styles.quickStartDescription}>
    Learn how to use the app.
    Explore our guides and resources.
  </Text>
</View>

<Text style={styles.quickStartArrow}>
  →
</Text>

</Pressable>

        {/* BOTTOM MESSAGE */}

        <Text style={styles.footerText}>
          Better Food. A Healthier Orlando.
        </Text>

      </ScrollView>

    </SafeAreaView>
  );
}