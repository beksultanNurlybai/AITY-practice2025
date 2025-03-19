document.getElementById("verification-form").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const phone_number = urlParams.get("phone_number");
    const verification_code = document.getElementById("verification_code").value.trim();

    if (!verification_code) {
        document.getElementById("message").textContent = "Please enter the verification code.";
        return;
    }

    const response = await fetch("http://localhost:8080/api/auth/verify-by-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number, verification_code })
    });

    const result = await response.json();
    if (response.ok) {
        window.location.href = "/";
    } else {
        alert(result.error);
    }
});


document.getElementById("resend-btn").addEventListener("click", async function() {
    const resendBtn = this;
    
    resendBtn.disabled = true;
    let countdown = 15;

    const messageBox = document.getElementById('message-box');
    const originalText = messageBox.innerText;
    
    messageBox.innerText = `Wait ${countdown}s`;

    const interval = setInterval(() => {
        countdown--;
        messageBox.innerText = `Wait ${countdown}s`;
        if (countdown <= 0) {
            clearInterval(interval);
            messageBox.innerText = originalText;
            resendBtn.disabled = false;
        }
    }, 1000);

    const urlParams = new URLSearchParams(window.location.search);
    const phone_number = urlParams.get("phone_number");

    try {
        const response = await fetch("http://localhost:8080/api/auth/send-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ method: "sms", email: " ", phone_number })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Verification code is sent.");
        } else {
            alert(result.error);
            console.log(result);
        }
    } catch (error) {
        console.error("Error sending request:", error);
    }
});

