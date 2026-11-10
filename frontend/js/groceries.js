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

        // directions
        if (address !== "Address unavailable") {

            const directions = document.createElement("a");

            const mapsUrl = new URL(
                "https://www.google.com/maps/dir/"
            );

            mapsUrl.searchParams.set("api", "1");

            // automatically populate the destination
            mapsUrl.searchParams.set(
                "destination",
                `${name},${address}`
            );

            // google maps -> based on user location
            directions.href = mapsUrl.toString();
            directions.target = "_blank";
            directions.rel = "noopener noreferrer";

            directions.className = "btn btn-primary";
            directions.textContent = "Get Directions";

            actions.appendChild(directions);
        }

    // website if available
    if(location.website) {

        try {
        const rawwebsite = String(location.website).trim();

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

            details.appendChild(website);
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

     // display grocery cards
     renderGroceryResults(data);

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

    // sync category selection when page loads
    syncCategoryNavigation(groceryCategory.value);
});
