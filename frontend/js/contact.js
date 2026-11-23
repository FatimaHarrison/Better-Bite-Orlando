console.log("contact.js loaded");

const form = document.getElementById("form-group");

const messageField = document.getElementById("message");
const charCounter = document.querySelector(".character-count");

messageField.addEventListener("input", () => {
    charCounter.textContent =
        `${messageField.value.length} / 1000`;
});

form.addEventListener("submit", async (event) => {

    console.log("Submit button clicked");

    event.preventDefault();

    let valid = true;

    document
        .querySelectorAll(".error-message")
        .forEach(msg => msg.textContent = "");

    document.getElementById("errorMessage")
        .style.display = "none";

    document.getElementById("successMessage")
        .style.display = "none";

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* Name Validation */
    if (fullName.value.trim().length < 2) {
        fullName.parentElement
            .querySelector(".error-message")
            .textContent =
            "Please enter your full name.";

        valid = false;
    }

    if (fullName.value.trim().length > 60) {
        fullName.parentElement
            .querySelector(".error-message")
            .textContent =
            "Name must be 60 characters or less.";

        valid = false;
    }

    /* Email Validation */
    if (!emailRegex.test(email.value.trim())) {
        email.parentElement
            .querySelector(".error-message")
            .textContent =
            "Please enter a valid email address.";

        valid = false;
    }

    if (email.value.length > 100) {
        email.parentElement
            .querySelector(".error-message")
            .textContent =
            "Email must be 100 characters or less.";

        valid = false;
    }

    /* Subject Validation */
    if (subject.value === "") {
        subject.parentElement
            .querySelector(".error-message")
            .textContent =
            "Please select a subject.";

        valid = false;
    }

    /* Message Validation */
    if (message.value.trim().length < 10) {
        message.parentElement
            .querySelector(".error-message")
            .textContent =
            "Please enter at least 10 characters.";

        valid = false;
    }

    if (message.value.trim().length > 1000) {
        message.parentElement
            .querySelector(".error-message")
            .textContent =
            "Message must be 1000 characters or less.";

        valid = false;
    }

    if (!valid) {
        document.getElementById("errorMessage")
            .style.display = "block";
        return;
    }

    try {

        const response = await fetch(
            "https://api-dev.betterbiteorlando.com/contact",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: fullName.value.trim(),
                    email: email.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim()
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("successMessage")
                .style.display = "block";

            form.reset();

            charCounter.textContent =
                "0 / 1000";

        } else {

            document.getElementById("errorMessage")
                .textContent =
                data.message ||
                "Unable to submit your request.";

            document.getElementById("errorMessage")
                .style.display = "block";
        }

    } catch (error) {

        console.error(
            "Contact form submission error:",
            error
        );

        document.getElementById("errorMessage")
            .textContent =
            "Connection error. Please try again later.";

        document.getElementById("errorMessage")
            .style.display = "block";
    }

});