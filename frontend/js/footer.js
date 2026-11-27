/* Shared footer */
/*Cookies section*/

const frontendUrl = new URL("../", document.currentScript.src);

const footerUrl = new URL("components/footer.html", frontendUrl);

/* COOKIE NOTIFICATION */

function initializeCookieBanner() {

    const banner =
        document.getElementById("cookie-banner");

    const dismissButton =
        document.getElementById("cookie-dismiss");

    if (!banner || !dismissButton) {
        return;
    }

    const acknowledged =
        localStorage.getItem("bboCookieNotice");

    if (!acknowledged) {
        banner.classList.add("show");
    }

    dismissButton.addEventListener("click", () => {

        localStorage.setItem(
            "bboCookieNotice",
            "true"
        );

        banner.classList.remove("show");
    });

}
/* LOAD SHARED FOOTER*/
async function loadFooter() {

    const container =
        document.getElementById("footer-container");

    if (!container) return;

    try {

        const response =
            await fetch(footerUrl);

        if (!response.ok) {
            throw new Error("Unable to load footer");
        }

        container.innerHTML =
            await response.text();

        /* Footer Logo */

        const logo =
            container.querySelector("#footer-logo");

        if (logo) {

            logo.src = new URL(
                "logos/better-bit-orlando-logo-trn-bg.png",
                new URL("../", frontendUrl)
            ).href;

        }

        /* Home Link */

        const homeLink =
            container.querySelector(
                "#footer-home-link"
            );

        if (homeLink) {

            homeLink.href =
                new URL(
                    "pages/index.html",
                    frontendUrl
                ).href;

        }

        /* Footer Navigation Links */

        const footerPages = {

            "footer-about":
                "pages/about.html",

            "footer-help":
                "pages/help.html",

            "footer-privacy":
                "pages/privacy.html",

            "footer-terms":
                "pages/terms.html"

        };

        Object.entries(footerPages).forEach(
            ([id, path]) => {

                const link =
                    container.querySelector(
                        `#${id}`
                    );

                if (link) {

                    link.href =
                        new URL(
                            path,
                            frontendUrl
                        ).href;

                }

            }
        );

        /* Cookie Banner Privacy Link */

        const cookiePrivacyLink =
            container.querySelector(
                "#cookie-privacy-link"
            );

        if (cookiePrivacyLink) {

            cookiePrivacyLink.href =
                new URL(
                    "pages/privacy.html",
                    frontendUrl
                ).href;

        }

        /* Initialize Cookie Banner */

        initializeCookieBanner();

    }

    catch (error) {

        console.error(
            "Error loading footer:",
            error
        );

    }

}
/* PAGE LOAD*/

document.addEventListener(
    "DOMContentLoaded",
    loadFooter
);
