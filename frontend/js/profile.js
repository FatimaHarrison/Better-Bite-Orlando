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

    //redirect user without a valid session
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

    // Populate profile inputs using the backend user fields
    document.getElementById("profile-first-name").value = user.firstName ?? "";
    document.getElementById("profile-last-name").value = user.lastName ?? "";
    document.getElementById("profile-email").value = user.email ?? "";

    document.getElementById("profile-zip").value =
      user.zipcode != null ? String(user.zipcode).padStart(5, "0") : "";
  } catch (error) {
    console.error("Profile loading failed:", error);

    alert("Unable to load your profile. Please try again.");
  }
});
