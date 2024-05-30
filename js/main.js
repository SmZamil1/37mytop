const body = document.body;
const image = body.querySelector("#coin");
const h1 = body.querySelector("h1");
let coins;
let total;
let power;
let count;

// Retrieve data from Telegram Cloud Storage on page load
telegram.getItems(["coins", "total", "power", "count"], (error, data) => {
    if (error) {
        console.error("Error retrieving data from Telegram Cloud Storage:", error);
        return;
    }

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

    // Update coins count
    coins++;

    // Update UI with updated coins count
    h1.textContent = coins.toLocaleString();

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
    telegram.setItem("coins", coins, (error, success) => {
        if (error) {
            console.error("Error saving coins count to Telegram Cloud Storage:", error);
        }
    });
});

// Function to update power and progress bar
setInterval(() => {
    // Update power if it's less than total
    if (power < total) {
        power = Math.min(power + 2, 500);
        body.querySelector("#power").textContent = power;
        body.querySelector(".progress").style.width = (100 * power / total) + "%";

        // Save updated power to Telegram Cloud Storage
        telegram.setItem("power", power, (error, success) => {
            if (error) {
                console.error("Error saving power to Telegram Cloud Storage:", error);
            }
        });
    }
}, 2000);
