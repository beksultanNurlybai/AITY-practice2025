document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const formData = {
        first_name: document.getElementById("first_name").value.trim(),
        last_name: document.getElementById("last_name").value.trim(),
        patronymic: document.getElementById("patronymic").value.trim(),
        position: document.getElementById("position").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone_number: document.getElementById("phone_number").value.trim(),
        employee_number: document.getElementById("employee_number").value.trim()
    };

    try {
        const response = await fetch("http://localhost:8080/api/auth/register-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            window.location.href = `http://localhost:8080/verification-method-selection?email=${encodeURIComponent(formData.email)}&phone_number=${encodeURIComponent(formData.phone_number)}`;
        } else {
            const result = await response.json();
            alert(result.error);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to submit form.");
    }
});
