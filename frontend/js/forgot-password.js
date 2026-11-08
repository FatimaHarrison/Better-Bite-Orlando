/* Better Bite Orlando | forgot password */


document.addEventListener("DOMContentLoaded", () => {

// forgot password form
const forgotForm = document.getElementById("forgot-password-form");
const emailInput = document.getElementById("forgot-email");
const status = document.getElementById("forgot-status");

// steps
const step1 = document.getElementById("forgot-step-1");
const step2 = document.getElementById("forgot-step-2");

// left section
const leftTitle = document.getElementById("forgot-left-title");
const leftDescription = document.getElementById("forgot-left-description");

// email confirmation 
const sentEmailAddress = document.getElementById("sent-email-address");

// submit button
const submitButton = forgotForm?.querySelector('button[type="submit"]');

if (!forgotForm || !step1 || !step2 || !status  || !submitButton) {
    return;
}

// Handle from submission 
    forgotForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        // obtain email
        const email = emailInput.value.trim();
        emailInput.value = email;

        // validate email
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }

        // Disable button while processing 
        submitButton.disabled = true;
        status.textContent = "Processing your request...";

        try {
            
            // send request to backend
            const response = await fetch(
                "http://127.0.0.1:3001/auth/forgot-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                    }
                );

                const result = await response.json();

                //handle backend errors
                if (!response.ok) {
                    status.textContent = 
                    result.error || "Unable to process your request.";
                    return;
                }
                

        //frontend only confirmation purpose test

        //hide step 1 
        step1.hidden = true;

        // show step 2
        step2.hidden = false;

        // update left section 
        leftTitle.textContent = "Check Your Email";

        leftDescription.textContent = "If an accont exists for this email, a password rest link will be sent.";

        // display email address
        sentEmailAddress.textContent = email;

        // remove front only preview notice
        const demoNotice = document.querySelector(".demo-notice");

        if (demoNotice) {
            demoNotice.hidden = true;
        }
    } catch (error) {
        console.error("Password recovery request failed:", error);

        status.textContent = "Unable to process your request. Please try again.";
    } finally {

        // enable submit button
        submitButton.disabled = false;

        }
    });
});