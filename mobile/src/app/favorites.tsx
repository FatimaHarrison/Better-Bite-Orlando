import { useState } from "react";

import {
     View, 
     Text,
     Pressable,
     ScrollView,
     } from "react-native";

import { useRouter } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/favoritesStyles";


export default function FavoritesScreen() {

// Navigation 
const router = useRouter();

// category selection 
const [selectedCategory, setSelectedCategory] = useState("Groceries");

// favorite categories 
const categories = [
    {
        name: "Groceries",
        icon: "🛒",
        color: "#DDF5DF",
        borderColor: "#55A868",
    },
    {
        name: "Restaurants",
        icon: "🥗",
        color: "#FFE1CC",
        borderColor: "#FF8A30",
    },
    {
        name: "Recipes",
        icon: "📖",
        color: "#EEDBF5",
        borderColor: "#A538CF",
    }
]


    return (

        <SafeAreaView style={styles.container}>

            <ScrollView contentContainerStyle={styles.content}>

        {/* Header */}   

            <Text style={styles.pageTitle}>
                    Favorites ❤️
            </Text>

        <Text style={styles.pageDescription}>
            Your saved groceries, restaurants, and recipes
            will appear here.
        </Text>

        {/* Category section */}

        <View style={styles.categoryRow}>

            {categories.map((category) => (
              
              <Pressable
                    key={category.name}
              
                    onPress={() => 
                        setSelectedCategory(category.name)
                    }
                    
                    style ={[
                        styles.categoryTab,

                        selectedCategory === category.name && {
                            backgroundColor: category.color,
                            borderColor: category.borderColor,
                        },
                    ]}
                    
                    accessibilityRole="tab"

                    accessibilityState={{
                        selected: selectedCategory === category.name,
                    }}
                >

                <Text style={ styles.categoryIcon}>
                    {category.icon}
                </Text>

                <Text style= {styles.categoryLabel}>
                    {category.name}
                </Text>

            </Pressable>

            ))}

        </View>


        {/* saved items section */}

        <View style={styles.emptyCard}>

            <Text style={styles.emptyIcon}>
                ♡
            </Text>


            <Text style={styles.emptyTitle}>
                No saved {selectedCategory.toLowerCase()} yet
            </Text>
            
            <Text style={styles.emptyDescription}>
                Your favorite {selectedCategory.toLowerCase()}{" "}will appear here once you save them.
            </Text>



            {/* explore button */}

            <Pressable
            style={styles.exploreButton}
            onPress={() => router.push("/explore")}
            accessibilityRole="button"
            >
                <Text style={styles.exploreButtonText}>
                    Explore Foods
                </Text>

            </Pressable>

         </View>  
        </ScrollView>

    </SafeAreaView>
    );
}