
/* Better Bite Orlando - Registration */

const registerForm = document.getElementById("register-form");

if (registerForm) {
    const password = document.getElementById("register-password");
    const confirmPassword = document.getElementById("confirm-password");
    const status = document.getElementById("register-status");

    function validatePasswords() {
        const matches = password.value === confirmPassword.value;

        confirmPassword.setCustomValidity(
            matches ? "" : "Passwords do not match."
        );

        return matches;
    }

    password.addEventListener("input", validatePasswords);
    confirmPassword.addEventListener("input", validatePasswords);

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!validatePasswords()) {
            confirmPassword.reportValidity();
            return;
        }

        const value = password.value;

        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasSymbol = /[^A-Za-z0-9]/.test(value);

        if (!hasUpper || !hasLower || !hasSymbol) {
            status.textContent =
                "Password must include uppercase, lowercase, and a symbol.";
            return;
        }

        status.textContent =
            "Registration interface ready. Backend integration is pending.";
    });
}
