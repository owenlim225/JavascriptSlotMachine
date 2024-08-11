var isSpinning = false;
var audioEnabled = false;
let statusElement = document.getElementById("status");

// Load sounds
var spinSounds = Array(7).fill().map(() => new Audio("res/sounds/spin.mp3"));
var coinSounds = Array(3).fill().map(() => new Audio("res/sounds/coin.mp3"));
var winSound = new Audio("res/sounds/win.mp3");
var loseSound = new Audio("res/sounds/lose.mp3");

function doSlot() {
    if (isSpinning) return;

    isSpinning = true;
    statusElement.innerHTML = "SPINNING";

    // Calculate number of spins for each slot
    var baseSpins = randomInt(1, 4) * 7;
    var spinsForSlot1 = baseSpins + randomInt(1, 7);
    var spinsForSlot2 = baseSpins + 2 * 7 + randomInt(1, 7);
    var spinsForSlot3 = baseSpins + 4 * 7 + randomInt(1, 7);

    // Start spinning each slot
    var soundIndex = 0;
    startSpinning("slot1", spinsForSlot1, () => coinSounds[0].play());
    startSpinning("slot2", spinsForSlot2, () => coinSounds[1].play());
    startSpinning("slot3", spinsForSlot3, () => {
        coinSounds[2].play();
        checkWin();
    });

    function startSpinning(slotId, totalSpins, onComplete) {
        let spinCount = 0;
        let intervalId = setInterval(() => {
            spinCount++;
            if (spinCount >= totalSpins) {
                clearInterval(intervalId);
                onComplete();
                return;
            }

            let slotElement = document.getElementById(slotId);
            let currentClassNum = parseInt(slotElement.className.substring(1));
            slotElement.className = "a" + ((currentClassNum + 1) % 8);

            if (slotId === "slot3") {
                spinSounds[soundIndex].play();
                soundIndex = (soundIndex + 1) % spinSounds.length;
            }
        }, 50);
    }
}

function checkWin() {
    let slot1 = document.getElementById("slot1").className;
    let slot2 = document.getElementById("slot2").className;
    let slot3 = document.getElementById("slot3").className;

    let isWin = (slot1 === slot2 && slot2 === slot3) ||
                (slot1 === slot2 && slot3 === "a7") ||
                (slot1 === slot3 && slot2 === "a7") ||
                (slot2 === slot3 && slot1 === "a7") ||
                (slot1 === "a7" && slot1 === slot2) ||
                (slot1 === "a7" && slot1 === slot3) ||
                (slot2 === "a7" && slot2 === slot3);

    if (isWin && !(slot1 === slot2 && slot2 === slot3 && slot1 === "a7")) {
        statusElement.innerHTML = "YOU WIN!";
        winSound.play();
    } else {
        statusElement.innerHTML = "YOU LOSE!";
        loseSound.play();
    }
    isSpinning = false;
}

function toggleAudio() {
    audioEnabled = !audioEnabled;
    let volume = audioEnabled ? 0.5 : 0;

    spinSounds.forEach(sound => sound.volume = volume);
    coinSounds.forEach(sound => sound.volume = volume);
    winSound.volume = audioEnabled ? 1.0 : 0;
    loseSound.volume = audioEnabled ? 1.0 : 0;

    document.getElementById("audio").src = `res/icons/audio${audioEnabled ? "On" : "Off"}.png`;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}