
/* ==========================================
   BETTER BITE ORLANDO
   HEALTHY RESTAURANT JAVASCRIPT
========================================== */


/* ==========================================
   RESTAURANT DATA
========================================== */

const restaurants = [

    {
        id: 1,
        name: "Agave Azul",
        cuisine: "Mexican",
        address: "4975 Orlando Gateway Circle",
        city: "Orlando, FL 32812",
        zip: "32812",
        distance: 2.1,
        hours: "Sun-Thu: 11 AM - 10 PM",
        accessibility: "Wheelchair Accessible",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800",
        tags: ["Vegan Options"],
        diets: ["vegetarian", "vegan"],
        description: "A vibrant Mexican restaurant offering fresh ingredients, flavorful tacos, salads, and delicious plant-based options."
    },

    {
        id: 2,
        name: "Carrabba's Italian Grill",
        cuisine: "Italian",
        address: "4750 Orlando Gateway Circle",
        city: "Orlando, FL 32812",
        zip: "32812",
        distance: 3.2,
        hours: "Mon-Thu: 11 AM - 10 PM",
        accessibility: "Wheelchair Accessible",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800",
        tags: ["Heart Healthy Options"],
        diets: ["vegetarian", "high-protein"],
        description: "Enjoy Italian-inspired dishes with fresh vegetables, grilled proteins, pasta, and lighter menu selections."
    },

    {
        id: 3,
        name: "Backlot Bistro",
        cuisine: "American",
        address: "1000 Universal Studios Plaza",
        city: "Orlando, FL 32819",
        zip: "32819",
        distance: 4.5,
        hours: "Daily: 7 AM - 3 AM",
        accessibility: "Wheelchair Accessible",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1000",
        tags: ["Vegan Options", "Vegetarian Options"],
        diets: ["vegetarian", "vegan", "high-protein", "low-carb"],
        description: "A vibrant dining spot with an American-style menu featuring pizza, burgers, sandwiches, chicken, pasta, and salads. Great options for vegan and vegetarian diners!"
    },

    {
        id: 4,
        name: "Earls",
        cuisine: "American",
        address: "4200 Conroy Road",
        city: "Orlando, FL 32839",
        zip: "32839",
        distance: 5.0,
        hours: "Mon-Thu: 9 AM - 11 PM",
        accessibility: "Wheelchair Accessible",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
        tags: ["Vegetarian Options"],
        diets: ["vegetarian", "vegan", "low-carb"],
        description: "A modern restaurant offering fresh salads, colorful vegetable dishes, and nutritious meals made with quality ingredients."
    }

];


/* ==========================================
   DOM ELEMENTS
========================================== */

const restaurantGrid = document.getElementById("restaurantGrid");

const detailsContent = document.getElementById("detailsContent");

const searchBtn = document.getElementById("searchBtn");

const distanceInput = document.getElementById("distance");

const locationInput = document.getElementById("location");

const cuisineInput = document.getElementById("cuisine");

const resultCount = document.getElementById("resultCount");

const emptyMessage = document.getElementById("emptyMessage");

const favoriteList = document.getElementById("favoriteList");


/* ==========================================
   APPLICATION STATE
========================================== */

let selectedRestaurant = restaurants[2];

let favorites = [];

let activeTab = "overview";

let filteredRestaurants = [...restaurants];


/* ==========================================
   DISPLAY RESTAURANT CARDS
========================================== */

function displayRestaurants(data) {

    restaurantGrid.innerHTML = "";

    resultCount.textContent = `${data.length} restaurants`;

    emptyMessage.hidden = data.length !== 0;

    data.forEach(restaurant => {

        const card = document.createElement("article");

        card.className = "restaurant-card";

        if (selectedRestaurant &&
            selectedRestaurant.id === restaurant.id) {

            card.classList.add("selected");

        }

        card.innerHTML = `

            <img
                src="${restaurant.image}"
                alt="${restaurant.name}"
                loading="lazy"
            >

            <div class="card-content">

                <h3>${restaurant.name}</h3>

                <div class="card-meta">

                    <span>🍴 ${restaurant.cuisine}</span>

                    <span>📍 ${restaurant.address},</span>

                    <span>${restaurant.city}</span>

                    <span>🕒 ${restaurant.hours}</span>

                </div>

                <div class="card-tags">

                    ${restaurant.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join("")}

                </div>

                <div class="card-footer">

                    <span class="view-details">
                        View Details →
                    </span>

                </div>

            </div>

        `;

        card.addEventListener("click", () => {

            selectRestaurant(restaurant.id);

        });

        restaurantGrid.appendChild(card);

    });

}


/* ==========================================
   SELECT RESTAURANT
========================================== */

function selectRestaurant(id) {

    const restaurant = restaurants.find(item => item.id === id);

    if (!restaurant) return;

    selectedRestaurant = restaurant;

    activeTab = "overview";

    displayRestaurants(filteredRestaurants);

    displayRestaurantDetails(restaurant);

}


/* ==========================================
   DISPLAY RESTAURANT DETAILS
========================================== */

