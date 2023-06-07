const minesGameBoard = document.getElementById('mines-game-board');
const startGameButton = document.getElementById('start-game-button');
const minesCountInput = document.getElementById('mines-count');
const cashOutButton = document.getElementById('cash-out-button');
const cashOutValue = document.getElementById('cash-out-value');
const betInput = document.getElementById('bet');
const balanceDisplay = document.getElementById('balance');
const allInButton = document.getElementById('all-in-button');
const confirmationDialog = document.getElementById('confirmation-dialog');
const confirmAllInButton = document.getElementById('confirm-all-in');
const cancelAllInButton = document.getElementById('cancel-all-in');

let board = [];
let remainingCells;
let cashOutMultiplier = 1;
let balance = 100;
let gameOver = false;


function showAllInConfirmation() {
    confirmationDialog.style.display = 'flex';
}

function hideAllInConfirmation() {
    confirmationDialog.style.display = 'none';
}

function allIn() {
    showAllInConfirmation();
}

confirmAllInButton.addEventListener('click', () => {
    betInput.value = balance.toFixed(2);
    hideAllInConfirmation();
});

cancelAllInButton.addEventListener('click', () => {
    hideAllInConfirmation();
});
function createBoard() {
    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.classList.add('mines-game-row');
        minesGameBoard.appendChild(row);
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('mines-game-cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.revealed = 'false';
            row.appendChild(cell);
        }
    }
}

function startGame() {
    const betValue = parseFloat(betInput.value);
    if (balance < betValue || balance === 0) {
        displayMessage("Insufficient balance to start a new game", "#F44336");
        return;
    }
    gameOver = false;
    const minesCount = parseInt(minesCountInput.value);
    remainingCells = 25 - minesCount;
    cashOutMultiplier = 1;
    cashOutValue.textContent = cashOutMultiplier;
    cashOutButton.disabled = true;
    
    // Clear mines and reset data attributes
    const cells = document.querySelectorAll('.mines-game-cell');
    cells.forEach(cell => {
        cell.dataset.mine = 'false';
        cell.dataset.revealed = 'false';
        cell.style.backgroundColor = '#1e1e1e';
        cell.textContent = ""; // Added: Clear the cell content (Bomb or Checkmark)
    });

    // Reset board array
    board = []; // Added: Reset the board array

    // Place mines randomly
    for (let i = 0; i < minesCount; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 5);
            col = Math.floor(Math.random() * 5);
        } while (board[row] && board[row][col] && board[row][col].dataset.mine === 'true');
        
        if (!board[row]) {
            board[row] = [];
        }
        board[row][col] = cells[row * 5 + col];
        board[row][col].dataset.mine = 'true';
    }
}
const messageElement = document.createElement('div');
messageElement.style.display = 'none';
messageElement.style.fontSize = '16px';
messageElement.style.marginTop = '10px';
minesGameBoard.insertAdjacentElement('afterend', messageElement);

function displayMessage(text, color) {
    const messageContainer = document.querySelector('.message-container');
    messageContainer.textContent = text;
    messageContainer.style.color = color;
    messageContainer.style.display = 'block';
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 3000);
  }
  function calculateMultiplier(totalMines, remainingCells) {
    if (remainingCells === 0) return 0;

    const totalSafeCells = 25 - totalMines;
    const openedCells = totalSafeCells - remainingCells;

    const maxMultiplier = totalMines === 24 ? 25 : 1 + totalSafeCells / totalMines;
    const baseMultiplier = 1 + (0.15 * totalMines) / 25;
    const riskFactor = (maxMultiplier - baseMultiplier) / (Math.pow(totalSafeCells - 1, 2));

    return baseMultiplier + (riskFactor * Math.pow(openedCells, 2));
}
function updateCashOutMultiplier() {
  const totalMines = parseInt(minesCountInput.value);
  cashOutMultiplier = calculateMultiplier(totalMines, remainingCells);
  cashOutValue.textContent = cashOutMultiplier.toFixed(2);

  // Enable/disable the cash out button
  cashOutButton.disabled = cashOutMultiplier <= 1;
}
  function revealCell(cell) {
    if (cell.dataset.revealed === 'true' || gameOver) {
      return;
    }
  
    cell.dataset.revealed = 'true';
    cell.style.backgroundColor = '#444';
    if (remainingCells === 0) {
        const cashOutAmount = parseFloat(betInput.value) * cashOutMultiplier;
        balance += cashOutAmount;
        balanceDisplay.textContent = balance.toFixed(2);
        displayMessage(`You won! All safe cells revealed. Cash out amount: ${cashOutAmount.toFixed(2)}`, '#4CAF50');
        gameOver = true;
    }
    if (cell.dataset.mine === 'true') {
      cell.textContent = '💣';
      displayMessage('You hit a mine! Game over!', '#F44336');
      balance -= parseFloat(betInput.value);
      balanceDisplay.textContent = balance.toFixed(2);
      revealAllMines();
      gameOver = true;
  
      cashOutMultiplier = 0;
      cashOutValue.textContent = cashOutMultiplier.toFixed(2);
    } else {
      remainingCells--;

        updateCashOutMultiplier();
      const totalMines = parseInt(minesCountInput.value);
        cashOutMultiplier = calculateMultiplier(totalMines, remainingCells);
        cashOutValue.textContent = cashOutMultiplier.toFixed(2);

        // Enable/disable the cash out button
        cashOutButton.disabled = cashOutMultiplier <= 1;
      if (remainingCells === 0) {
        const cashOutAmount = parseFloat(betInput.value) * cashOutMultiplier;
        balance += cashOutAmount;
        balanceDisplay.textContent = balance.toFixed(2);
        displayMessage(`You won! All safe cells revealed. Cash out amount: ${cashOutAmount.toFixed(2)}`, '#4CAF50');

        setTimeout(() => {
            startGame();
        }, 3000);
      }
    }
  }

function revealAllMines() {
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.dataset.mine === 'true' && cell.dataset.revealed !== 'true') {
          cell.dataset.revealed = 'true';
          cell.style.backgroundColor = '#444';
          cell.textContent = '💣';
        }
      });
    });
  }

  function cashOut() {
    revealAllMines(); // Reveal all mines when cashing out
    const cashOutAmount = parseFloat(betInput.value) * cashOutMultiplier;
    balance += cashOutAmount;
    if (balance < 0) {
        balance = 0;
    }
    balanceDisplay.textContent = balance.toFixed(2);

    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const messageOkButton = document.getElementById('message-ok-button');

    messageText.textContent = 'You cashed out with a multiplier of ' + cashOutMultiplier.toFixed(2);
    messageBox.style.display = 'block';
    messageOkButton.onclick = () => {
        messageBox.style.display = 'none';
        startGame();
    };
}

createBoard();
startGame();

minesGameBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('mines-game-cell') && event.target.dataset.revealed !== 'true') {
        revealCell(event.target);
    }
});
betInput.addEventListener("input", () => {
    const betValue = parseFloat(betInput.value);
    startGameButton.disabled = balance < betValue || balance === 0;
});

// Add an event listener to update the bet input's max value based on balance
balanceDisplay.addEventListener("DOMSubtreeModified", () => {
    balance = parseFloat(balanceDisplay.textContent);
    betInput.max = balance;
});

// Disable the "Start Game" button initially if balance is smaller than the bet or balance is 0
startGameButton.disabled = balance < parseFloat(betInput.value) || balance === 0;
startGameButton.addEventListener('click', startGame);
cashOutButton.addEventListener('click', cashOut);
allInButton.addEventListener('click', allIn);
