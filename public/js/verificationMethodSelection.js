document.getElementById("sms-btn").addEventListener("click", async function(event) {
    await selectVerificationMethod("sms");
});

document.getElementById("email-btn").addEventListener("click", async function(event) {
    await selectVerificationMethod("email");
});

async function selectVerificationMethod(method) {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const phone_number = urlParams.get("phone_number");

    const response = await fetch("http://localhost:8080/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, email, phone_number })
    });
    
    const result = await response.json();
    if (response.ok) {
        if (method == "email") {
            window.location.href = "http://localhost:8080/verification-by-email";
        } else if (method == "sms") {
            window.location.href = "http://localhost:8080/verification-by-sms?phone_number=" + encodeURIComponent(phone_number);
        }
    } else {
        alert(result)
        console.log(result)
    }
}
