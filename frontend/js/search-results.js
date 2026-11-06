
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("storeSearch");
  const searchButton = document.getElementById("searchButton");
  const stores = document.querySelectorAll(".grocery-item");
  const resultCount = document.getElementById("resultCount");
  const noResults = document.getElementById("noResults");

  function filterStores() {
    const search = searchInput.value.trim().toLowerCase();
    let count = 0;

    stores.forEach(function (store) {
      const keywords = store.getAttribute("data-search") || "";
      const matches = keywords.toLowerCase().includes(search);

      store.style.display = matches ? "" : "none";

      if (matches) {
        count++;
      }
    });

    resultCount.textContent = count + " grocery store(s) found";

    noResults.classList.toggle("d-none", count > 0);
  }

  searchInput.addEventListener("input", filterStores);
  searchButton.addEventListener("click", filterStores);

  filterStores();
});
