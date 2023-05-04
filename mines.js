const minesGameBoard = document.getElementById('mines-game-board');
const startGameButton = document.getElementById('start-game-button');
const minesCountInput = document.getElementById('mines-count');
const cashOutButton = document.getElementById('cash-out-button');
const cashOutValue = document.getElementById('cash-out-value');
const betInput = document.getElementById('bet');
const balanceDisplay = document.getElementById('balance');

let board = [];
let remainingCells;
let cashOutMultiplier = 1;
let balance = 100;
let gameOver = false;



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
    gameOver = false;
    const minesCount = parseInt(minesCountInput.value);
    remainingCells = 25 - minesCount;
    cashOutMultiplier = 1;
    cashOutValue.textContent = cashOutMultiplier;

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
  
  function revealCell(cell) {
    if (cell.dataset.revealed === 'true' || gameOver) {
      return;
    }
  
    cell.dataset.revealed = 'true';
    cell.style.backgroundColor = '#444';
  
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
      cashOutMultiplier = 1 + (Math.pow((25 - parseInt(minesCountInput.value)), 2) - Math.pow(remainingCells, 2)) / Math.pow((25 - parseInt(minesCountInput.value)), 2) * 100;
      cashOutValue.textContent = cashOutMultiplier.toFixed(2);
  
      if (remainingCells === 0) {
        displayMessage('You won! All safe cells revealed.', '#4CAF50');
        gameOver = true;
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
    const cashOutAmount = parseFloat(betInput.value) * cashOutMultiplier;
    balance += cashOutAmount;
    balanceDisplay.textContent = balance.toFixed(2);
    alert('You cashed out with a multiplier of ' + cashOutMultiplier.toFixed(2));
    startGame();
}

createBoard();
startGame();

minesGameBoard.addEventListener('click', (event) => {
    if (event.target.classList.contains('mines-game-cell') && event.target.dataset.revealed !== 'true') {
        revealCell(event.target);
    }
});

startGameButton.addEventListener('click', startGame);
cashOutButton.addEventListener('click', cashOut);
