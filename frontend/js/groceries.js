/* Better Bite Orlando | Groceries */ 

// backend API
const GROCERY_API_URL = 
    "https://api-dev.betterbiteorlando.com/places/groceries";

// DOM Elements 
const groceryForm = document.getElementById("grocery-search-form");
const groceryZip = document.getElementById("grocery-zip");
const groceryCategory = document.getElementById("grocery-category");
const groceryResults = document.getElementById("grocery-results-list");
const groceryResultsCount = document.getElementById("results-count");

// Grocery details modal
const groceryModalElement = document.getElementById("groceryDetailsModal");
const groceryDetailsContent = document.getElementById("grocery-details-content");
const groceryModalTitle = document.getElementById("groceryDetailsModalLabel");

// category navigation buttons
const categoryButtons = document.querySelectorAll(
    ".category-navigation .category-btn"
);

// Sorting dropdown
const grocerySort = document.getElementById("grocer-sort");

// store the latest result from the API
let groceryLocations = [];

// grocery map
let groceryMap = null;
let groceryMarkers = null;
let locationMarkers = new Map();

// Google maps transportation direction
function getGoogleMapsDirectionsUrl(location, mode = "drivering") {

    const mapsUrl = new URL(
       "https://www.google.com/maps/dir/"
    );

    mapsUrl.searchParams.set("api", "1");

    // coordinates when available
    const lat = Number(location.latitude);
    const lon = Number(location.longitude);

    const hasCoordinates =
        location.latitude != null &&
        location.longitude != null &&
        Number.isFinite(lat) &&
        Number.isFinite(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180 ;

    const destination = hasCoordinates
        ? `${lat},${lon}`
        : `${location.name || ""},${location.address || ""}`;

        mapsUrl.searchParams.set("destination", destination);

        mapsUrl.searchParams.set("travelmode", mode);

        return mapsUrl.toString();
}


// Convert the selected category into backend API values
function getGroceryTypes(category) {
    if (category === "all") {
        return "groceries,farmers-markets,food-pantries";
    }

    return category;
}


// sync category button with dropdown
function syncCategoryNavigation(category) {

    categoryButtons.forEach((button) => {
        
        const isActive = button.dataset.category === category;

        button.classList.toggle("active", isActive);

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );

    });

}

// display selected grocery details
function showGroceryDetails(location) {

    // focus the selected grocery on map
    const selectedMarker = locationMarkers.get(location);

    if(selectedMarker && groceryMap) {
        groceryMap.setView(
            selectedMarker.getLatLng(),
            15
        );

        selectedMarker.openPopup();
    }

    const name = location.name || "Unnamed Location";
    const address = location.address || "Address unavailable";

    const distance =
        location.distanceMiles != null &&
        Number.isFinite(Number(location.distanceMiles))
            ? `${Number(location.distanceMiles).toFixed(1)} miles away`
            : "Distance unavailable";

        const hours = location.openingHours || "Hours unavailable";

        // category information 
        const categories ={
            grocery: "Grocery Store", 
            "farmers-market": "Farmers Market",
            "food-pantry": "Food Pantry"
        };

        const category = categories[location.type] || "Food Resource";

        // update modal title 
        groceryModalTitle.textContent = name;

        // clear previous grocery information
        groceryDetailsContent.replaceChildren();

        // store information container 
        const details = document.createElement("div");
        details.className = "grocery-modal-details";

        //image placeholder
        const image = document.createElement("div");
        image.className = "grocery-modal-image";

        const imageIcon = document.createElement("i");
        imageIcon.className = "bi bi-shop";

        image.appendChild(imageIcon);

        //heading 
        const heading = document.createElement("div");
        heading.className = "grocery-modal-heading";

        const title = document.createElement("h3");
        title.textContent = name;

        const badge = document.createElement("span");
        badge.className = "grocery-modal-badge";
        badge.textContent = category;

        heading.append(title, badge);
             
         // Address
        const addressSection = document.createElement("div");
        addressSection.className = "grocery-modal-address"

        const addressIcon = document.createElement("i");
        addressIcon.className = "bi bi-geo-alt"

        const addressText = document.createElement("p");
        addressText.textContent = address;

        addressSection.append(addressIcon, addressText);

        // Distance
        const distanceText = document.createElement("p");
        distanceText.className = "grocery-modal-distance"
        distanceText.textContent = `Distance: ${distance}`;

        // Opening hours
        const hoursSection = document.createElement("div");
        hoursSection.className = "grocery-modal-hours";

        const hoursTitle = document.createElement("h4");
        hoursTitle.textContent = "Store Hours";


        const hoursText = document.createElement("p");
        hoursText.textContent = `🕒 ${hours}`;

        hoursSection.append(hoursTitle, hoursText);

        // action buttons
        const actions = document.createElement("div");
        actions.className = "grocery-modal-actions";

    // directions google maps transporation options
    const hasValidAddress = address !== "Address unavailable";

    const hasValidCoordinates =
    location.latitude != null &&
    location.longitude != null &&
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude)) &&
    Number(location.latitude) >= -90 &&
    Number(location.latitude) <= 90 &&
    Number(location.longitude) >= -180 &&
    Number(location.longitude) <= 180;

