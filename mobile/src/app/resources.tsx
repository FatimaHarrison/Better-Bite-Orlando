import {
  View, 
  Text,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from "../styles/resourcesStyles";

export default function ResourcesScreen() {
  
   // Food and nutrition resources

   const resources = [
    {
      id: "blog",
      icon: "📰",
      title: "Blog & Research",
      description: "Nutrition reseach, articles, and healhy living tips.",
      backgroundColor: "#DDF5DF",
      accentColor: "#55A868",
    },

    {
    id: "nutrition",
    icon: "🥦",
    title: "Nutrition Guides",
    description: "Learn about balanced meals, nutrients, and healthy habits.",
    backgroundColor: "#FFE1CC",
    accentColor: "#FF8A30",
  },

    {
    id: "assistance",
    icon: "🛒",
    title: "Food Assistance",
    description: "Find food banks, community programs, and food benefits.",
    backgroundColor: "#EEDBF5",
    accentColor: "#A538CF",
  },

  ];

  // help & support resources

  const helpResources = [
    {
      id: "faq",
      icon: "❓",
      title: "Frequently Asked Questions",
      description: "Find answers to common questions.",
    },
    
    {
      id: "user-guide",
      icon: "📱",
      title: "How to use Better Bite",
      description: "Learn how to find food and save favorites.",
    },

    {
      id: "contact",
      icon: "📞",
      title: "Contact Us",
      description: "Get help or share your feedback.",
    },
  ];


    // About & legal resources

  const legalResources = [
    {
      id: "about",
      icon: "ℹ️",
      title: "About Us",
      description: "Learn more about Better Bite and our mission.",
    },
    
    {
      id: "privacy-policy",
      icon: "🔒",
      title: "Privacy Policy",
      description: "Understand how we handle your personal information.",
    },

    {
      id: "terms-of-service",
      icon: "📄",
      title: "Terms of Service",
      description: "Review the terms and conditions for using Better Bite.",
    },
  ];




  return (
    <SafeAreaView style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>

     {/* page header */}
        <Text style={styles.PageTitle}>
          Resources 📚
          </Text>

     <Text style={styles.pageDescription}>
      Explore helpful information for a healhier Orlando.     
      </Text>

      {/*food and nutrition */}

      <Text style={styles.sectionTitle}>
       🌿 Food & Nutrition
      </Text>

    {/* Resources card */}

    {resources.map((resource) => (

        <Pressable 
          key={resource.id} 
          
          style={[
            styles.resourceCard,
            {
              backgroundColor: resource.backgroundColor,
              borderLeftColor: resource.accentColor,
            },
            ]}

            accessibilityRole="button"

            onPress={() => 
              Alert.alert(
                resource.title,
              "This section is coming soon...?"
            )
          }
          > 
          
          
          {/* Card Icon */}
           
          <Text style={styles.cardIcon}>
            {resource.icon}
          </Text>

          {/* Card Information */}
          <View style={styles.cardContent}>

            <Text style={styles.cardTitle}>
              {resource.title}
            </Text>


            <Text style={styles.cardDescription}>
              {resource.description}
            </Text>

          </View>

          {/* navigation arrow */}

          <Text style={styles.navigationArrow}>
            ›
          </Text>

      </Pressable>
    ))}

    {/* Help & Support */}

    <Text style={styles.sectionTitle}>
      ❓ Help & Support
    </Text>

    {/* Help & Support cards*/}

    {helpResources.map((item) => (

      <Pressable 
        key={item.id} 

        style={styles.supportCard}

        accessibilityRole="button"

        onPress={() => 
          Alert.alert(
            item.title,
            "This section is coming soon...?"
          )
        }
      >

        {/* Card Icon */}

        <Text style={styles.supportIcon}>
          {item.icon}
        </Text>

        {/* Card Information */}

        <View style={styles.supportContent}>
          <Text style={styles.supportTitle}>
            {item.title}
          </Text>
          
          <Text style={styles.supportDescription}>
            {item.description}
          </Text>

        </View>

        {/* navigation arrow */}

        <Text style={styles.navigationArrow}>
          ›
        </Text>

      </Pressable>
    ))}


    <Text style={styles.sectionDescription}>
    FAQs, contact information, and user guides are coming soon.
    </Text>

    {/* About & legal */}

    <Text style={styles.sectionTitle}>
      ⚖️ About & Legal
    </Text>

    {/* About & legal cards */}

    {legalResources.map((item) => (

      <Pressable 
        key={item.id} 

        style={styles.supportCard}

        accessibilityRole="button"

        onPress={() => 
          Alert.alert(
            item.title,
            "This section is coming soon...?"
          )
        }
      >

        {/* Card Icon */}
        <Text style={styles.supportIcon}>
          {item.icon}
        </Text>

        {/* Card Information */}

        <View style={styles.supportContent}>
          
          <Text style={styles.supportTitle}>
            {item.title}
          </Text>

          <Text style={styles.supportDescription}>
            {item.description}
          </Text>
        </View>

        {/* navigation arrow */}
        <Text style={styles.navigationArrow}>
          ›
        </Text>

      </Pressable>
    ))}


    <Text style={styles.sectionDescription}>
      About Us, Privacy Policy, and Terms of Service.
    </Text>
    </ScrollView>
    </SafeAreaView>
  );
}