/* Better Bite Orlando | Healthy Restaurants */

// Development API
const RESTAURANT_API_URL =
    "https://api-dev.betterbiteorlando.com/places/restaurants";

// Restaurant details panel
const detailsContent = document.getElementById("detailsContent");

// Track selected restaurant
let selectedRestaurant = null;

// Restaurant map
let restaurantMap = null;
let restaurantMarkers = null;
const restaurantLocationMarkers = new Map();

// Generate Google Maps directions URL
function getRestaurantDirectionsUrl(restaurant, mode = "driving") {

    const mapsUrl = new URL(
        "https://www.google.com/maps/dir/"
    );

    mapsUrl.searchParams.set("api", "1");

    const lat = Number(restaurant.latitude);
    const lon = Number(restaurant.longitude);

    const hasCoordinates =
        restaurant.latitude != null &&
        restaurant.longitude != null &&
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180;

    const destination = hasCoordinates
        ? `${lat},${lon}`
        : `${restaurant.name || ""}, ${restaurant.address || ""}`;

    mapsUrl.searchParams.set("destination", destination);
    mapsUrl.searchParams.set("travelmode", mode);

    return mapsUrl.toString();
}

// Initialize Leaflet map
function initializeRestaurantMap() {

    restaurantMap = L.map("restaurant-map").setView(
        [28.5383, -81.3792],
        11
    );

    // OpenStreetMap tiles
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(restaurantMap);

    restaurantMarkers = L.featureGroup().addTo(restaurantMap);

    // Refresh map dimensions after browser layout
    requestAnimationFrame(() => {

    restaurantMap.invalidateSize();

});
}

// Display restaurant locations on map
function updateRestaurantMap(restaurants) {

    if (!restaurantMap || !restaurantMarkers) {
        return;
    }

    restaurantMarkers.clearLayers();
    restaurantLocationMarkers.clear();

    restaurants.forEach((restaurant) => {

        const lat = Number(restaurant.latitude);
        const lon = Number(restaurant.longitude);

        if (
            restaurant.latitude == null ||
            restaurant.longitude == null ||
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            lat < -90 || lat > 90 ||
            lon < -180 || lon > 180
        ) {
            return;
        }

        const marker = L.marker([lat, lon]);

        const popup = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent =
            restaurant.name || "Unnamed Restaurant";

        const address = document.createElement("p");
        address.textContent =
            restaurant.address || "Address unavailable";

  // Transportation directions inside map popup
const directionsContainer = document.createElement("div");
directionsContainer.className = "restaurant-map-directions";

const transportationModes = [
    { label: "Drive", mode: "driving", icon: "bi-car-front" },
    { label: "Bus", mode: "transit", icon: "bi-bus-front" },
    { label: "Walk", mode: "walking", icon: "bi-person-walking" }
];

transportationModes.forEach((transport) => {

    const link = document.createElement("a");

    link.href = getRestaurantDirectionsUrl(
        restaurant,
        transport.mode
    );

    link.target = "_blank";
    link.rel = "noopener noreferrer";

    link.className = "restaurant-direction-link";

    const icon = document.createElement("i");
    icon.className = `bi ${transport.icon}`;

    link.append(
        icon,
        document.createTextNode(transport.label)
    );

    directionsContainer.appendChild(link);
});

popup.append(
    name,
    address,
    directionsContainer
);

marker.bindPopup(popup);

// Select restaurant when marker is clicked
marker.on("click", () => {

    selectedRestaurant = restaurant;

    // Update restaurant details
    showRestaurantDetails(restaurant);

    // Highlight corresponding restaurant card
    restaurantGrid
        .querySelectorAll(".restaurant-card")
        .forEach((card) => {
            card.classList.remove("selected");
        });

    const restaurantIndex = restaurants.indexOf(restaurant);

    const cards = restaurantGrid.querySelectorAll(".restaurant-card");

    if (cards[restaurantIndex]) {
        cards[restaurantIndex].classList.add("selected");
    }
});

marker.addTo(restaurantMarkers);

        restaurantLocationMarkers.set(restaurant, marker);
    });

    if (restaurantMarkers.getLayers().length > 0) {

        restaurantMap.fitBounds(
            restaurantMarkers.getBounds(),
            {
                padding: [30, 30],
                maxZoom: 14
            }
        );
    }

// Allow the browser to finish laying out the map
requestAnimationFrame(() => {

    restaurantMap.invalidateSize();

});}



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

    // Focus selected restaurant on map
const selectedMarker = restaurantLocationMarkers.get(restaurant);

if (selectedMarker && restaurantMap) {

    restaurantMap.setView(
        selectedMarker.getLatLng(),
        15
    );

    selectedMarker.openPopup();
}


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

// Transportation options
const transportationModes = [
    { label: "Drive", mode: "driving", icon: "bi-car-front" },
    { label: "Bus", mode: "transit", icon: "bi-bus-front" },
    { label: "Walk", mode: "walking", icon: "bi-person-walking" }
];

const hasDestination =
    address !== "Address unavailable" ||
    (
        restaurant.latitude != null &&
        restaurant.longitude != null &&
        Number.isFinite(Number(restaurant.latitude)) &&
        Number.isFinite(Number(restaurant.longitude))
    );

if (hasDestination) {

    const directionsContainer = document.createElement("div");
    directionsContainer.className = "restaurant-detail-directions";

    transportationModes.forEach((transport) => {

        const link = document.createElement("a");

        link.href = getRestaurantDirectionsUrl(
            restaurant,
            transport.mode
        );

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.className = "restaurant-direction-link";

        const icon = document.createElement("i");
        icon.className = `bi ${transport.icon}`;

        link.append(
            icon,
            document.createTextNode(transport.label)
        );

        directionsContainer.appendChild(link);
    });

    actions.appendChild(directionsContainer);
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

        // Reset previous restaurant selection
        selectedRestaurant = null;

        detailsContent.replaceChildren();

        const placeholder = document.createElement("p");
        placeholder.className = "empty-details";
        placeholder.textContent = "Select a restaurant to view its details.";

        detailsContent.appendChild(placeholder);

        console.log("Loaded restaurants:", restaurants);

        renderRestaurants(restaurants);

        // Update map with restaurant search results
        updateRestaurantMap(restaurants);

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

// Initialize restaurant map
document.addEventListener("DOMContentLoaded", () => {

    initializeRestaurantMap();

    searchRestaurants();

    // Recalculate Leaflet dimensions after layout
    requestAnimationFrame(() => {
        restaurantMap.invalidateSize();
    });

});