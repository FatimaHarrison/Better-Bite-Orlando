
/* Better Bite Orlando - Registration */

const registerForm = document.getElementById("register-form");

if (registerForm) {
    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById("confirm-password");
    const status = document.getElementById("register-status");
    const submitButton = registerForm.querySelector('button[type="submit"]');

    function validatePasswords() {
        const matches = password.value === confirmPassword.value;

        confirmPassword.setCustomValidity(
            matches ? "" : "Passwords do not match."
        );

        return matches;
    }

    password.addEventListener("input", validatePasswords);
    confirmPassword.addEventListener("input", validatePasswords);

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!validatePasswords()) {
            confirmPassword.reportValidity();
            return;
        }

        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const zipcode = document.getElementById("register-zipcode").value.trim();
    
        const value = password.value;

        //validate password
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasSymbol = /[^A-Za-z0-9]/.test(value);
        const validLength = 
            value.length >= 12 &&
            new TextEncoder().encode(value).length <= 72;

        if (!hasUpper || !hasLower || !hasSymbol || !validLength) {
            status.textContent =
                "Password must be 12-72 bytes and include uppercase, lowercase, and a symbol.";
            return;
        }
        if (!/^\d{5}$/.test(zipcode)) {
            status.textContent = "Enter a valid 5-digit ZIP code."
            return;
        }

        submitButton.disabled = true;
        status.textContent = "Creating your account...";

        try {
            const response = await fetch(
                "http://127.0.0.1:3001/auth/register",
                {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: '${firstName} ${lastName}',
                        email,
                        password: value,
                        zipcode
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                status.textContent = 
                result.error || "Registration failed.";
            return;

            }

            status.textContent =
            "Account created successfully! You can now sign in.";

            registerForm.reset();

        } catch (error) {
            console.error("Registration error", error);

            status.textContent = 
            "Unable to connecto to the server";
        } finally {
            submitButton.disabled = false;
        }
    });
}
