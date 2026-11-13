/* Better Bite Orlando recipes: vanilla JS, API-driven; no mock recipe records. */
(() => {
  "use strict";
  const base = (window.BBO_CONFIG?.API_BASE_URL || "").replace(/\/$/, "");
  const $ = (id) => document.getElementById(id);
  const state = {
    recipes: [],
    time: null,
    diets: new Set(),
    query: "",
    sort: "relevance",
    selected: null,
    tab: "overview",
    limit: 12,
  };
  const fallbackImage = "../images/recipes.png";
  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const text = (value) =>
    String(value ?? "")
      .replace(/<[^>]*>/g, "")
      .trim();
  const number = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  };
  const safeUrl = (value) => {
    try {
      const u = new URL(value, window.location.href);
      return ["http:", "https:"].includes(u.protocol) ? u.href : "";
    } catch {
      return "";
    }
  };
  const list = (value) => (Array.isArray(value) ? value : []);
  const recipeId = (r) => r.id ?? r.recipeId ?? r.spoonacularId;
  const minutes = (r) =>
    number(r.readyInMinutes ?? r.totalTime ?? r.cookingTime ?? r.time);
  const servings = (r) => number(r.servings ?? r.numberOfServings);
  const calories = (r) => {
    const nutrients = list(r.nutrition?.nutrients);
    return number(
      r.calories ??
        r.nutrition?.calories ??
        nutrients.find((n) => /calories/i.test(n.name))?.amount,
    );
  };
  const imageUrl = (r) =>
    safeUrl(r.image ?? r.imageUrl ?? r.thumbnail) || fallbackImage;
  const title = (r) => text(r.title ?? r.name ?? "Untitled recipe");
  // Use normalized backend fields. Never label an unverified diet as confirmed.
  // The backend currently defines high protein as >=30g and low carb as <=20g per serving.
  const tags = (r) => {
    const items = [...list(r.diets), ...list(r.tags)];
    const dietary = r.dietary ?? {};
    const nutrition = r.nutrition ?? {};
    const flag = (key) => dietary[key] === true || r[key] === true;
    if (flag("vegetarian")) items.push("Vegetarian");
    if (flag("vegan")) items.push("Vegan");
    if (flag("glutenFree")) items.push("Gluten-Free");
    if (flag("dairyFree")) items.push("Dairy-Free");
    if (flag("ketogenic")) items.push("Ketogenic");

    const nutrients = list(nutrition.nutrients);
    const nutrient = (field, name) => {
      const raw =
        nutrition[field] ??
        r[field] ??
        nutrients.find((n) => n.name?.toLowerCase() === name)?.amount;
      return raw === null || raw === undefined || raw === ""
        ? null
        : number(raw);
    };
    const protein = nutrient("protein", "protein");
    const carbs = nutrient("carbs", "carbohydrates");
    const fiber = nutrient("fiber", "fiber");
    if (flag("highProtein") || (protein !== null && protein >= 30))
      items.push("High Protein");
    if (flag("lowCarb") || (carbs !== null && carbs <= 20))
      items.push("Low Carb");
    // Optional convention for our app; only used when fiber is actually supplied.
    if (flag("highFiber") || (fiber !== null && fiber >= 5))
      items.push("High Fiber");
    const unique = new Set();
    return items
      .map((x) => text(typeof x === "string" ? x : x?.name))
      .filter((x) => {
        const key = x.toLowerCase().replace(/[ _-]/g, "");
        if (!key || unique.has(key)) return false;
        unique.add(key);
        return true;
      });
  };
  function normalizePayload(payload) {
    const data = payload?.data ?? payload;
    const arr = Array.isArray(data)
      ? data
      : (data?.results ?? data?.recipes ?? data?.items ?? data?.data);
    if (!Array.isArray(arr))
      throw new Error(
        "The recipes API returned an unexpected response format.",
      );
    return arr;
  }
  async function apiGet(path, params) {
    if (!base) throw new Error("API_BASE_URL is not configured.");
    const url = new URL(`${base}${path}`);
    Object.entries(params || {}).forEach(([key, val]) => {
      if (val !== "" && val != null) url.searchParams.set(key, val);
    });
    const res = await fetch(url, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Recipe service returned HTTP ${res.status}.`);
    return res.json();
  }
  async function fetchRecipes() {
    // Backend convention: GET /recipes. Some deployments expose GET /recipes/search.
    // A 404 is the only reason to try the alternate route; other failures are surfaced.
    try {
      return normalizePayload(await apiGet("/recipes", { number: 100 }));
    } catch (err) {
      if (!/HTTP 404/.test(err.message)) throw err;
      return normalizePayload(await apiGet("/recipes/search", { number: 100 }));
    }
  }
  function matches(r) {
    const m = minutes(r);
    if (
      state.time !== null &&
      (m === null || (state.time === 60 ? m < 60 : m > state.time))
    )
      return false;
    const t = tags(r).map((x) => x.toLowerCase().replace(/[-_]/g, " "));
    if (![...state.diets].every((d) => t.some((x) => x === d || x.includes(d))))
      return false;
    const haystack = [
      title(r),
      ...tags(r),
      ...list(r.extendedIngredients).map((i) => i.name),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(state.query);
  }
  function displayRecipes() {
    const filtered = state.recipes.filter(matches);
    if (state.sort === "time")
      filtered.sort(
        (a, b) => (minutes(a) ?? Infinity) - (minutes(b) ?? Infinity),
      );
    if (state.sort === "title")
      filtered.sort((a, b) => title(a).localeCompare(title(b)));
    $("result-count").textContent = String(filtered.length);
    $("recipes-grid").innerHTML = filtered
      .slice(0, state.limit)
      .map(
        (r, index) => `
      <article class="recipe-card">
        <img src="${escapeHtml(imageUrl(r))}" alt="${escapeHtml(title(r))}" loading="lazy" onerror="this.onerror=null;this.src='../images/recipes.png'">
        <div class="recipe-card-body"><h3>${escapeHtml(title(r))}</h3>
          <div class="recipe-card-meta">${minutes(r) !== null ? `<span><i class="bi bi-clock"></i>${minutes(r)} min</span>` : ""}${servings(r) !== null ? `<span><i class="bi bi-people-fill"></i>${servings(r)} servings</span>` : ""}${calories(r) !== null ? `<span><i class="bi bi-fire"></i>${Math.round(calories(r))} cal</span>` : ""}</div>
          <div class="recipe-card-bottom">${tags(r)
            .map((tag) => `<span class="recipe-tag">${escapeHtml(tag)}</span>`)
            .join(
              "",
            )}<button class="recipe-view" data-recipe-index="${index}" type="button">View Details <i class="bi bi-arrow-right"></i></button></div>
        </div>
      </article>`,
      )
      .join("");
    $("load-more").hidden = filtered.length <= state.limit;
    if (!state.recipes.length) return;
    $("recipes-status").textContent = filtered.length
      ? ""
      : "No recipes match your filters. Try clearing one or more filters.";
    $("recipes-grid")
      .querySelectorAll("[data-recipe-index]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          selectRecipe(filtered[Number(btn.dataset.recipeIndex)]),
        ),
      );
  }
  async function selectRecipe(recipe) {
    state.selected = recipe;
    state.tab = "overview";
    $("recipe-details").hidden = false;
    document.querySelector(".recipes-workspace").classList.add("has-selection");
    renderDetail();
    const id = recipeId(recipe);
    if (id == null) return;
    try {
      const response = await apiGet(`/recipes/${encodeURIComponent(id)}`);
      const detail = response?.data ?? response?.recipe ?? response;
      if (
        detail &&
        typeof detail === "object" &&
        !Array.isArray(detail) &&
        recipeId(state.selected) === id
      ) {
        state.selected = { ...recipe, ...detail };
        renderDetail();
      }
    } catch (err) {
      console.warn(
        "Recipe details unavailable; displaying search result details.",
        err,
      );
    }
  }
  function nutritionRows(r) {
    const nutrition = r.nutrition ?? {};
    const nutrients = list(nutrition.nutrients);
    const rows = nutrients.length
      ? nutrients.map((n) => [n.name, `${n.amount ?? "—"} ${n.unit ?? ""}`])
      : [
          [
            "Calories",
            calories(r) !== null ? `${Math.round(calories(r))} kcal` : null,
          ],
          ["Protein", nutrition.protein ?? r.protein],
          [
            "Carbohydrates",
            nutrition.carbs ??
              nutrition.carbohydrates ??
              r.carbs ??
              r.carbohydrates,
          ],
          ["Fat", nutrition.fat ?? r.fat],
          ["Fiber", nutrition.fiber ?? r.fiber],
          ["Sugar", nutrition.sugar ?? r.sugar],
        ]
          .filter((row) => row[1] != null)
          .map(([name, value]) => [
            name,
            typeof value === "number" && name !== "Calories"
              ? `${value} g`
              : value,
          ]);
    return rows.length
      ? `<table class="nutrition-table"><tbody>${rows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join("")}</tbody></table>`
      : "<p>Nutrition information is not available for this recipe.</p>";
  }
  // Normalized backend instructions are [{number, step}]; Spoonacular can also
  // return analyzedInstructions [{steps:[...]}] or an HTML instructions string.
  function instructionSteps(r) {
    const raw = r.instructions;
    if (Array.isArray(raw)) {
      const flattened = raw.flatMap((item) =>
        Array.isArray(item?.steps) ? item.steps : [item],
      );
      return flattened
        .map((item) =>
          typeof item === "string"
            ? item
            : (item?.step ?? item?.text ?? item?.instruction),
        )
        .map((step) => text(step))
        .filter(Boolean);
    }
    const analyzed = list(r.analyzedInstructions).flatMap((group) =>
      list(group.steps),
    );
    if (analyzed.length)
      return analyzed
        .map((step) => text(step?.step ?? step?.text))
        .filter(Boolean);
    return typeof raw === "string" && text(raw) ? [text(raw)] : [];
  }
  function ingredientItems(r) {
    const raw = [
      r.extendedIngredients,
      r.ingredients,
      r.ingredientList,
      r.recipeIngredients,
    ].find((value) => Array.isArray(value) && value.length);
    return list(raw)
      .map((item) => {
        if (typeof item === "string") return text(item);
        if (!item || typeof item !== "object") return "";
        if (typeof item.original === "string") return text(item.original);
        if (typeof item.originalString === "string")
          return text(item.originalString);
        if (typeof item.description === "string") return text(item.description);
        const measure = item.measures?.us;
        return [
          item.amount ?? measure?.amount,
          item.unit ?? measure?.unitShort,
          item.name ?? item.nameClean ?? item.ingredient?.name,
        ]
          .filter((v) => v != null && v !== "")
          .join(" ")
          .trim();
      })
      .filter(Boolean);
  }
  function renderDetail() {
    const r = state.selected;
    if (!r) return;
    $("detail-image").src = imageUrl(r);
    $("detail-image").alt = title(r);
    $("detail-image").onerror = () => {
      $("detail-image").onerror = null;
      $("detail-image").src = fallbackImage;
    };
    $("detail-title").textContent = title(r);
    $("detail-meta").innerHTML = [
      minutes(r) != null
        ? `<span><i class="bi bi-clock"></i>${minutes(r)} min</span>`
        : "",
      servings(r) != null
        ? `<span><i class="bi bi-people-fill"></i>${servings(r)} servings</span>`
        : "",
      calories(r) != null
        ? `<span><i class="bi bi-fire"></i>${Math.round(calories(r))} cal</span>`
        : "",
    ].join("");
    $("detail-tags").innerHTML = tags(r)
      .map((tag) => `<span class="recipe-tag">${escapeHtml(tag)}</span>`)
      .join("");
    document.querySelectorAll(".detail-tabs button").forEach((btn) => {
      const active = btn.dataset.tab === state.tab;
      btn.setAttribute("aria-selected", String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    const ingredients = ingredientItems(r);
    const steps = instructionSteps(r);
    const instructions = steps.length
      ? `<h3>Instructions</h3><ol>${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`
      : "<p>Instructions are not available for this recipe.</p>";
    const overview = `<p>${escapeHtml(text(r.summary ?? r.description ?? "Explore the ingredients and nutrition details for this recipe."))}</p>${instructions}`;
    const ingredientHtml = ingredients.length
      ? `<ul>${ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
      : "<p>Ingredients are not available in the API response for this recipe.</p>";
    $("detail-panel").innerHTML =
      state.tab === "overview"
        ? overview
        : state.tab === "ingredients"
          ? ingredientHtml
          : nutritionRows(r);
    $("detail-panel").setAttribute("aria-labelledby", `tab-${state.tab}`);
    const url = safeUrl(r.sourceUrl ?? r.spoonacularSourceUrl ?? r.url);
    $("recipe-source").hidden = !url;
    if (url) $("recipe-source").href = url;
    const saved = isSaved(r);
    $("save-recipe").innerHTML =
      `<i class="bi bi-heart${saved ? "-fill" : ""}" aria-hidden="true"></i> ${saved ? "Saved Recipe" : "Save Recipe"}`;
    $("save-recipe").setAttribute("aria-pressed", String(saved));
    $("save-status").textContent = "";
  }
  // Local-only favorites until a documented authenticated recipe-favorites API is available.
  const favoritesKey = "bbo-saved-recipes";
  function readFavorites() {
    try {
      const a = JSON.parse(localStorage.getItem(favoritesKey) || "[]");
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }
  const savedKey = (r) => String(recipeId(r) ?? title(r));
  const isSaved = (r) => readFavorites().some((x) => x.key === savedKey(r));
  function toggleSaved() {
    const r = state.selected;
    if (!r) return;
    const items = readFavorites(),
      key = savedKey(r);
    const existing = items.findIndex((x) => x.key === key);
    if (existing >= 0) items.splice(existing, 1);
    else
      items.push({
        key,
        id: recipeId(r) ?? null,
        title: title(r),
        image: imageUrl(r),
      });
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(items));
      renderDetail();
      $("save-status").textContent =
        existing >= 0
          ? "Removed from this browser’s saved recipes."
          : "Saved in this browser only (not synced to your account).";
    } catch {
      $("save-status").textContent =
        "Unable to save this recipe in this browser.";
    }
  }
  function bind() {
    document.querySelectorAll("[data-time]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const n = Number(btn.dataset.time);
        state.time = state.time === n ? null : n;
        document
          .querySelectorAll("[data-time]")
          .forEach((b) =>
            b.setAttribute(
              "aria-pressed",
              String(Number(b.dataset.time) === state.time),
            ),
          );
        state.limit = 12;
        displayRecipes();
      }),
    );
    document.querySelectorAll("[data-diet]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const d = btn.dataset.diet;
        state.diets.has(d) ? state.diets.delete(d) : state.diets.add(d);
        btn.setAttribute("aria-pressed", String(state.diets.has(d)));
        state.limit = 12;
        displayRecipes();
      }),
    );
    $("clear-filters").addEventListener("click", () => {
      state.time = null;
      state.diets.clear();
      state.query = "";
      $("recipe-search").value = "";
      document
        .querySelectorAll("[data-time],[data-diet]")
        .forEach((b) => b.setAttribute("aria-pressed", "false"));
      state.limit = 12;
      displayRecipes();
    });
    $("recipe-search").addEventListener("input", (e) => {
      state.query = e.target.value.trim().toLowerCase();
      state.limit = 12;
      displayRecipes();
    });
    $("recipe-sort").addEventListener("change", (e) => {
      state.sort = e.target.value;
      displayRecipes();
    });
    $("load-more").addEventListener("click", () => {
      state.limit += 12;
      displayRecipes();
    });
    $("detail-close").addEventListener("click", () => {
      $("recipe-details").hidden = true;
      document
        .querySelector(".recipes-workspace")
        .classList.remove("has-selection");
      state.selected = null;
    });
    document.querySelectorAll(".detail-tabs button").forEach((btn) =>
      btn.addEventListener("click", () => {
        state.tab = btn.dataset.tab;
        renderDetail();
      }),
    );
    $("save-recipe").addEventListener("click", toggleSaved);
  }
  async function init() {
    bind();
    try {
      state.recipes = await fetchRecipes();
      $("recipes-status").textContent = state.recipes.length
        ? ""
        : "No recipes were returned by the API.";
      displayRecipes();
    } catch (err) {
      console.error("Recipes API error:", err);
      $("recipes-status").textContent =
        `Unable to load recipes: ${err.message} Please try again later.`;
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
