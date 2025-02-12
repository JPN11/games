const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('gameBoard');
const restartButton = document.getElementById('restartButton');
let currentPlayer = 'X';
let aiPlayer = 'O'; 
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    if (currentPlayer === aiPlayer) {
        return; 
    }
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    boardState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkWinner();
    updateMessageDisplay(); 
    currentPlayer = currentPlayer === 'X' ? aiPlayer : 'X'; 
    if (currentPlayer === aiPlayer) {
        aiMove(); 
    }
}

function aiMove() {
    const availableCells = Array.from(cells).filter(cell => cell.textContent === '');
    if (availableCells.length === 0) return; 

    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    const randomCellIndex = Array.from(cells).indexOf(randomCell);
    
    boardState[randomCellIndex] = aiPlayer;
    randomCell.textContent = aiPlayer;

    checkWinner();
    currentPlayer = 'X'; 
    updateMessageDisplay(); 
}

function updateMessageDisplay() {
    const messageDisplay = document.getElementById('messageDisplay');
    messageDisplay.textContent = `Current Player: ${currentPlayer}`; 
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] === '' || boardState[b] === '' || boardState[c] === '') {
            continue;
        }
        if (boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        alert(`Player ${currentPlayer === 'O' ? 'X' : 'O'} wins!`);
        gameActive = false;
        return;
    }

    if (!boardState.includes('')) {
        alert("It's a draw!");
        gameActive = false;
    }
}

function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);