function displayRestaurantDetails(restaurant) {

    const isFavorite = favorites.includes(restaurant.id);

    detailsContent.innerHTML = `

        <img
            class="detail-image"
            src="${restaurant.image}"
            alt="${restaurant.name}"
        >

        <div class="detail-heading">

            <h2>${restaurant.name}</h2>

            <button
                class="favorite-button"
                id="favoriteButton"
                aria-label="Add to favorites"
                aria-pressed="${isFavorite}"
            >
                ${isFavorite ? "♥" : "♡"}
            </button>

        </div>


        <div class="detail-address">

            <span style="font-size:17px; margin-right:10px;">
                📍
            </span>

            <span>
                ${restaurant.address},<br>
                ${restaurant.city}
            </span>

        </div>


        <div class="detail-tags">

            ${restaurant.tags.map(tag => `
                <span class="tag">${tag}</span>
            `).join("")}

        </div>


        <div class="detail-tabs">

            <button
                class="${activeTab === "overview" ? "active" : ""}"
                data-tab="overview"
            >
                Overview
            </button>

            <button
                class="${activeTab === "accessibility" ? "active" : ""}"
                data-tab="accessibility"
            >
                Accessibility
            </button>

            <button
                class="${activeTab === "hours" ? "active" : ""}"
                data-tab="hours"
            >
                Hours
            </button>

        </div>


        <div class="tab-content" id="tabContent">

            ${getTabContent(restaurant, activeTab)}

        </div>

    `;


    /* FAVORITE BUTTON */

    document.getElementById("favoriteButton")
        .addEventListener("click", toggleFavorite);


    /* TAB BUTTONS */

    document.querySelectorAll(".detail-tabs button")
        .forEach(button => {

            button.addEventListener("click", () => {

                activeTab = button.dataset.tab;

                displayRestaurantDetails(restaurant);

            });

        });

}


/* ==========================================
   TAB CONTENT
========================================== */

function getTabContent(restaurant, tab) {

    if (tab === "overview") {

        return `
            <p>${restaurant.description}</p>
        `;

    }

    if (tab === "accessibility") {

        return `
            <div class="accessibility-info">

                <span style="font-size:20px;">♿</span>

                <div>
                    <strong>Accessibility</strong>
                    <p>${restaurant.accessibility}</p>
                </div>

            </div>
        `;

    }

    if (tab === "hours") {

        return `
            <div class="hours-info">

                <span style="font-size:20px;">◷</span>

                <div>
                    <strong>Hours</strong>
                    <p>${restaurant.hours}</p>
                </div>

            </div>
        `;

    }

    return "";

}


/* ==========================================
   FAVORITES
========================================== */

function toggleFavorite() {

    if (!selectedRestaurant) return;

    const id = selectedRestaurant.id;

    if (favorites.includes(id)) {

        favorites = favorites.filter(item => item !== id);

    } else {

        favorites.push(id);

    }

    displayRestaurantDetails(selectedRestaurant);

    displayFavorites();

}


/* ==========================================
   DISPLAY FAVORITES
========================================== */

function displayFavorites() {

    favoriteList.innerHTML = "";

    if (favorites.length === 0) {

        favoriteList.innerHTML = `
            <p>You haven't saved any favorites yet.</p>
        `;

        return;

    }

    favorites.forEach(id => {

        const restaurant = restaurants.find(item => item.id === id);

        if (!restaurant) return;

        const favorite = document.createElement("div");

        favorite.className = "favorite-item";

        favorite.innerHTML = `
            <strong>${restaurant.name}</strong>
            <span>♡</span>
        `;

        favorite.addEventListener("click", () => {

            selectRestaurant(restaurant.id);

        });

        favoriteList.appendChild(favorite);

    });

}


/* ==========================================
   SEARCH AND FILTER RESTAURANTS
========================================== */

function searchRestaurants() {

    const maxDistance = Number(distanceInput.value);

    const location = locationInput.value
        .trim()
        .toLowerCase();

    const cuisine = cuisineInput.value;

    const selectedDiets = Array.from(
        document.querySelectorAll(
            '.diet-options input:checked'
        )
    ).map(input => input.value);


    filteredRestaurants = restaurants.filter(restaurant => {

        /* DISTANCE FILTER */

        const matchesDistance =
            restaurant.distance <= maxDistance;


        /* LOCATION FILTER */

        const searchableLocation =
            `${restaurant.address} ${restaurant.city} Orlando Florida`
            .toLowerCase();

        const matchesLocation =
            !location || searchableLocation.includes(location);


        /* CUISINE FILTER */

        const matchesCuisine =
            !cuisine || restaurant.cuisine === cuisine;


        /* DIETARY FILTER */

        const matchesDiet =
            selectedDiets.every(diet =>
                restaurant.diets.includes(diet)
            );


        return (
            matchesDistance &&
            matchesLocation &&
            matchesCuisine &&
            matchesDiet
        );

    });


    displayRestaurants(filteredRestaurants);


    /* UPDATE SELECTED RESTAURANT */

    if (
        !filteredRestaurants.some(
            restaurant => restaurant.id === selectedRestaurant?.id
        )
    ) {

        if (filteredRestaurants.length > 0) {

            selectRestaurant(filteredRestaurants[0].id);

        } else {

            selectedRestaurant = null;

            detailsContent.innerHTML = `
                <div class="empty-details">
                    <h3>No Restaurant Selected</h3>
                    <p>Try changing your search filters.</p>
                </div>
            `;

        }

    } else if (filteredRestaurants.length === 0) {

        detailsContent.innerHTML = `
            <div class="empty-details">
                <h3>No Restaurants Found</h3>
                <p>Try changing your search filters.</p>
            </div>
        `;

    }

}


/* ==========================================
   SEARCH BUTTON EVENT
========================================== */

searchBtn.addEventListener("click", searchRestaurants);


/* ==========================================
   ENTER KEY SEARCH
========================================== */

locationInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        searchRestaurants();

    }

});


/* ==========================================
   INITIALIZE WEBSITE
========================================== */

function initializeWebsite() {

    displayRestaurants(restaurants);

    displayRestaurantDetails(selectedRestaurant);

    displayFavorites();

}


/* START WEBSITE */

initializeWebsite();