if (hasValidAddress || hasValidCoordinates) {

    const directionsContainer = document.createElement("div");
    directionsContainer.className = "grocery-directions-container";

    const directionsTitle = document.createElement("h4");
    directionsTitle.textContent = "Get Directions";

    const directionsButtons = document.createElement("div");
    directionsButtons.className = "grocery-directions-buttons";

    const transportationModes = [
        {
            label: "Drive",
            mode: "driving",
            icon: "bi-car-front"
        },
        {
            label: "Bus",
            mode: "transit",
            icon: "bi-bus-front"
        },
        {
            label: "Walk",
            mode: "walking",
            icon: "bi-person-walking"
        }
    ];

    transportationModes.forEach((transport) => {

        const link = document.createElement("a");

        link.href = getGoogleMapsDirectionsUrl(
            location,
            transport.mode
        );

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.className = "btn btn-outline-success";

        const icon = document.createElement("i");
        icon.className = `bi ${transport.icon} me-2`;

        link.append(
            icon,
            document.createTextNode(transport.label)
        );

        directionsButtons.appendChild(link);
    });

    directionsContainer.append(
        directionsTitle,
        directionsButtons
    );

    actions.appendChild(directionsContainer);
}




    // website if available
    if(location.website) {

        try {
        const rawWebsite = String(location.website).trim();

        // add https if the web has not protocol
        const websiteUrl = /^https?:\/\//i.test(rawWebsite)
            ? rawWebsite
            : `https://${rawWebsite}`;

        const url = new URL(websiteUrl);

        // only allow sage webs 
        if(["https:","http:"].includes(url.protocol)) {

            const website = document.createElement("a");

            website.href = url.href;
            website.target = "_blank";
            website.rel = "noopener noreferrer";

            website.className = "btn btn-outline-primary";
            website.textContent = "Visit Website";

            actions.appendChild(website);
        }
    } catch (error) {
        console.warn("Invalid grocery website URL:", error);
    }
}
        details.append(
        image,
        heading,
        addressSection,
        distanceText,
        hoursSection,
        actions
    ); 

    groceryDetailsContent.appendChild(details);

    //open bootstrap modal
    const modal = bootstrap.Modal.getOrCreateInstance(
        groceryModalElement
    );

    modal.show();
}

// sort grocery locations by distance or name 
function sortGroceryResults(locations) {

    const sortedLocations = [...locations];

    if (grocerySort.value === "name") {

        sortedLocations.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
    );

    } else {

        sortedLocations.sort((a, b) => {

            const distanceA =
            a.distanceMiles != null &&
            a.distanceMiles !== "" &&
            Number.isFinite(Number(a.distanceMiles))
                ? Number(a.distanceMiles)
                : Infinity;

        const distanceB =
            b.distanceMiles != null &&
            b.distanceMiles !== "" &&
            Number.isFinite(Number(b.distanceMiles))
                ? Number(b.distanceMiles)
                : Infinity;
        
        return distanceA - distanceB;
        });
    }

    return sortedLocations;
}


