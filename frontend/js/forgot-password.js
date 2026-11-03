/* Better Bite Orlando | forgot password */


document.addEventListener("DOMContentLoaded", () => {

// forgot password form
const forgotForm = document.getElementById("forgot-password-form");
const emailInput = document.getElementById("forgot-email");

// steps
const step1 = document.getElementById("forgot-step-1");
const step2 = document.getElementById("forgot-step-2");

// left section
const leftTitle = document.getElementById("forgot-left-title");
const leftDescription = document.getElementById("forgot-left-description");

// email confirmation 
const sentEmailAddress = document.getElementById("sent-email-address");

if (!forgotForm || !step1 || !step2 ) {
    return;
}

// Handle from submission 
    forgotForm.addEventListener("submit", (event) => {

        event.preventDefault();

        // obtain email
        const email = emailInput.value.trim();
        emailInput.value = email;

        // validate email
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        //frontend only confirmation purpose test

        //hide step 1 
        step1.hidden = true;

        // show step 2
        step2.hidden = false;

        // update left section 
        leftTitle.textContent = "Check Your Email";

        leftDescription.textContent = "This is a preview of the password reset confirmation";

        // display email address
        sentEmailAddress.textContent = email;
    });
});