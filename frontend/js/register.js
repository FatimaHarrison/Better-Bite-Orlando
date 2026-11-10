/* Better Bite Orlando - Registration */

const registerForm = document.getElementById("register-form");

if (registerForm) {
  const password = document.getElementById("register-password");
  const confirmPassword = document.getElementById("confirm-password");
  const status = document.getElementById("register-status");
  const submitButton = registerForm.querySelector('button[type="submit"]');

  function validatePasswords() {
    const matches = password.value === confirmPassword.value;

    confirmPassword.setCustomValidity(matches ? "" : "Passwords do not match.");

    return matches;
  }

  password.addEventListener("input", validatePasswords);
  password.addEventListener("input", () => {
    password.setCustomValidity("");
  });

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
      value.length >= 12 && new TextEncoder().encode(value).length <= 72;

    if (!hasUpper || !hasLower || !hasSymbol || !validLength) {
      password.setCustomValidity(
        "Password must be at least 12 characters, no more than 72 UTF-8 bytes, and include uppercase, lowercase, and a symbol.",
      );

      password.reportValidity();
      return;
    }

    password.setCustomValidity("");

    if (!/^\d{5}$/.test(zipcode)) {
      status.textContent = "Enter a valid 5-digit ZIP code.";
      return;
    }

    submitButton.disabled = true;
    status.textContent = "Creating your account...";

    try {
      const response = await fetch(
        `${window.BBO_CONFIG.API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password: value,
            zipcode,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        status.textContent = result.error || "Registration failed.";
        return;
      }

      // registration succesful

      const registeredEmail = result.data?.user?.email ?? email;

      // display the registered email
      document.getElementById("registered-email").textContent = registeredEmail;

      // hiden the registration form!
      document.getElementById("register-form-view").hidden = true;

      //display success confirmation
      document.getElementById("register-success").hidden = false;

      // apply success card styling
      document.querySelector(".register-card").classList.add("is-success");

      //clear form data
      registerForm.reset();

      // focus confirmation heading
      document.getElementById("register-success-title").focus();
    } catch (error) {
      console.error("Registration error", error);

      status.textContent = "Unable to connect to the server";
    } finally {
      submitButton.disabled = false;
    }
  });
}
