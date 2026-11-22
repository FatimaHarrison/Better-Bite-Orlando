const form = document.getElementById("form-group");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const response = await fetch(
            `${window.BBO_CONFIG.API_BASE_URL}/contact`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: fullName.value.trim(),
                    email: email.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim()
                })
            }
        );

        const data = await response.json();

        if(response.ok){
            showSuccess(
                "Thank you for contacting Better Bite Orlando."
            );

            form.reset();
        }
        else{
            showError(
                data.message ||
                "Unable to submit form."
            );
        }

    } catch(error){

        showError(
            "Connection error. Please try again later."
        );

        console.error(error);
    }
});