// initialize leaflet map
function initializeGroceryMap() {
    
    //defacult location: Orlando, FL
    groceryMap =L.map("grocery-map").setView(
        [28.5383, -81.3792],
        11
    );

    //open Street Map
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
    ).addTo(groceryMap);

    // layer for grocery markets 
    groceryMarkers = L.featureGroup().addTo(groceryMap);
}


// Display grocery locations on the map
function updateGroceryMap(locations) {

    if (!groceryMap || !groceryMarkers) {
        return;
    }

    // Clear previous markers
    groceryMarkers.clearLayers();
    locationMarkers.clear();

    locations.forEach((location) => {

        const lat = Number(location.latitude);
        const lon = Number(location.longitude);

        // Skip invalid coordinates
        if (
            location.latitude == null ||
            location.longitude == null ||
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            lat < -90 || lat > 90 ||
            lon < -180 || lon > 180
        ) {
            return;
        }

        // Create marker
        const marker = L.marker([lat, lon]);

        // Create popup
        const popup = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent =
            location.name || "Unnamed Location";

        const address = document.createElement("p");
        address.textContent =
            location.address || "Address unavailable";

        address.style.margin = "5px 0 0";

// Transportation options inside map popup
const directionsContainer = document.createElement("div");

directionsContainer.className = "grocery-map-directions";

const hasDestination =
    location.latitude != null &&
    location.longitude != null &&
    Number.isFinite(Number(location.latitude)) &&
    Number.isFinite(Number(location.longitude)) &&
    Number(location.latitude) >= -90 &&
    Number(location.latitude) <= 90 &&
    Number(location.longitude) >= -180 &&
    Number(location.longitude) <= 180;

if (hasDestination) {

    const transportationModes = [
        { label: "Drive", mode: "driving", icon: "bi-car-front" },
        { label: "Bus", mode: "transit", icon: "bi-bus-front" },
        { label: "Walk", mode: "walking", icon: "bi-person-walking" }
    ];

    transportationModes.forEach((transport) => {

        const link = document.createElement("a");

        link.href = getGoogleMapsDirectionsUrl(
            location,
            transport.mode
        );

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        link.className = "grocery-map-direction-link";

        const icon = document.createElement("i");
        icon.className = `bi ${transport.icon}`;

        link.append(
            icon,
            document.createTextNode(` ${transport.label}`)
        );

        directionsContainer.appendChild(link);
    });
}

popup.append(
    name,
    address,
    directionsContainer
);

        marker.bindPopup(popup);

        // Add marker to map
        marker.addTo(groceryMarkers);

        // Save marker for card interaction
        locationMarkers.set(location, marker);
    });

    // Zoom to display the grocery locations
    if (groceryMarkers.getLayers().length > 0) {

        groceryMap.fitBounds(
            groceryMarkers.getBounds(),
            {
                padding: [30, 30],
                maxZoom: 14
            }
        );
    }

    groceryMap.invalidateSize();
}


// Generate grocery Cards from API results
function renderGroceryResults(locations) {

    groceryResults.replaceChildren();

    locations.forEach((location) => {

        //create card
        const card = document.createElement("button");
        card.type = "button";
        card.className = "grocery-result-card";

        // store information
        const name = location.name || "Unnamed Location";
        const address = location.address || "Address unavailable";

        const distance = 
            location.distanceMiles != null &&
            location.distanceMiles !== "" &&
            Number.isFinite(Number(location.distanceMiles))
            && location.distanceMiles !== null
                ? `${Number(location.distanceMiles).toFixed(1)} miles away`
                : "Distance unavailable";

        const hours = location.openingHours || "Hours unavailable";

        // create card content
        const content = document.createElement("div");
        content.className = "grocery-card-content";

        const icon = document.createElement("div");
        icon.className = "grocery-card-icon";

        const iconElement = document.createElement("i");
        iconElement.className = "bi bi-shop";

        icon.appendChild(iconElement);

        const information = document.createElement("div");
        information.className = "grocery-card-info";

        const title = document.createElement("h3");
        title.textContent = name;

        const distanceText = document.createElement("p");
        distanceText.className = "grocery-card-distance";
        distanceText.textContent = distance;

        const addressText = document.createElement("p");
        addressText.className = "grocery-card-address";
        addressText.textContent = address;

        const hoursText = document.createElement("p");
        hoursText.className = "grocery-card-hours";

        const clockIcon = document.createElement("i");
        clockIcon.className = "bi bi-clock me-1";

        hoursText.append(clockIcon, document.createTextNode(hours));

        information.append(
            title,
            distanceText,
            addressText,
            hoursText
        );

        const arrow = document.createElement("i");
        arrow.className = "bi bi-chevron-right grocery-card-arrow";

        content.append(icon, information, arrow);
        card.appendChild(content);

        //Details modal functionaloty will be added next
        card.addEventListener("click", () => {
            showGroceryDetails(location);
        });

        // card to the results 
        groceryResults.appendChild(card);

    });
            
}

