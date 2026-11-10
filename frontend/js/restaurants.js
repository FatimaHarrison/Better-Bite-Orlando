/* Better Bite Orlando | Healthy Restaurants */

// Development API
const RESTAURANT_API_URL =
    "https://api-dev.betterbiteorlando.com/places/restaurants";

// Restaurant details panel
const detailsContent = document.getElementById("detailsContent");

// Track selected restaurant
let selectedRestaurant = null;


// Retrieve healthy restaurant search results
async function fetchRestaurants(zip, maxDistance = 10) {

    const params = new URLSearchParams({
        location: zip,
        maxDistance: String(maxDistance)
    });

    const response = await fetch(
        `${RESTAURANT_API_URL}?${params}`
    );

    if (!response.ok) {
        throw new Error(
            `Restaurant API returned HTTP ${response.status}`
        );
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error("Unexpected restaurant API response.");
    }

    console.log("Restaurant results:", data);

    return data;
}


// Restaurant page elements
const restaurantGrid = document.getElementById("restaurantGrid");
const resultCount = document.getElementById("resultCount");
const searchBtn = document.getElementById("searchBtn");
const locationInput = document.getElementById("location");
const distanceInput = document.getElementById("distance");
const emptyMessage = document.getElementById("emptyMessage");

// Display selected restaurant details
function showRestaurantDetails(restaurant) {

    selectedRestaurant = restaurant;

    const name = restaurant.name || "Unnamed Restaurant";
    const address = restaurant.address || "Address unavailable";
    const hours = restaurant.openingHours || "Hours unavailable";

    const distance =
        restaurant.distanceMiles != null &&
        Number.isFinite(Number(restaurant.distanceMiles))
            ? `${Number(restaurant.distanceMiles).toFixed(1)} miles away`
            : "Distance unavailable";

    detailsContent.replaceChildren();

    const details = document.createElement("div");
    details.className = "restaurant-details-info";

    const heading = document.createElement("h2");
    heading.textContent = name;

    const addressText = document.createElement("p");
    addressText.textContent = `📍 ${address}`;

    const distanceText = document.createElement("p");
    distanceText.textContent = `Distance: ${distance}`;

    const hoursText = document.createElement("p");
    hoursText.textContent = `🕒 ${hours}`;

    const actions = document.createElement("div");
    actions.className = "restaurant-detail-actions";

    if (address !== "Address unavailable") {

        const directions = document.createElement("a");

        const mapsUrl = new URL(
            "https://www.google.com/maps/dir/"
        );

        mapsUrl.searchParams.set("api", "1");
        mapsUrl.searchParams.set(
            "destination",
            `${name}, ${address}`
        );

        directions.href = mapsUrl.toString();
        directions.target = "_blank";
        directions.rel = "noopener noreferrer";
        directions.className = "btn btn-primary";

        directions.textContent = "Get Directions";

        actions.appendChild(directions);
    }

    details.append(
        heading,
        addressText,
        distanceText,
        hoursText,
        actions
    );

    detailsContent.appendChild(details);
}


// Display restaurant cards from API results
function renderRestaurants(restaurants) {

    restaurantGrid.replaceChildren();

    resultCount.textContent =
        `${restaurants.length} restaurants`;

    emptyMessage.hidden = restaurants.length !== 0;

    restaurants.forEach((restaurant) => {

        // Create clickable restaurant card
        const card = document.createElement("button");
        card.type = "button";
        card.className = "restaurant-card";

        // Highlight selected restaurant
        if (selectedRestaurant === restaurant) {
            card.classList.add("selected");
        }

        const content = document.createElement("div");
        content.className = "restaurant-card-content";

        // Restaurant icon
        const icon = document.createElement("div");
        icon.className = "restaurant-card-icon";

        const iconElement = document.createElement("i");
        iconElement.className = "bi bi-shop";

        icon.appendChild(iconElement);

        // Restaurant information
        const information = document.createElement("div");
        information.className = "restaurant-card-info";

        const name = document.createElement("h3");
        name.textContent =
            restaurant.name || "Unnamed Restaurant";

        const address = document.createElement("p");
        address.className = "restaurant-card-address";
        address.textContent =
            restaurant.address || "Address unavailable";

        const distance = document.createElement("p");
        distance.className = "restaurant-card-distance";

        const miles = restaurant.distanceMiles;

        distance.textContent =
            miles != null &&
            miles !== "" &&
            Number.isFinite(Number(miles))
                ? `${Number(miles).toFixed(1)} miles away`
                : "Distance unavailable";

        const hours = document.createElement("p");
        hours.className = "restaurant-card-hours";

        const clock = document.createElement("i");
        clock.className = "bi bi-clock me-1";

        hours.append(
            clock,
            document.createTextNode(
                restaurant.openingHours || "Hours unavailable"
            )
        );

        information.append(
            name,
            address,
            distance,
            hours
        );

        // Arrow
        const arrow = document.createElement("i");
        arrow.className =
            "bi bi-chevron-right restaurant-card-arrow";

        content.append(icon, information, arrow);
        card.appendChild(content);

        // Select restaurant and update details panel
        card.addEventListener("click", () => {

            showRestaurantDetails(restaurant);

            // Update selected card highlight
            restaurantGrid
                .querySelectorAll(".restaurant-card")
                .forEach(item => {
                    item.classList.remove("selected");
                });

            card.classList.add("selected");
        });

        restaurantGrid.appendChild(card);
    });


}

// Search restaurants using the deployed backend
async function searchRestaurants() {

    const zip = locationInput.value.trim();
    const maxDistance = Number(distanceInput.value);

    if (!/^\d{5}$/.test(zip)) {
        alert("Please enter a valid five-digit ZIP code.");
        return;
    }

    restaurantGrid.textContent = "Searching for restaurants...";
    resultCount.textContent = "";

    try {
        const restaurants = await fetchRestaurants(zip, maxDistance);

        console.log("Loaded restaurants:", restaurants);

        renderRestaurants(restaurants);

    } catch (error) {
        console.error("Restaurant search failed:", error);

        restaurantGrid.textContent =
            `Unable to load restaurants: ${error.message}`;
    }
}

// Search button
searchBtn.addEventListener("click", searchRestaurants);

// Enter key search
locationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchRestaurants();
    }
});
