/* Better Bite Orlando | Reset password */ 

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("reset-password-form");
    const password = document.getElementById("new-password");
    const confirm = document.getElementById("confirm-password");

    const matchMessage = document.getElementById("password-match");
    const resetStatus = document.getElementById("reset-status");

    if(!form || !password || !confirm ) return;

    //password validation rules
    const rules = [
        {
            id: "rule-length",
            test: value => value.length >= 12 && value.length <= 72 
        },
        {
            id: "rule-uppercase",
            test: value => /[A-Z]/.test(value)
        },
        {
            id: "rule-lowercase",
            test: value => /[a-z]/.test(value)
        },
        {
            id: "rule-symbol",
            test: value => /[^A-Za-z0-9]/.test(value)
        },
    ];

    // update checklist as the user types
    function validatePassword() {
        const value = password.value;

        rules.forEach(rule =>{
            const element = document.getElementById(rule.id);
            const valid = value.length > 0 && rule.test(value);

            element.classList.toggle("met", valid);

            const icon = element.querySelector("i");

            icon.className = valid
            ? "bi bi-check-circle-fill"
            : "bi bi-circle";
        });

        validateConfirmation();
    }


    // check both password match
    function validateConfirmation() {
        if(!confirm.value) {
            matchMessage.textContent = "";
            matchMessage.dataset.state= "";
            return;

        }

        const matches = password.value === confirm.value;

        matchMessage.textContent = matches
        ? "Password match"
        : "Password do not match";
    
        matchMessage.dataset.state = matches
        ? "valid"
        : "invalid";
    }



    // show /hide password 
    document.querySelectorAll("[data-password-toggle]")
        .forEach(button => {

            button.addEventListener("click", () => {
                const input = document.getElementById(
                    button.dataset.passwordToggle
                );

                const isHidden = input.type === "password";

                input.type = isHidden ? "text" : "password";

                button.setAttribute(
                    "aria-pressed",
                    String(isHidden)
                );

                button.setAttribute(
                    "aria-label",
                    isHidden ? "Hide password" : "Show password"
                );

                button.querySelector("i").className = isHidden
                    ?  "bi bi-eye-slash"
                    :  "bi bi-eye";
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
            const previewNotice = document.getElementById(
                "reset-preview-notice"
            );

            // hide form and show confimration
            step1.hidden = true;
            step2.hidden = false;

            // cleary identify frontend only demo
            previewNotice.hidden = !isPreview;

            // iupdate the left section
            document.querySelector(".reset-intro h1").textContent =
                "You are all set!";

            document.querySelector(".reset-intro p").textContent =
                isPreview 
                ? "This is a preview of the password reset confirmation"
                : "Your password has been sccessfully reset. You can sign in to your account."
        }




        // form submission
        form.addEventListener("submit", event => {

            event.preventDefault();

            const value = password.value;

            const allValid = rules.every(rule => rule.test(value));

            if(!allValid) {
                resetStatus.textContent =
                "Please meet all password requirements.";

                resetStatus.dataset.state = "error";
                return ;
            }

            if (value !== confirm.value) {
                resetStatus.textContent =
                "The password must match.";

                resetStatus.dataset.state = "error";
                return;
            }

            // frontend preview only 
       showResetSuccess(true);

            // Todo: integrate backend password reset endpoint.
            // the backend must vlaidate the reset token
            // enforce the password policy, and upate the hash/
        });

});