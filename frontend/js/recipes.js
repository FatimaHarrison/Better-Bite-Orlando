
document.addEventListener("DOMContentLoaded", function () {

    // Get all recipe cards
    const recipeCards = document.querySelectorAll(".recipe-card");

    // Get time and dietary filter buttons
    const timeButtons = document.querySelectorAll("[data-time]");
    const dietButtons = document.querySelectorAll("[data-diet]");

    // Get search elements
    const searchInput = document.querySelector(".search input");
    const searchButton = document.querySelector(".search button");

    // Get results count
    const resultsCount = document.querySelector(".result-count");

    // Store selected filters
    let selectedTime = null;
    let selectedDiets = [];

    // Filter recipes
    function filterRecipes() {

        let visibleCount = 0;

        // Get search text
        const searchText = searchInput.value.toLowerCase().trim();

        recipeCards.forEach(function (card) {

            // Get recipe cooking time
            const timeText = card.querySelector(".meta span:first-child").textContent;
            const recipeTime = parseInt(timeText.match(/\d+/)[0]);

            // Get recipe dietary tags
            const tags = Array.from(card.querySelectorAll(".tags .tag"))
                .map(tag => tag.textContent.toLowerCase().trim());

            // Get recipe title
            const title = card.querySelector("h3").textContent.toLowerCase();

            // Check cooking time
            let matchesTime = true;

            if (selectedTime !== null && selectedTime !== "all") {
                matchesTime = recipeTime <= Number(selectedTime);
            }

            // Check dietary preferences
            const matchesDiet = selectedDiets.every(function (diet) {
                return tags.includes(diet.toLowerCase());
            });

            // Check search text
            const matchesSearch =
                title.includes(searchText) ||
                tags.some(tag => tag.includes(searchText));

            // Show or hide recipe
            if (matchesTime && matchesDiet && matchesSearch) {

                card.hidden = false;
                visibleCount++;

            } else {

                card.hidden = true;

            }

        });

        // Update results count
        resultsCount.textContent = `Results ( ${visibleCount} )`;

        // Show message when no recipes match
        let noResults = document.querySelector(".no-results");

        if (visibleCount === 0) {

            if (!noResults) {

                noResults = document.createElement("div");
                noResults.className = "no-results";
                noResults.textContent =
                    "No recipes found. Try changing your filters.";

                document.querySelector(".recipe-grid").appendChild(noResults);
            }

        } else if (noResults) {

            noResults.remove();

        }

    }

    // Cooking time filter
    timeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const time = button.dataset.time;

            // Remove previous selection
            timeButtons.forEach(btn => btn.classList.remove("active"));

            // Toggle selected time
            if (selectedTime === time) {

                selectedTime = null;

            } else {

                selectedTime = time;
                button.classList.add("active");

            }

            filterRecipes();

        });

    });

    // Dietary preference filters
    dietButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const diet = button.dataset.diet;

            // Toggle dietary preference
            if (selectedDiets.includes(diet)) {

                selectedDiets = selectedDiets.filter(
                    item => item !== diet
                );

                button.classList.remove("active");

            } else {

                selectedDiets.push(diet);
                button.classList.add("active");

            }

            filterRecipes();

        });

    });

    // Search button
    searchButton.addEventListener("click", filterRecipes);

    // Search using Enter key
    searchInput.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            filterRecipes();
        }

    });

});


const recipes = {
    chicken: {
        title: "Grilled Chicken Salad",
        image: "../images/chicken-salad.jpg",
        description: "A fresh and healthy salad with grilled chicken, vegetables, and a light dressing.",
        ingredients: [
            "Grilled chicken breast",
            "Mixed greens",
            "Cherry tomatoes",
            "Cucumber",
            "Olive oil dressing"
        ],
        instructions: [
            "Grill the chicken until fully cooked.",
            "Wash and prepare the vegetables.",
            "Slice the chicken into strips.",
            "Combine everything in a bowl and add dressing."
        ]
    },

    pasta: {
        title: "Healthy Vegetable Pasta",
        image: "../images/vegetable-pasta.jpg",
        description: "A delicious pasta dish packed with fresh vegetables.",
        ingredients: [
            "Whole wheat pasta",
            "Bell peppers",
            "Zucchini",
            "Cherry tomatoes",
            "Olive oil"
        ],
        instructions: [
            "Cook the pasta according to package directions.",
            "Chop the vegetables.",
            "Saute the vegetables in olive oil.",
            "Mix the vegetables with the pasta and serve."
        ]
    },

    smoothie: {
        title: "Berry Breakfast Smoothie",
        image: "../images/berry-smoothie.jpg",
        description: "A refreshing smoothie made with berries and nutritious ingredients.",
        ingredients: [
            "Strawberries",
            "Blueberries",
            "Banana",
            "Milk or milk alternative",
            "Greek yogurt"
        ],
        instructions: [
            "Add all ingredients to a blender.",
            "Blend until smooth.",
            "Pour into a glass and enjoy."
        ]
    }
};

// Listen for clicks on all View Details buttons
document.querySelectorAll(".view-details").forEach(button => {
    button.addEventListener("click", function () {

        const card = this.closest(".recipe-card");
        const recipeId = card.dataset.recipe;
        const recipe = recipes[recipeId];

        if (!recipe) return;

        // Update the large recipe image
        document.getElementById("detail-image").src = recipe.image;
        document.getElementById("detail-image").alt = recipe.title;

        // Update recipe title and description
        document.getElementById("detail-title").textContent = recipe.title;
        document.getElementById("detail-description").textContent = recipe.description;

        // Update ingredients
        const ingredientsList = document.getElementById("detail-ingredients");
        ingredientsList.innerHTML = "";

        recipe.ingredients.forEach(ingredient => {
            const li = document.createElement("li");
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        });

        // Update instructions
        const instructionsList = document.getElementById("detail-instructions");
        instructionsList.innerHTML = "";

        recipe.instructions.forEach(instruction => {
            const li = document.createElement("li");
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });
    });
});
