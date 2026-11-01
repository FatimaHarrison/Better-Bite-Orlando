import { useState } from 'react';

import { 
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    ScrollView,
} from "react-native";

 import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "../styles/healthyRestaurantsStyles";

 export default function HealthyRestaurantsScreen() {

    // Search text typed by the user 
    const [search, setSearch] = useState("");

    const [selectedDietary, setSelectedDietary] = useState("all");

    const dietaryFilters = [
        { label: "All", value: "all" },
        { label: "vegan", value: "vegan" },
        { label: "vegetarian", value: "vegetarian" },
        { label: "high-protein", value: "high-protein" },
    ];

    // Temporary data until backend integration
    const meals = [
        {
            id: 1,
            name: "Grilled Chicken bowl",
            restaurant: "Example Restaurant",
            calories: 350,
            protein: 30,
            dietary: ["high-protein"],
        },
        {
            id: 2,
            name: "Greek Salad",
            restaurant: "Healthy Kitchen",
            calories: 320,
            protein: 10.50,
            dietary: ["vegetarian"],
        },
{
            id: 3,
            name: "Vegetarian Wrap",
            restaurant: "Fresh Garden",
            calories: 300,
            protein: 14,
            dietary: ["vegan", "vegetarian"],
        },
    ];

    // filter meals based oon the search 
    const filteredMeals = meals.filter(meal => {

        // search by meal name 
        const matchesSearch = meal.name.
        toLowerCase()
        .includes(search.trim().toLowerCase());

        // filter by dietary preference
        const matchesDietary =
         selectedDietary === "all" ||
         meal.dietary.includes(selectedDietary);

         // both conditions must be true 
        return matchesSearch && matchesDietary;
    });

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.title}>
                🥗 Healthy Restaurants
                </Text>

            <Text style = {styles.description}> 
                Discover healthy meals around Orlando. 
            </Text>

            <TextInput
                style={styles.searchInput}  
                placeholder="Search healthy meals..."
                value={search}
                onChangeText={setSearch}
            />

            <ScrollView horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            >

                {dietaryFilters.map((filter) => (

                    <Pressable
                        key={filter.value}

                        onPress={() => setSelectedDietary(filter.value)}

                        accessibilityRole="button"

                        accessibilityState={{
                             selected: selectedDietary === filter.value 
                            }}

                        style={[
                            styles.filterButton,

                            selectedDietary === filter.value && 
                            styles.filterButtonActive,
                        ]}
                    >
                        <Text
                         style={[
                             styles.filterButtonText,
                             selectedDietary === filter.value 
                             && styles.filterButtonTextActive,
                         ]}
                         >
                            {filter.label}
                            </Text>

                    </Pressable>
                    
                ))}
            </ScrollView>

            <FlatList
                data={filteredMeals}

                keyExtractor={(item) => item.id.toString()}

                renderItem={({ item }) => (

                    <View style={styles.card}>

                        <Text style={styles.mealName}>
                            {item.name}
                        </Text>

                        <Text style={styles.mealRestaurant}>
                            {item.restaurant}
                        </Text>

                        <Text style={styles.mealNutrition}>
                            🔥 {item.calories} kcal | 💪 {item.protein} g protein
                            </Text>
                        
                    </View>
                )}

                ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No meals found.</Text>
                )}
            />

        </SafeAreaView>
    );
}


