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

    // Display All Predictions
    let tableBody = document.getElementById("prediction-table");
    tableBody.innerHTML = "";
    
    predictions.forEach(entry => {
        let row = `<tr><td>${entry.name}</td><td>${entry.prediction}</td></tr>`;
        tableBody.innerHTML += row;
    });

    document.getElementById("market-turnover-value").innerText = marketTurnover;
    document.getElementById("all-predictions").style.display = "block";

    // Store daily winner
    const today = new Date().toLocaleDateString();
    dailyWins[today] = closest;
    localStorage.setItem("dailyWins", JSON.stringify(dailyWins));

    document.getElementById("winnerDisplay").textContent = `Today's Winner: ${closest} 🎉`;
    document.getElementById("winnerDisplay").classList.add("winner");

    // Check for Grand Winner
    checkGrandWinner();
}

function checkGrandWinner() {
    let winCount = {};
    Object.values(dailyWins).forEach(name => {
        winCount[name] = (winCount[name] || 0) + 1;
    });

    let grandWinner = Object.keys(winCount).reduce((a, b) => winCount[a] > winCount[b] ? a : b, "");

    if (Object.keys(dailyWins).length >= 30) {
        document.getElementById("grandWinnerDisplay").textContent = `Grand Winner: ${grandWinner} 🏆`;
        document.getElementById("grandWinnerDisplay").classList.add("grand-winner");
    }
}
