/* Better Bite Orlando | My Account */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // retrieve the authenticated user
    const response = await fetch(
      `${window.BBO_CONFIG.API_BASE_URL}/auth/profile`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    // redirect user without a valid session
    if (response.status === 401) {
      window.location.replace("login.html");
      return;
    }

    if (!response.ok) {
      throw new Error("Unable to load profile.");
    }

    const result = await response.json();
    const user = result.data?.user;



    if (!user) {
      throw new Error("User information unavailable.");
    }

    // Populate profile fields
    document.getElementById("profile-first-name").value =
      user.firstName ?? "";

    document.getElementById("profile-last-name").value =
      user.lastName ?? "";

    document.getElementById("profile-email").value =
      user.email ?? "";

    document.getElementById("profile-zip").value =
      user.zipcode != null
        ? String(user.zipcode).padStart(5, "0")
        : "";

    const dietaryPreferences = user.dietaryPreferences ?? {};

    const preferenceMap = {
      "vegetarian": "vegetarian",
      "vegan": "vegan",
      "gluten-free": "glutenFree",
      "organic": "organic",

      // recipe preferences
      "low-carb": "lowCarb",
      "high-protein": "highProtein",
    };


    // DEF-013 loading saved notification preferences 
    const notifications = user.notificationPreferences;

    if (notifications) {

      const notificationFields = {
        "notif-email": "emailNotifications",
        "notif-recipes": "recipeRecommendations",
        "notif-events": "localFoodEvents",
        "notif-resources": "newResources",
      };

      for (const [checkboxId, preferenceKey] of Object.entries(notificationFields)) {

        const checkbox = document.getElementById(checkboxId);

        if (
          checkbox &&
          typeof notifications[preferenceKey] === "boolean"
        ) {
          checkbox.checked = notifications[preferenceKey];
        }

      }
    }


    document.querySelectorAll(`input[name="diet"]`).forEach((checkbox) => {

      const preferenceKey = preferenceMap[checkbox.value];

      checkbox.checked = 
          dietaryPreferences[preferenceKey] === true;

    });

  } catch (error) {
    console.error("Profile loading failed:", error);

    alert("Unable to load your profile. Please try again.");
  }

// Save functionality

const profileForm = document.getElementById("profile-form");
const profileSaveBtn = document.getElementById("profile-save-btn");
const profileSaveStatus = document.getElementById("profile-save-status");

// listen profile sub.
profileForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const firstName = document
    .getElementById("profile-first-name")
    .value.trim();

  const lastName = document
  .getElementById("profile-last-name")
  .value.trim();

  const zipcode = document
  .getElementById("profile-zip")
  .value.trim();
  

  const selectedDiets = new Set(
    [...document.querySelectorAll(`input[name="diet"]:checked`)]
    .map((checkbox) => checkbox.value)
  );

  const dietaryPreferences = {
    vegetarian: selectedDiets.has("vegetarian"),
    vegan: selectedDiets.has("vegan"),
    glutenFree: selectedDiets.has("gluten-free"),
    organic: selectedDiets.has("organic"), 

    //recipe 
    lowCarb: selectedDiets.has("low-carb"),
    highProtein: selectedDiets.has("high-protein"),
  };


  if(
    !firstName ||
    !lastName ||
    firstName.length > 50 ||
    lastName.length > 50 ||
    !/^\d{5}$/.test(zipcode)
  ) {
    profileSaveStatus.textContent = 
      "Enter valid names and a 5-digit ZIP code.";
    return;
  }

  profileSaveBtn.disabled = true;
  profileSaveStatus.textContent = "Saving your changes...";

  try {

    const response = await fetch(
      `${window.BBO_CONFIG.API_BASE_URL}/auth/profile`,
      {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          zipcode,
          dietaryPreferences
        })
      }
    );

    if(response.status === 401) {
        window.location.replace("login.html");
        return;
    }

    const result = await response.json();

    if(!response.ok) {
      throw new Error(
          result.error || "Unable to update profile."
      );
    }

    profileSaveStatus.textContent =
        "Your profile was updated successfully!";

  } catch (error) {

    console.error("Profile update failed", error);

    profileSaveStatus.textContent =
      "Unable to save your changes. Please try again.";

  } finally {

    profileSaveBtn.disabled = false;
  }

});


//DEF-013 save notification preferences
const notificationSaveBtn = document.getElementById(
  "notification-save-btn"
);