// retrieve the signed in user's ZIP code
async function loadUserZipCode() {

    try {
        const response = await fetch(
        "http://127.0.0.1:3001/auth/me",
        {
            method: "GET",
            credentials: "include",
            cache: "no-store"
        }
    );

    // guest user or expired session
    if (!response.ok) {
        return;
    }

    const result = await response.json();
    const user = result.data?.user;

    //Populate the ZIP code if available
    if (user?.zipcode !=null ) {

        const zipcode = String(user.zipcde).padStart(5,"0");

        if (!groceryZip.value.trim()) {
            groceryZip.value = zipcode;
        }
    }

    } catch (error) {
        console.warm("Unable to retrieve user ZIP code:", error);
    }
}


// search for groceries using backend api
async function searchGroceries(event) {
    event.preventDefault();

    const zip = groceryZip.value.trim();
    const category = groceryCategory.value;
    const types = getGroceryTypes(category);

    syncCategoryNavigation(category);

    const params = new URLSearchParams({
        location: zip,
        types: types,
        maxDistance: "10"
    });

    groceryResults.textContent ="Searching for grocery locations...";
    groceryResultsCount.textContent = "0";

    //clear previous map markers before searching
    if(groceryMarkers) {
        groceryMarkers.clearLayers();
        locationMarkers.clear();
    }

    try {
        const response = await fetch(
            `${GROCERY_API_URL}?${params}`
        );

        const data = await response.json();

        if(!response.ok) {
            throw new Error(
                data.error || "Unable to retrieve grocery locations."
            );
        }

        if (!Array.isArray(data)) {
            throw new Error("Unexpected API response format.")
        }

        console.log("Grocery API results:", data);

        groceryResultsCount.textContent = data.length;

        if(data.length === 0) {
            groceryResults.textContent = "No grocery location were found. Try another ZIP code.";
        return;
        }


    // save the latest API results
    groceryLocations = data;
    

     // display grocery cards
     renderGroceryResults(
        sortGroceryResults(groceryLocations)
     );

     //update map markers with latest search results
     updateGroceryMap(groceryLocations);

    } catch (error) {
        console.error("Grocery search failed:", error);

        groceryResults.textContent =
            `Unable to load location: ${error.message}`;
    }
}

// Initialize search form
document.addEventListener("DOMContentLoaded", () => {

   // serach form
    groceryForm.addEventListener("submit", searchGroceries);

     //initialzie interactive map
    initializeGroceryMap();

    // retrieve user zip code if available
    loadUserZipCode();

    // dropdown category selection
    groceryCategory.addEventListener("change", () => {

        const selectedCategory = groceryCategory.value;

        syncCategoryNavigation(selectedCategory);
    });

    // category navigation buttons
    categoryButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const selectedCategory = button.dataset.category;

            //update dropdown
            groceryCategory.value = selectedCategory;

            //update active navigation button
            syncCategoryNavigation(selectedCategory);

            //automatically search using selected category
            groceryForm.requestSubmit();

        });
    });

    // update sorting without requesting the API again 
    grocerySort.addEventListener("change", () => {

        if(groceryLocations.length === 0) {
            return;
        }

        renderGroceryResults(
            sortGroceryResults(groceryLocations)
        );
    });

    // sync category selection when page loads
    syncCategoryNavigation(groceryCategory.value);


});
