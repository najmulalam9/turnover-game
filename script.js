let predictions = [];
let marketTurnover = null;

// Load past data from local storage
let dailyWins = JSON.parse(localStorage.getItem("dailyWins")) || {};

// Handle Predictions Submission
document.getElementById("predictionForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const prediction = parseFloat(document.getElementById("prediction").value);
    
    predictions.push({ name, prediction });
    
    alert(`${name}'s prediction submitted!`);
});

// Handle Market Turnover Submission (Only Shakil)
document.getElementById("marketForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const enteredTurnover = parseFloat(document.getElementById("marketTurnover").value);
    const name = document.getElementById("name").value;

    // Ensure only Shakil can submit market turnover
    if (name !== "Shakil") {
        alert("Only Shakil can enter the Market Turnover!");
        return;
    }

    marketTurnover = enteredTurnover;
    
    // Find the closest prediction
    findWinner();
});

// Function to Find Daily Winner
function findWinner() {
    if (marketTurnover === null || predictions.length === 0) {
        alert("Please enter market turnover and predictions first!");
        return;
    }

    let closest = null;
    let closestDiff = Infinity;

    predictions.forEach(entry => {
        let diff = Math.abs(entry.prediction - marketTurnover);
        if (diff < closestDiff) {
            closestDiff = diff;
            closest = entry.name;
        }
    });

    // Store daily winner in local storage
    const today = new Date().toLocaleDateString();
    dailyWins[today] = closest;
    localStorage.setItem("dailyWins", JSON.stringify(dailyWins));

    // Display Winner with Animation
    const winnerDisplay = document.getElementById("winnerDisplay");
    winnerDisplay.textContent = `Today's Winner: ${closest} 🎉`;
    winnerDisplay.classList.add("winner");

    // Check for Grand Winner (After 30 Days)
    checkGrandWinner();
}

// Function to Determine Grand Winner
function checkGrandWinner() {
    let winCount = {};

    // Count how many times each user has won
    Object.values(dailyWins).forEach(name => {
        winCount[name] = (winCount[name] || 0) + 1;
    });

    // Find user with max wins
    let grandWinner = Object.keys(winCount).reduce((a, b) => winCount[a] > winCount[b] ? a : b, "");

    if (Object.keys(dailyWins).length >= 30) {
        document.getElementById("grandWinnerDisplay").textContent = `Grand Winner: ${grandWinner} 🏆`;
        document.getElementById("grandWinnerDisplay").classList.add("grand-winner");
    }
}
