let balance = 1000;
const riskSlider = document.getElementById("risk");
const riskValue = document.getElementById("risk-value");

function calculateMultiplier(risk) {
    return 100 / (100 - risk);
}

function updateBalanceBoxColor(isWin) {
    const balanceBox = document.getElementById("balance-box");
    if (isWin) {
        balanceBox.style.backgroundColor = "#4CAF50";
    } else {
        balanceBox.style.backgroundColor = "#F44336";
    }
    setTimeout(() => {
        balanceBox.style.backgroundColor = "#333";
    }, 1000);
}

function betMin() {
    document.getElementById("bet").value = 1;
}

function allIn() {
    showConfirmationDialog();
}
function showConfirmationDialog() {
    document.getElementById("confirmation-dialog").style.display = "block";
}

function closeConfirmationDialog() {
    document.getElementById("confirmation-dialog").style.display = "none";
}

function confirmAllIn() {
    document.getElementById("bet").value = balance;
    closeConfirmationDialog();
}


function rollDice() {
    const bet = parseInt(document.getElementById("bet").value);
    const risk = parseInt(riskValue.value);
    const dice = document.getElementById("dice");
    const balanceElement = document.getElementById("balance");
    const resultElement = document.getElementById("result");

    if (bet < 1 || bet > balance) {
        alert("Invalid bet amount.");
        return;
    }

    if (risk < 1 || risk > 99) {
        alert("Invalid risk value.");
        return;
    }
    dice.classList.add("roll");
    setTimeout(() => {
        dice.classList.remove("roll");
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const multiplier = calculateMultiplier(risk);
        const winAmount = Math.round(bet * (multiplier - 1));

        dice.textContent = randomNumber;

        if (randomNumber > risk) {
            balance += winAmount;
            resultElement.textContent = "You won! +" + winAmount + " coins";
            updateBalanceBoxColor(true);
        } else {
            balance -= bet;
            resultElement.textContent = "You lost! -" + bet + " coins";
            updateBalanceBoxColor(false);
        }
        balanceElement.textContent = balance;
        addHistoryItem(randomNumber, bet, risk, randomNumber > risk ? winAmount : -bet);
    }, 300);
}

function updateRiskValuePosition() {
    const sliderWidth = riskSlider.clientWidth;
    const offset = (riskSlider.value / riskSlider.max) * sliderWidth;
    riskValue.style.left = `${offset}px`;
}

function addHistoryItem(rolledNumber, betAmount, risk, profit) {
    const historyList = document.querySelector("#history-list");
    const historyItem = document.createElement("li");
    historyItem.classList.add("history-item");

    if (profit > 0) {
        historyItem.classList.add("win");
    } else {
        historyItem.classList.add("loss");
    }

    historyItem.innerHTML = `
        <div>Risk: ${risk}%</div>
        <div>Bet Amount: ${betAmount} Coins</div>
        <div>${profit > 0 ? "Won" : "Lost"}: ${Math.abs(profit)} Coins</div>
        <div>Rolled: ${rolledNumber}</div>
    `;

    historyList.insertBefore(historyItem, historyList.firstChild);
}

riskSlider.addEventListener("input", () => {
    riskValue.value = riskSlider.value;
    updateRiskValuePosition();
});

updateRiskValuePosition();
