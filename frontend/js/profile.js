/* Better Bite Orlando | My Account */

document.addEventListener("DOMContentLoaded", async ()=> {

    try {
        // retrieve the authenticated user
        const response = await fetch(
        `${window.BBO_CONFIG.API_BASE_URL}/auth/profile`,
        {
                method: "GET",
                credentials: "include",
                cache: "no-store"
            }
        );

        //redirect user without a valid session
        if (response.status === 401) {
            window.location.replace("login.html");
            return;
        }

        if(!response.ok) {
            throw new Error("Unable to load profile.");
        }


        const result = await response.json();
        const user = result.data?.user;

        if(!user) {
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
            user.zipcode ?? "";

        // populate profile inputs


        document.getElementById("profile-first-name").value = firstName;

        document.getElementById("profile-last-name").value = lastName;

        document.getElementById("profile-email").value = user.email || "";

        document.getElementById("profile-zip").value = user.zipcode != null
        ? String(user.zipcode).padStart(5, "0")
        : "";

    } catch (error) {
        console.error("Profile loading failed:", error);

        alert("Unable to load your profile. Please try again.");
    }

    // logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    const logoutStatus = document.getElementById("logout-status");

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
            console.error(error);
            logoutStatus.textContent =
            "Unable to sign out. Please try again.";
            logoutBtn.disabled = false;
        }
    })

});