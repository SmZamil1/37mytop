const botToken = "6912236548:AAGu_sMweTb24usr4jChJ08_jD7O59dK33I";
const body = document.body;
const image = body.querySelector("#coin");
const h1 = body.querySelector("h1");
let coins;
let total;
let power;
let count;

// Function to send data to Telegram Cloud Storage
function sendDataToTelegramCloudStorage(data) {
    telegram.answerWebAppQuery({
        query_id: "unique_id",
        data: data
    });
}

// Function to retrieve data from Telegram Cloud Storage
function retrieveDataFromTelegramCloudStorage(userId) {
    // Make a request to your bot to retrieve data associated with the user ID
    // Use Telegram Bot API methods to handle the request and retrieve data securely
    // Return the retrieved data to the web app
}

// Function to validate data received via the Mini App
function validateData(initData) {
    const fields = Object.keys(initData).sort();
    let dataCheckString = '';
    for (const field of fields) {
        dataCheckString += `${field}=${initData[field]}\n`;
    }
    const secretKey = HMAC_SHA256(botToken, "WebAppData");
    const hash = hex(HMAC_SHA256(dataCheckString, secretKey));
    if (hash === initData.hash) {
        // Data is from Telegram, perform further validation if necessary
        const authDate = parseInt(initData.auth_date, 10);
        // Perform additional checks if needed, e.g., check for expiration
        return true;
    }
    return false;
}

// Retrieve data from Telegram Cloud Storage on page load
telegram.getStorageData({}, (data) => {
    coins = data.coins || 0;
    total = data.total || 500;
    power = data.power || 500;
    count = data.count || 1;

    // Update UI based on retrieved data
    h1.textContent = Number(coins).toLocaleString();
    body.querySelector("#total").textContent = `/${total}`;
    body.querySelector("#power").textContent = power;
    body.querySelector(".progress").style.width = (100 * power / total) + "%";
});

// Event listener for clicking on the image
image.addEventListener("click", (e) => {
    let x = e.offsetX;
    let y = e.offsetY;

    // Vibrate the device (optional)
    navigator.vibrate(5);

    // Retrieve data from Telegram Cloud Storage
    let coins = retrieveDataFromTelegramCloudStorage(userId); // Example: Retrieve user's coins
    
    // Update UI based on retrieved data
    if (coins !== null) {
        h1.textContent = Number(coins).toLocaleString();
    }

    // Perform image transformations based on click position
    if (x < 150 && y < 150) {
        image.style.transform = "translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)";
    } else if (x < 150 && y > 150) {
        image.style.transform = "translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)";
    } else if (x > 150 && y > 150) {
        image.style.transform = "translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)";
    } else if (x > 150 && y < 150) {
        image.style.transform = "translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)";
    }

    // Reset image transformation after a delay
    setTimeout(() => {
        image.style.transform = "translate(0px, 0px)";
    }, 100);

    // Save updated data to Telegram Cloud Storage
    sendDataToTelegramCloudStorage({ coins: coins }); // Example: Save updated coins count
});

// Function to update power and progress bar
setInterval(() => {
    // Update power if it's less than total
    if (power < total) {
        let newPower = Math.min(power + 2, 500);
        power = newPower;
        body.querySelector("#power").textContent = newPower;
        body.querySelector(".progress").style.width = (100 * newPower / total) + "%";

        // Save updated power to Telegram Cloud Storage
        sendDataToTelegramCloudStorage({ power: newPower }); // Example: Save updated power
    }
}, 2000);
