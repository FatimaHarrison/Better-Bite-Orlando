
/* =====================================
   FILTER AND FAVORITE FUNCTIONALITY
===================================== */


// =====================================
// FILTER FAVORITE CARDS
// =====================================

const filterButtons = document.querySelectorAll(".filter-btn");

const favoriteCards = document.querySelectorAll(".favorite-card");

const emptyMessage = document.querySelector(".empty-message");


// Filter buttons

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        // Update active filter button

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

            btn.setAttribute("aria-pressed", "false");

        });

        button.classList.add("active");

        button.setAttribute("aria-pressed", "true");


        // Filter favorite cards

        let visibleCount = 0;

        favoriteCards.forEach(card => {

            const category = card.dataset.category;

            const showCard =
                filter === "all" || category === filter;

            card.hidden = !showCard;

            if (showCard) {
                visibleCount++;
            }

        });


        // Show empty message if no favorites match

        if (emptyMessage) {

            emptyMessage.hidden = visibleCount !== 0;

        }

    });

});



// =====================================
// TOGGLE FAVORITE HEARTS
// =====================================

const favoriteButtons = document.querySelectorAll(".favorite-heart");

favoriteButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Toggle heart appearance

        const isActive = button.classList.toggle("active");


        // Update accessibility state

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );


        // Get favorite card title

        const card = button.closest(".favorite-card");

        if (!card) return;

        const cardTitle = card.querySelector("h2")?.textContent.trim()
            || "this item";


        // Update accessible button label

        button.setAttribute(
            "aria-label",
            isActive
                ? `Remove ${cardTitle} from favorites`
                : `Add ${cardTitle} to favorites`
        );

    });

});
