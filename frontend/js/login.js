/* Login Authentication */ 

const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        loginStatus.textContent = "Signing in...";

        try {
            const response = await fetch(
                "http://127.0.0.1:3001/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if(!response.ok) {
                loginStatus.textContent = 
                result.error || "Unable to sign in.";
            return;

        }

        loginStatus.textContent = "Login successful!";

        // redirect uset to My Account
        window.location.href = 'profile.html';

        // Redirect and authenticated navigation
        // will be implemented after session testing. 

        } catch (error) {
            console.error("Login request failed:", error);
            loginStatus.textContent = 
                "Unable to connect to the server.";
        } finally {
            submitButton.disabled = false;
        }
    });
}
