/* Shared footer */

const frontendUrl = new URL("../", document.currentScript.src);

const footerUrl = new URL("components/footer.html", frontendUrl);

async function loadFooter() {
  const container = document.getElementById("footer-container");

  if (!container) return; // Exit if the container is not found

  try {
    const response = await fetch(footerUrl);

    if (!response.ok) {
      throw new Error("Unable to load footer");
    }

    container.innerHTML = await response.text();

    const logo = container.querySelector("#footer-logo");

    if (logo) {
      logo.src = new URL(
        "/logos/better-bit-orlando-logo-trn-bg.png",
        frontendUrl,
      ).href;
    }
    // set the home link to the correct index.html path
    const homeLink = container.querySelector("#footer-home-link");

    if (homeLink) {
      homeLink.href = new URL("index.html", frontendUrl).href;
    }

    const footerPages = {
      "footer-about": "pages/about.html",
      "footer-help": "pages/help.html",
      "footer-privacy": "pages/privacy.html",
      "footer-terms": "pages/terms.html",
    };

    Object.entries(footerPages).forEach(([id, path]) => {
      const link = container.querySelector(`#${id}`);

      if (link) {
        link.href = new URL(path, frontendUrl).href;
      }
    });
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadFooter);
