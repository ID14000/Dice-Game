const minesGameBoard = document.getElementById('mines-game-board');
const startGameButton = document.getElementById('start-game-button');
const minesCountInput = document.getElementById('mines-count');
const cashOutButton = document.getElementById('cash-out-button');
const cashOutValue = document.getElementById('cash-out-value');

let board = [];
let remainingCells;
let cashOutMultiplier = 1;

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
    });

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

function revealCell(cell) {
    if (cell.dataset.revealed === 'true') {
        return;
    }

    cell.dataset.revealed = 'true';
    cell.style.backgroundColor = '#444';

    if (cell.dataset.mine === 'true') {
        cell.style.backgroundColor = '#F44336';
        alert('You hit a mine! Game over!');
        startGame();
    } else {
        remainingCells--;
        cashOutMultiplier += (1 / (25 - parseInt(minesCountInput.value))) * 100;
        cashOutValue.textContent = cashOutMultiplier.toFixed(2);

        if (remainingCells === 0) {
            alert('You won! All safe cells revealed.');
            startGame();
        }
    }
}

function cashOut() {
    // Do something with cashOutMultiplier, for example, add it to the user's balance
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
