/* Better Bite Orlando - Contact Us */

const form = document.getElementById("form-group");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");

const charCounter = document.querySelector(".character-count");
const successMessage = document.getElementById("successMessage");
const errorMessage = document.getElementById("errorMessage");

const submitButton = form.querySelector('button[type="submit"]');
const submitLabel = submitButton.querySelector("span");

const contactFields = [fullName, email, subject, message];

const CONTACT_API_URL = `${window.BBO_CONFIG.API_BASE_URL}/contact`;

let submissionInProgress = false;

/* Associate validation messages with form fields */

contactFields.forEach((field) => {
  const fieldError = field.parentElement.querySelector(".error-message");

  fieldError.id = `${field.id}-error`;

  field.setAttribute("aria-describedby", fieldError.id);

  field.addEventListener("input", () => {
    clearFieldError(field);
  });

  field.addEventListener("change", () => {
    clearFieldError(field);
  });
});

/* Character counter */

charCounter.id = "message-character-count";

message.setAttribute("aria-describedby", `${charCounter.id} message-error`);

function updateCharacterCount() {
  charCounter.textContent = `${message.value.length} / 1000`;
}

message.addEventListener("input", updateCharacterCount);

/* Validation helpers */

function clearFieldError(field) {
  const fieldError = field.parentElement.querySelector(".error-message");

  fieldError.textContent = "";
  field.removeAttribute("aria-invalid");
}

function showFieldError(field, text) {
  const fieldError = field.parentElement.querySelector(".error-message");

  fieldError.textContent = text;
  field.setAttribute("aria-invalid", "true");
}

function clearMessages() {
  successMessage.hidden = true;
  errorMessage.hidden = true;

  contactFields.forEach(clearFieldError);
}

function showError(text) {
  successMessage.hidden = true;
  errorMessage.textContent = text;
  errorMessage.hidden = false;
}

function showSuccess() {
  errorMessage.hidden = true;
  successMessage.hidden = false;
  successMessage.focus();
}

/* Form validation */

function validateForm() {
  let valid = true;

  const nameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const messageValue = message.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (nameValue.length < 2) {
    showFieldError(fullName, "Please enter your full name.");

    valid = false;
  } else if (nameValue.length > 60) {
    showFieldError(fullName, "Name must be 60 characters or less.");

    valid = false;
  }

  if (!emailRegex.test(emailValue)) {
    showFieldError(email, "Please enter a valid email address.");

    valid = false;
  } else if (emailValue.length > 100) {
    showFieldError(email, "Email must be 100 characters or less.");

    valid = false;
  }

  if (!subject.value.trim()) {
    showFieldError(subject, "Please select a subject.");

    valid = false;
  }

  if (messageValue.length < 10) {
    showFieldError(message, "Please enter at least 10 characters.");

    valid = false;
  } else if (messageValue.length > 1000) {
    showFieldError(message, "Message must be 1000 characters or less.");

    valid = false;
  }

  return valid;
}

/* Submit contact form */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (submissionInProgress) return;

  clearMessages();

  if (!validateForm()) {
    showError("Please correct the highlighted fields.");

    const firstInvalidField = form.querySelector('[aria-invalid="true"]');

    firstInvalidField?.focus();
    return;
  }

  const payload = {
    name: fullName.value.trim(),
    email: email.value.trim(),
    subject: subject.value.trim(),
    message: message.value.trim(),
  };

  submissionInProgress = true;

  submitButton.disabled = true;
  submitLabel.textContent = "Sending...";
  form.setAttribute("aria-busy", "true");

  contactFields.forEach((field) => {
    field.disabled = true;
  });

  try {
    const response = await fetch(CONTACT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (response.status === 429) {
      showError(
        "Too many messages have been submitted. " +
          "Please wait a few minutes and try again.",
      );

      errorMessage.focus();
      return;
    }

    if (!response.ok) {
      showError(
        data?.message ||
          data?.error ||
          "Unable to submit your request. Please try again.",
      );

      errorMessage.focus();
      return;
    }

    if (data?.success !== true) {
      showError(
        "We could not confirm your submission. " +
          "Please contact us by email if needed.",
      );

      errorMessage.focus();
      return;
    }

    form.reset();
    updateCharacterCount();
    showSuccess();
  } catch (error) {
    console.error("Contact form submission failed:", error);

    showError(
      "Unable to connect to our service. " +
        "Please check your connection and try again.",
    );

    errorMessage.focus();
  } finally {
    submissionInProgress = false;

    contactFields.forEach((field) => {
      field.disabled = false;
    });

    submitButton.disabled = false;
    submitLabel.textContent = "Send Message";

    form.removeAttribute("aria-busy");
  }
});

clearMessages();
updateCharacterCount();
