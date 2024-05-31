var CloudStorage = (function() {
    var cloudStorage = {};

    function invokeStorageMethod(method, params, callback) {
      if (!versionAtLeast('6.9')) {
        console.error('[Telegram.WebApp] CloudStorage is not supported in version ' + webAppVersion);
        throw Error('WebAppMethodUnsupported');
      }
      invokeCustomMethod(method, params, callback);
      return cloudStorage;
    }

    cloudStorage.setCoinPoints = function(value, callback) {
      return invokeStorageMethod('saveStorageValue', {key: 'coins', value: value}, callback);
    };
    cloudStorage.getCoinPoints = function(callback) {
      return cloudStorage.getItem('coins', callback);
    };
    cloudStorage.setTotal = function(value, callback) {
      return invokeStorageMethod('saveStorageValue', {key: 'total', value: value}, callback);
    };
    cloudStorage.getTotal = function(callback) {
      return cloudStorage.getItem('total', callback);
    };
    cloudStorage.setPower = function(value, callback) {
      return invokeStorageMethod('saveStorageValue', {key: 'power', value: value}, callback);
    };
    cloudStorage.getPower = function(callback) {
      return cloudStorage.getItem('power', callback);
    };

    return cloudStorage;
})();

Object.defineProperty(WebApp, 'CloudStorage', {
    value: CloudStorage,
    enumerable: true
});

const body = document.body;
const image = body.querySelector("#coin");
const h1 = body.querySelector("h1");
let coins = 0;
let total = 500;
let power = 500;

cloudStorage.getCoinPoints(function(err, res) {
    if (!err && res) {
        coins = Number(res);
        h1.textContent = coins.toLocaleString();
    } else {
        cloudStorage.setCoinPoints(0, function(err, res) {
            if (!err) {
                h1.textContent = "0";
            }
        });
    }
});

cloudStorage.getTotal(function(err, res) {
    if (!err && res) {
        total = Number(res);
        body.querySelector("#total").textContent = "/" + total;
    } else {
        cloudStorage.setTotal(500, function(err, res) {
            if (!err) {
                body.querySelector("#total").textContent = "/500";
            }
        });
    }
});

cloudStorage.getPower(function(err, res) {
    if (!err && res) {
        power = Number(res);
        body.querySelector("#power").textContent = power;
    } else {
        cloudStorage.setPower(500, function(err, res) {
            if (!err) {
                body.querySelector("#power").textContent = "500";
            }
        });
    }
});

image.addEventListener('click', function(e) {
    let x = e.offsetX;
    let y = e.offsetY;
    navigator.vibrate(5);
    cloudStorage.getPower(function(err, res) {
        if (!err && res) {
            power = Number(res);
            if (power > 0) {
                cloudStorage.setCoinPoints(coins + 1, function(err, res) {
                    if (!err) {
                        h1.textContent = (coins + 1).toLocaleString();
                    }
                });
                cloudStorage.setPower(power - 1, function(err, res) {
                    if (!err) {
                        body.querySelector("#power").textContent = power - 1;
                    }
                });
            }
        }
    });
    
    if (x < 150 && y < 150) {
        image.style.transform = "translate(-0.25rem, -0.25rem) skewY(-10deg) skewX(5deg)";
    } else if (x < 150 && y > 150) {
        image.style.transform = "translate(-0.25rem, 0.25rem) skewY(-10deg) skewX(5deg)";
    } else if (x > 150 && y > 150) {
        image.style.transform = "translate(0.25rem, 0.25rem) skewY(10deg) skewX(-5deg)";
    } else if (x > 150 && y < 150) {
        image.style.transform = "translate(0.25rem, -0.25rem) skewY(10deg) skewX(-5deg)";
    }
    
    setTimeout(function() {
        image.style.transform = "translate(0px, 0px)";
    }, 100);
    
    body.querySelector(".progress").style.width = (100 * power / total) + "%";
});

setInterval(function() {
    cloudStorage.getPower(function(err, res) {
        if (!err && res) {
            power = Number(res);
            if (total > power) {
                let newPower = Math.min(power + 2, 500);
                cloudStorage.setPower(newPower, function(err, res) {
                    if (!err) {
                        body.querySelector("#power").textContent = newPower;
                        body.querySelector(".progress").style.width = (100 * newPower / total) + "%";
                    }
                });
            }
        }
    });
}, 2000);
