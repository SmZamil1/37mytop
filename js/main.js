const body = document.body;
const image = body.querySelector("#coin");
const h1 = body.querySelector("h1");
const totalElement = body.querySelector("#total");
const powerElement = body.querySelector("#power");
const progressBar = body.querySelector(".progress");

let coins = 0;
let total = 500;
let power = 500;
let count = 1;

const firebaseConfig = {
  apiKey: "AIzaSyCDmkPXXpD_-09ryf0ZvHZnMmgF19F3vhc",
    authDomain: "clickerdata1.firebaseapp.com",
    projectId: "clickerdata1",
    storageBucket: "clickerdata1.appspot.com",
    messagingSenderId: "271221713076",
    appId: "1:271221713076:web:26a09de52d3151821f4fe1",
    measurementId: "G-REG6TJ0Y8G"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

const updateUI = () => {
  h1.textContent = coins.toLocaleString();
  totalElement.textContent = `/${total}`;
  powerElement.textContent = power;
  progressBar.style.width = `${(power / total) * 100}%`;
};

const updatePower = (newPower) => {
  power = newPower;
  powerElement.textContent = power;
  progressBar.style.width = `${(power / total) * 100}%`;
  database.collection("userData").doc("power").set({ power: newPower });
};

image.addEventListener("click", (e) => {
  let x = e.offsetX;
  let y = e.offsetY;
  navigator.vibrate(5);

  if (power > 0) {
    coins++;
    updateUI();
    updatePower(power - 1);
  }

  if (x < 150 && y < 150) {
    image.style.transform = "translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)";
  } else if (x < 150 && y > 150) {
    image.style.transform = "translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)";
  } else if (x > 150 && y > 150) {
    image.style.transform = "translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)";
  } else if (x > 150 && y < 150) {
    image.style.transform = "translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)";
  }

  setTimeout(() => {
    image.style.transform = "translate(0px, 0px)";
  }, 100);
});

setInterval(() => {
  if (total > power) {
    let newPower = Math.min(power + 2, 500);
    updatePower(newPower);
  }
}, 2000);

// Telegram user data
function getNameFromData() {
  const data = Telegram.WebApp.initDataUnsafe;
  if (data && data.user) {
    const firstName = data.user.first_name || '';
    const lastName = data.user.last_name || '';
    if (firstName || lastName) {
      const fullName = firstName + ' ' + lastName;
      console.log('User Full Name:', fullName);
      database.collection('telegramUsers').doc('user').set({ fullName });
    }
  }
}

// Call the function to extract the user's name
getNa
  meFromData();
