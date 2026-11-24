/* Better Bite Orlando | Healthy Restaurants */

// API
const RESTAURANT_API_URL =
    `${window.BBO_CONFIG.API_BASE_URL}/places/restaurants`;

// Restaurant details panel
const detailsContent = document.getElementById("detailsContent");

const restaurantModalElement =
    document.getElementById("restaurantDetailsModal");

const restaurantModalLabel =
    document.getElementById("restaurantDetailsModalLabel");

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
        address.textContent = formatRestaurantAddress(restaurant);

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

const viewDetailsButton = document.createElement("button");

viewDetailsButton.type = "button";
viewDetailsButton.className = "restaurant-popup-details";
viewDetailsButton.textContent = "View full details";

viewDetailsButton.addEventListener("click", () => {
    showRestaurantDetails(restaurant);
});


popup.append(
    name,
    address,
    directionsContainer,
    viewDetailsButton

);

marker.bindPopup(popup);

// Select restaurant when marker is clicked
marker.on("click", () => {

    // Update restaurant details
    selectedRestaurant = restaurant;

    // Highlight corresponding restaurant card
    restaurantGrid
        .querySelectorAll(".restaurant-card")
        .forEach((card) => {
            card.classList.remove("selected");
        });

    const restaurantIndex = restaurants.indexOf(restaurant);

    const cards = restaurantGrid.querySelectorAll(
        ".restaurant-card"
    );

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
async function fetchRestaurants(zip, maxDistance = 10, conditions = [], cuisine = "" ) {

    const params = new URLSearchParams({
        location: zip,
        maxDistance: String(maxDistance)
    });

    // add dietary preferences to the API request
    if (conditions.length > 0 ) {
        params.set("conditions", conditions.join(","));
    }

    // map selected cuisine to geoapify categories
    const cuisineCategories = {
        Mexican: "catering.restaurant.mexican",
        Italian: "catering.restaurant.italian",
        American: "catering.restaurant.american",
        Asian: "catering.restaurant.asian"
    };

    // add cuisine filter to the API request
    if (cuisineCategories[cuisine]) {
        params.set("category", cuisineCategories[cuisine]);
    }


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

// Cuisine filter
const cuisineInput = document.getElementById("cuisine");
const emptyMessage = document.getElementById("emptyMessage");

const allRestaurantsBtn =
    document.getElementById("allRestaurantsBtn");

const dietaryCheckboxes = 
    document.querySelectorAll(
        ".diet-options input[type='checkbox']"
    );

function syncDietarySelection() {

    const hasSelectedDiet = Array.from(dietaryCheckboxes)
        .some(checkbox => checkbox.checked);

    const isAllSelected = !hasSelectedDiet;
    
    allRestaurantsBtn.classList.toggle(
        "active",
        isAllSelected
    );

    allRestaurantsBtn.setAttribute(
        "aria-pressed",
        String(isAllSelected)
    );
}

dietaryCheckboxes.forEach(checkbox => {

    checkbox.addEventListener("change", () => {
        syncDietarySelection();
    });

});


allRestaurantsBtn.addEventListener("click", () => {

    dietaryCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    syncDietarySelection();

});

syncDietarySelection();


const restaurantSort = document.getElementById("restaurant-sort");

let latestRestaurantResults = [];
let latestRestaurantSearchContext = null;

function sortRestaurantResults(restaurants) {

    const sorted = [...restaurants];

    if (restaurantSort.value === "name") {

        sorted.sort((a, b) => 
        (a.name || "").localeCompare(b.name || "")
    );

    } else {

        const getDistance = (restaurant) => {
            const distance = restaurant.distanceMiles;

            return distance != null &&
                distance !== "" &&
                Number.isFinite(Number(distance))
                ? Number(distance)
                : Infinity;
        };

        sorted.sort((a, b) =>
            getDistance(a) - getDistance(b)
    );
    }

    return sorted;
}

// Dietary classifications supported by our interface
const RESTAURANT_DIETARY_LABELS = [
    {
        value: "vegetarian",
        label: "Vegetarian",
        className: "vegetarian"
    },
    {
        value: "vegan",
        label: "Vegan",
        className: "vegan"
    },
    {
        value: "gluten_free",
        label: "Gluten-Free",
        className: "gluten-free"
    },
        {
        value: "organic",
        label: "Organic",
        className: "organic"
    },
];

function getRestaurantDietaryLabels(restaurant) {

    const categories = Array.isArray(restaurant.dietaryOptions)
    ? restaurant.dietaryOptions
    : [];

    const listed = new Set(
        categories
        .filter(category => typeof category === "string")
        .map(category => category.toLowerCase().trim())
    );

    return RESTAURANT_DIETARY_LABELS.filter(({ value }) =>
        listed.has(value) ||
    (value === "vegan" && listed.has("vegan.only"))
    );
}

function createRestaurantDietaryTags(restaurant) {

    const labels = getRestaurantDietaryLabels(restaurant);

    if (!labels.length) return null;

    const container = document.createElement("div");
    container.className = "restaurant-dietary-tags";

    container.setAttribute(
        "aria-label",
        "Dietary options in the place listing"
    );

    labels.forEach(({ label, className }) => {

        const tag = document.createElement("span");

        tag.className = 
            `restaurant-dietary-tag restaurant-dietary-tag--${className}`;

        tag.textContent = label;

        container.appendChild(tag);
    });

    return container;
}


// remove retaurant name from the begining of the address
function formatRestaurantAddress(restaurant) {

    const name = String(restaurant.name ?? "").trim();
    const address = String(restaurant.address ?? "").trim();

    if(!address) return "Address unavailable";
    if(!name) return address;

    const prefix = `${name},`;

    if(address.toLowerCase().startsWith(prefix.toLowerCase())) {
        return address.slice(prefix.length).trim();

    }

    return address;
}

// convert 24 hours time to 12 hours time 
function formatRestaurantTime(time) {

    const [hour, minute] = time.split(":").map(Number);

    if (
        !Number.isInteger(hour) ||
        !Number.isInteger(minute) ||
        hour < 0 || hour > 23 ||
        minute < 0 || minute > 59
    ) {
        return time;
    }

    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    const formattedMinute = minute === 0
        ? ""
        : `:${String(minute).padStart(2, "0")}`;

    return `${formattedHour}${formattedMinute} ${period}`;
}


// convert opening hours 
function formatRestaurantHours(openingHours) {

    if (
        typeof openingHours !== "string" ||
        !openingHours.trim()
    ) {
        return [];
    }

    const dayNames = {
        Mo: "Mon",
        Tu: "Tue",
        We: "Wed",
        Th: "Thu",
        Fr: "Fri",
        Sa: "Sat",
        Su: "Sun"
    };

    return openingHours
        .split(";")
        .map(part => part.trim())
        .filter(Boolean)
        .map(part => {

            const match = part.match(
                /^(.+?)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/
            );

            // save format in case losing information
            if (!match) {
                return {
                    days: "Schedule",
                    time: part
                };
            }

            const days = match[1]
            .replace(
                /\b(Mo|Tu|We|Th|Fr|Sa|Su)\b/g,
                day => dayNames[day]
            )
            .replace(/\s*-\s*/g, "–");

        const start = formatRestaurantTime(match[2]);
        const end = formatRestaurantTime(match[3]);

        return {
            days,
            time: `${start} - ${end}`
        };
    });

}

function buildNoRestaurantsMessage({
    zip,
    maxDistance,
    selectedDiets,
    selectedCuisine
}) {

    const selectedLabels = RESTAURANT_DIETARY_LABELS
    .filter(item => selectedDiets.includes(item.value))
    .map(item => item.label);

    const dietaryDescription = selectedLabels.length
    ? ` tagged for ${new Intl.ListFormat("en", {
        style: "long",
        type: "conjunction"
    }).format(selectedLabels)}`
    : "";

    const cuisineDescription = selectedCuisine
    ? `${selectedCuisine} `
    : "";

    const distance =
    `${maxDistance} ${maxDistance === 1 ? "mile" : "miles"}`;

    return (
        `No ${cuisineDescription}restaurant listings${dietaryDescription} ` +
        `were found within ${distance} of ZIP code ${zip}. ` +
        "Try increasing your distance or changing your preferences. " +
        "Dietary labels depend on available listing data and may be incomplete."
    );
}


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

    restaurantMap.closePopup();
}


    const name = restaurant.name || "Unnamed Restaurant";
    restaurantModalLabel.textContent = name;

    const address = formatRestaurantAddress(restaurant);

    const distance =
        restaurant.distanceMiles != null &&
        Number.isFinite(Number(restaurant.distanceMiles))
            ? `${Number(restaurant.distanceMiles).toFixed(1)} miles away`
            : "Distance unavailable";

    detailsContent.replaceChildren();

    const details = document.createElement("div");
    details.className = "restaurant-details-info";


    const addressText = document.createElement("p");
    addressText.textContent = `📍 ${address}`;

    const distanceText = document.createElement("p");
    distanceText.textContent = `Distance: ${distance}`;

// Create full opening hours section
const hoursSection = document.createElement("section");
hoursSection.className = "restaurant-opening-hours";

const hoursHeading = document.createElement("h3");
hoursHeading.textContent = "Opening Hours";

hoursSection.appendChild(hoursHeading);

const schedules = formatRestaurantHours(
    restaurant.openingHours
);

if (schedules.length === 0) {

    const unavailable = document.createElement("p");
    unavailable.textContent = "Hours unavailable";

    hoursSection.appendChild(unavailable);

} else {

    const hoursList = document.createElement("dl");
    hoursList.className = "restaurant-hours-list";

    schedules.forEach(schedule => {

        const day = document.createElement("dt");
        day.textContent = schedule.days;

        const time = document.createElement("dd");
        time.textContent = schedule.time;

        hoursList.append(day, time);
    });

    hoursSection.appendChild(hoursList);
}

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



// Add dietary tags when available
const detailDietaryTags = createRestaurantDietaryTags(restaurant);

if (detailDietaryTags) {
    details.appendChild(detailDietaryTags);
}

// Add remaining restaurant details
details.append(
    addressText,
    distanceText,
    hoursSection,
    actions
);

detailsContent.appendChild(details);

const restaurantModal =
    bootstrap.Modal.getOrCreateInstance(
        restaurantModalElement
    );

    restaurantModal.show();

}
// Display restaurant cards from API results
function renderRestaurants(restaurants, searchContext) {

    restaurantGrid.replaceChildren();

    resultCount.textContent = restaurants.length;

    emptyMessage.hidden = restaurants.length !== 0;
    
    // Show a personalized message if there are no results
if (restaurants.length === 0) {
    emptyMessage.textContent =
        buildNoRestaurantsMessage(searchContext);
}

// Show the dietary information note when relevant
const dietaryNote = document.getElementById(
    "restaurantDietaryNote"
);

if (dietaryNote) {
    dietaryNote.hidden = !restaurants.some(
        restaurant =>
            getRestaurantDietaryLabels(restaurant).length > 0
    );
}

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
        iconElement.className = "bi bi-fork-knife";

        icon.appendChild(iconElement);

        // Restaurant information
        const information = document.createElement("div");
        information.className = "restaurant-card-info";

        const name = document.createElement("h3");
        name.textContent =
            restaurant.name || "Unnamed Restaurant";

        const address = document.createElement("p");
        address.className = "restaurant-card-address";

        address.textContent = formatRestaurantAddress(restaurant);

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


        const formattedHours = formatRestaurantHours(
            restaurant.openingHours
        );

        const firstSchedule = formattedHours[0];

        const hoursSummary = firstSchedule
            ? `${firstSchedule.days}: ${firstSchedule.time}` +
            (formattedHours.length > 1 
                ? ` · +${formattedHours.length - 1} more`
                : "")
            : "Hours unavailable";


        hours.append(
            clock,
            document.createTextNode(` ${hoursSummary}`)
        );

        // display restaurant name 
        information.appendChild(name);

        // show dietary if available
        const dietaryTags = createRestaurantDietaryTags(restaurant);

        if(dietaryTags) {
            information.appendChild(dietaryTags);
        }

        // remaning info
        information.append(
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

    // get selected cuisine
    const selectedCuisine = cuisineInput.value;

    // get selected dietary preferences
    const selectedDiets = Array.from(
        document.querySelectorAll(".diet-options input:checked")
    ).map(input => input.value);

    const unsupportedDiets = selectedDiets.filter(
        diet => !["vegetarian", "vegan", "gluten_free", "organic"].includes(diet)
    );

    if (unsupportedDiets.length > 0) {
        alert("One or more selected dietary preferences are not supported.")
        return;
    }

    if (!/^\d{5}$/.test(zip)) {
        alert("Please enter a valid five-digit ZIP code.");
        return;
    }

    restaurantGrid.textContent = "Searching for restaurants...";
    resultCount.textContent = "0";

    // hide message while a new search 
    emptyMessage.hidden = true;

    const dietaryNote = document.getElementById(
        "restaurantDietaryNote"
    );

    if (dietaryNote) {
        dietaryNote.hidden = true;
    }


    try {
        const restaurants = await fetchRestaurants(
        zip,
        maxDistance,
        selectedDiets,
        selectedCuisine
    );


    selectedRestaurant = null;
    detailsContent.replaceChildren();
    restaurantModalLabel.textContent = "Restaurant Details";

        console.log("Loaded restaurants:", restaurants);

        latestRestaurantResults = restaurants;

        latestRestaurantSearchContext = {
            zip,
            maxDistance,
            selectedDiets,
            selectedCuisine
        };

        const sortedRestaurants = sortRestaurantResults(
            latestRestaurantResults
        );

        renderRestaurants(
            sortedRestaurants,
            latestRestaurantSearchContext
        );

        updateRestaurantMap(sortedRestaurants);



    } catch (error) {
        console.error("Restaurant search failed:", error);

        restaurantGrid.textContent =
            `Unable to load restaurants: ${error.message}`;
    }
}

// Retrieve the signed-in user's saved ZIP code
async function loadUserZipCode() {
    try {
        const response = await fetch(
            `${window.BBO_CONFIG.API_BASE_URL}/auth/profile`,
            {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            }
        );

        // Guest user or expired session
        if (!response.ok) {
            return;
        }

        const result = await response.json();
        const user = result.data?.user;

        const savedZip = user?.defaultZipCode ?? user?.zipcode;

        if (savedZip != null) {
            const zipcode = String(savedZip).padStart(5, "0");

            if (!locationInput.value.trim()) {
                locationInput.value = zipcode;
            }
        }
    } catch (error) {
        console.warn("Unable to retrieve user ZIP code:", error);
    }
}

// Search button
searchBtn.addEventListener("click", searchRestaurants);

restaurantSort.addEventListener("change", () => {

    if (!latestRestaurantSearchContext) {
        return;
    }

    const sortedRestaurants = sortRestaurantResults(
        latestRestaurantResults
    );

    renderRestaurants(
        sortedRestaurants,
        latestRestaurantSearchContext
    );

    updateRestaurantMap(sortedRestaurants);
});

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

    // retrieve ZIP code from user's account
    loadUserZipCode();

    // display instruction before searching restaurants
    const restaurantPlaceholder = document.createElement("p");

    restaurantPlaceholder.className = "restaurant-empty-placeholder";

    restaurantPlaceholder.textContent =
    "Restaurant location will appear here.";

    restaurantGrid.replaceChildren(restaurantPlaceholder);

    // Recalculate Leaflet dimensions after layout
    requestAnimationFrame(() => {
        restaurantMap.invalidateSize();
    });


});
