import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/homeStyles";

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

        {/* == HEADER == */}

      <View style={styles.header}>

      <Image
        source={require("../../assets/images/better-bite-logo.png")}
        style={styles.brandLogo}
        resizeMode="contain"
        accessibilityLabel="Better Bite Orlando Logo"
        />

        <Text style={styles.headerTag}>
          Orlando, FL
        </Text>

      </View>

      

        {/* === HERO SECTION === */}
        <View style={styles.hero}>

          <ImageBackground
            source={require("../../assets/images/orlando-hero.jpg")}
            style={styles.heroBackground}
            resizeMode="cover"
          > 


            {/* Background Overlay */}
            <View style={styles.heroOverlay}> 
          
          <Text style={styles.heroTitle}>
            Choose How You {"\n"}Want to Eat Healthy.
          </Text>
          
          <Text style={styles.heroDescription}>
            Discover fresh groceries, healthier restaurants, 
            and delicious recipes around Orlando.
          </Text>

          </View>

      </ImageBackground>
     </View>




        {/* FOOD CATEGORIES */}

        <Text style={styles.sectionTitle}>
          What are you looking for?
        </Text>


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

        onPress={() =>
          Alert.alert(
            category.title,
            "This section is coming soon!"
              )
            }
          >

          {/* Category Icon */}
          
            <Text style={styles.cardIcon}>
              {category.icon}
            </Text>


            {/* Category Information */}
            
            <View style={styles.cardContent}>

              <Text style={styles.cardTitle}>
                {category.title}
              </Text>

              <Text style={styles.cardDescription}>
                {category.description}
              </Text>

            <Text style={styles.cardLink}>
              Explore Options →
              </Text>

        </View>

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