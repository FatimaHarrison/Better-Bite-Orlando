/* shared navigation bar functionality */

(() => {

    // identify where navbar.js is located
    const scriptUrl = document.currentScript.src;

    // field the shared navbar HTML file
    const navbarUrl = new URL(
        "../components/navbar.html",
        scriptUrl
    );

    //load the navigation bar
    async function loadNavbar() {

        const navbarContainer =
            document.getElementById("site-navbar");

        if (!navbarContainer) {
            console.error("Navbar container not found");
            return;
        }

        try {

            // fetch navbar.html
            const response = await fetch(navbarUrl);

            if (!response.ok) {
                throw new Error("Unable to load navbar");
            }

            // read html
            const navbarHtml = await response.text();

            // insert html into the page
            navbarContainer.innerHTML = navbarHtml;

            // profile icon navigation
            const profileLink = navbarContainer.querySelector(".account-link");

            if(profileLink) {

                // default destination for signed out users
                profileLink.href = "login.html";

                profileLink.setAttribute(
                    "aria-label",
                    "Sign In"
                );

                try {
                    const sessionResponse = await fetch(
                        `${window.BBO_CONFIG.API_BASE_URL}/auth/me`,
                        {
                            method: "GET",
                            credentials: "include",
                            cache: "no-store"
                        }
                    );

                    if(sessionResponse.ok) {
                        // user has a valid session
                        profileLink.href = "profile.html";

                        profileLink.setAttribute(
                            "aria-label",
                            "View My Account"
                        );

                    } else {
                        profileLink.setAttribute(
                            "aria-label",
                            "Sign In"
                        );
                    }

                } catch (error) {
                    console.warn("Unable to check login session.")
                }
            }

            //identify current page
            const currentPage =
             window.location.pathname.split("/").pop()
             || "index.html";

            // highlight the current page in the navbar
            const navLinks =
                navbarContainer.querySelectorAll(
                    ".navbar-nav .nav-link"
                );


            navLinks.forEach(link => {

                const linkPage = link.getAttribute("href");

                if (linkPage === currentPage) {

                    link.classList.add("active");

                    link.setAttribute(
                        "aria-current",
                         "page"
                        );
                } else {

                    link.classList.remove("active");
                    link.removeAttribute("aria-current");

                }

            });

        } catch (error) {

            console.error("Error loading navbar:", error);

            navbarContainer.textContent =
            "Navigation could not be loaded";
    }
}

// load when the HTML document is ready
if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
         loadNavbar
    );
} else {

    loadNavbar();
}
})();