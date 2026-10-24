console.log("Better Bite Orlando - Search Results JS Loaded....");


// Retrieve meals from Aram's API
async function loadMeals() {

    try {

        const response = await fetch("http://localhost:3000/meals");

        if(!response.ok) {
            throw new Error("Failed to retrieve meals");
        }

        const meals = await response.json();

        console.log("Meals received from API:", meals);
        
    } catch (error) {

        console.error("Error loading meals:", error);
    }

}

// execute the function
loadMeals();