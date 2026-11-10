/* Better Bite Orlando | Reset password */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");
  const password = document.getElementById("new-password");
  const confirm = document.getElementById("confirm-password");

  const matchMessage = document.getElementById("password-match");
  const resetStatus = document.getElementById("reset-status");

  if (!form || !password || !confirm) return;

  //password validation rules
  const rules = [
    {
      id: "rule-length",
      test: (value) =>
        value.length >= 12 && new TextEncoder().encode(value).length <= 72,
    },
    {
      id: "rule-uppercase",
      test: (value) => /[A-Z]/.test(value),
    },
    {
      id: "rule-lowercase",
      test: (value) => /[a-z]/.test(value),
    },
    {
      id: "rule-symbol",
      test: (value) => /[^A-Za-z0-9]/.test(value),
    },
  ];

  // update checklist as the user types
  function validatePassword() {
    const value = password.value;

    rules.forEach((rule) => {
      const element = document.getElementById(rule.id);
      const valid = value.length > 0 && rule.test(value);

      element.classList.toggle("met", valid);

      const icon = element.querySelector("i");

      icon.className = valid ? "bi bi-check-circle-fill" : "bi bi-circle";
    });

    validateConfirmation();
  }

  // check both password match
  function validateConfirmation() {
    if (!confirm.value) {
      matchMessage.textContent = "";
      matchMessage.dataset.state = "";
      return;
    }

    const matches = password.value === confirm.value;

    matchMessage.textContent = matches
      ? "Password match"
      : "Password do not match";

    matchMessage.dataset.state = matches ? "valid" : "invalid";
  }

  // show /hide password
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.passwordToggle);

      const isHidden = input.type === "password";

      input.type = isHidden ? "text" : "password";

      button.setAttribute("aria-pressed", String(isHidden));

      button.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password",
      );

      button.querySelector("i").className = isHidden
        ? "bi bi-eye-slash"
        : "bi bi-eye";
    });
  });

  // live validation
  password.addEventListener("input", () => {
    resetStatus.textContent = "";
    validatePassword();
  });

  confirm.addEventListener("input", () => {
    resetStatus.textContent = "";
    validateConfirmation();
  });

  // switch to password reset confirmation screen
  function showResetSuccess(isPreview = false) {
    const step1 = document.getElementById("reset-step-1");
    const step2 = document.getElementById("reset-step-2");
    const previewNotice = document.getElementById("reset-preview-notice");

    // hide form and show confimration
    step1.hidden = true;
    step2.hidden = false;

    // cleary identify frontend only demo
    previewNotice.hidden = !isPreview;

    // update the left section
    document.querySelector(".reset-intro h1").textContent = "You are all set!";

    document.querySelector(".reset-intro p").textContent = isPreview
      ? "This is a preview of the password reset confirmation"
      : "Your password has been successfully reset. You can sign in to your account.";
  }

  // Read the reset token from the email link
  const token = new URLSearchParams(window.location.search).get("token");

  const submitButton = form.querySelector('button[type="submit"]');

  // check if a valid-looking token exists

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    resetStatus.textContent =
      "Invalid or missing reset link. Please request a new password reset email.";

    resetStatus.dataset.state = "error";
    submitButton.disabled = true;
  }

  // form submission
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = password.value;

    // validate password requirements
    const allValid = rules.every((rule) => rule.test(value));

    if (!allValid) {
      resetStatus.textContent = "Please meet all password requirements.";

      resetStatus.dataset.state = "error";
      return;
    }

    // check password confirmation
    if (value !== confirm.value) {
      resetStatus.textContent = "The password must match.";

      resetStatus.dataset.state = "error";
      return;
    }

    // disable button during request
    submitButton.disabled = true;
    resetStatus.textContent = "Updating your password...";

    try {
      //send new password and token to backend
      const response = await fetch(
        `${window.BBO_CONFIG.API_BASE_URL}/auth/password-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password: value,
          }),
        },
      );

      const result = await response.json();

      // handle backend errors
      if (!response.ok) {
        resetStatus.textContent =
          result.error || "Unable to reset your password.";

        resetStatus.dataset.state = "error";
        return;
      }

      // password successfully updated
      form.reset();

      // remove the token from the browser address bar
      window.history.replaceState(null, "", window.location.pathname);

      // display the real success confirmation
      showResetSuccess(false);
    } catch (error) {
      console.error("Password reset request failed:", error);

      resetStatus.textContent =
        "Unable to connect to the server. Please try again.";

      resetStatus.dataset.state = "error";
    } finally {
      submitButton.disabled = false;
    }
  });
});