const notificationSaveStatus = document.getElementById(
  "notification-save-status"
);

notificationSaveBtn.addEventListener("click", async () => {

  // Step 1: Retrieve the four notification settings
  const notificationPreferences = {
    emailNotifications:
      document.getElementById("notif-email").checked,

    recipeRecommendations:
      document.getElementById("notif-recipes").checked,

    localFoodEvents:
      document.getElementById("notif-events").checked,

    newResources:
      document.getElementById("notif-resources").checked,
  };

  // Step 2: Prevent multiple submissions
  notificationSaveBtn.disabled = true;
  notificationSaveStatus.textContent =
    "Saving your preferences...";

  try {

    // Step 3: Send preferences to the backend
    const response = await fetch(
      `${window.BBO_CONFIG.API_BASE_URL}/auth/notifications`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          notificationPreferences,
        }),
      }
    );

    // Redirect if the session has expired
    if (response.status === 401) {
      window.location.replace("login.html");
      return;
    }

    const result = await response.json();

    // Handle errors returned by the backend
    if (!response.ok) {
      throw new Error(
        result.error || "Unable to save notification preferences."
      );
    }

    // Step 4: Display success message
    notificationSaveStatus.textContent =
      result.message ||
      "Your notification preferences were saved successfully!";

  } catch (error) {

    console.error(
      "Notification preferences save failed:",
      error
    );

    notificationSaveStatus.textContent =
      "Unable to save your preferences. Please try again.";

  } finally {

    // Re-enable the Save Preferences button
    notificationSaveBtn.disabled = false;

  }

});

// Logout functionality
const logoutBtn = document.getElementById("logout-btn");
const logoutStatus = document.getElementById("logout-status");

// Password update functionality 
const passwordForm = document.getElementById("password-form");
const passwordUpdateBtn = document.getElementById("password-update-btn");
const passwordUpdateStatus = document.getElementById("password-update-status");

passwordForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  // retrieve pass field
  const currentPassword = document.getElementById(
    "current-password"
  ).value;

  const newPassword = document.getElementById(
    "new-account-password"
  ).value;

  const confirmPassword = document.getElementById(
    "confirm-account-password"
  ).value;

// clear previous status messages
passwordUpdateStatus.textContent = "";

// validate required fields 
if (!currentPassword || !newPassword || !confirmPassword) {
  passwordUpdateStatus.textContent = 
    "Please complete all password fields.";
return;
}

// verify new pass match 
if (newPassword !== confirmPassword ) {
  passwordUpdateStatus.textContent = 
    "New passwords do not match.";
  return;
}

// validate minimum pass length
if (newPassword.length < 12) {
  passwordUpdateStatus.textContent = 
    "Your password must contain at least 12 characters.";
  return;
}

// prevent using same pass
if (newPassword === currentPassword) {
  passwordUpdateStatus.textContent = 
    "Please choose a different password from your current one.";
    return;
}

// prevent multiple submissions
passwordUpdateBtn.disabled = true;
passwordUpdateStatus.textContent = "Updating your password...";

try{
  const response = await fetch(
    `${window.BBO_CONFIG.API_BASE_URL}/auth/password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    }
  );

  // redirect user with expired session
  if (response.status === 401) {
    window.location.replace("login.html");
      return;
  }

  const result = await response.json();

  // display the error returned by backend
  if (!response.ok) {
    passwordUpdateStatus.textContent = 
      result.error || "Unable to update your password.";
    return;
  }

  // clear pass fields after successful update
  passwordForm.reset();

  passwordUpdateStatus.textContent =
    result.message || "Your password was updated successfully!";

  } catch (error) {
    console.error("Password update request failed:", error);

    passwordUpdateStatus.textContent = 
      "Unable to update your password. Please try again.";

  } finally {
    passwordUpdateBtn.disabled = false;
  }



});







logoutBtn?.addEventListener("click", async () => {
  logoutBtn.disabled = true;
  logoutStatus.textContent = "Signing out...";

  try {
    const response = await fetch(
      `${window.BBO_CONFIG.API_BASE_URL}/auth/logout`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    window.location.replace("login.html");
  } catch (error) {
    console.error("Logout failed:", error);
    logoutStatus.textContent =
      "Unable to sign out. Please try again.";
    logoutBtn.disabled = false;
  }
});
});
