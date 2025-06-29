//<div class="cell" data-index="0"></div>


// BOARD FUNCTIONS

const setBoardSize = () => {
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
}


const resetBoard = () => {
    gameBoard.innerHTML = '';
    countCell = 0;
    setBoardSize();
}


const whoStart = () => {
    if (Math.floor(Math.random() * 100) % 2 === 0) {
        player1.parentNode.classList.add('player-turn');
        player2.parentNode.classList.remove('player-turn');
    } else {
        player2.parentNode.classList.add('player-turn');
        player1.parentNode.classList.remove('player-turn');
    }

    return player1.parentNode.classList.contains('player-turn') ? '1' : '2';
}



const eventHandlerCellClick = (cell, del=false) => {
    if (!cell._setEvent) {
        cell._setEvent = e => {
            playerTurn(cell);
            eventHandlerCellClick(cell, true);
        }
    }

    if (del) {
        cell.removeEventListener('click', cell._setEvent);
        return;
    }
    cell.addEventListener('click', cell._setEvent);

}

const createCell = () => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.setAttribute('data-index', countCell);

    eventHandlerCellClick(cell);

    gameBoard.appendChild(cell);
    countCell++;
    
}


// GAME FUNCTIONS

function setStyle(player) {
    if (player === '1') {
        player1.parentNode.classList.remove('player-turn');
        player2.parentNode.classList.add('player-turn');
    } else {
        player2.parentNode.classList.remove('player-turn');
        player1.parentNode.classList.add('player-turn');
    }
}

function setSymbol(player, cell) {
    if (player === '1') {
        cell.classList.add('player1');
        cell.textContent = player1.textContent;
    } else {
        cell.classList.add('player2');
        cell.textContent = player2.textContent;
    }
}

function playerTurn(cell) {
    if (!isGame) return;

    let player = player1.parentNode.classList.contains('player-turn') ? '1' : '2';
    turn++;

    setSymbol(player, cell);

    if (isWin()) { 
        return endGame(player);
    }
    
    if (turn === boardSize * boardSize) {
        return endGame('draw');
    }

    setStyle(player);


}




function checkRows() {
    const conditions = [];

    for (let row = 0; row < boardSize; row++) {
        for (let dec=0; dec<=boardSize-3; dec++) {
            conditions.push([row * boardSize + dec, row * boardSize + dec + 1, row * boardSize + dec + 2]);   
        }
    }

    return conditions;
}

function checkColumns() {
    const conditions = [];
    for (let col = 0; col < boardSize; col++) {
        for (let dec=0; dec<=boardSize-3; dec++) {
            conditions.push([col + dec * boardSize, col + (dec + 1) * boardSize, col + (dec + 2) * boardSize]);   
        }
    }

    return conditions;
}

function checkDiagonals() {
    const conditions = [];

    for (let row=0; row <= boardSize - 3; row++) {
        for (let col=0; col <= boardSize - 3; col++) {
            // Main diagonal
            conditions.push([row * boardSize + col, (row + 1) * boardSize + (col + 1), (row + 2) * boardSize + (col + 2)]);
            // Anti diagonal
            conditions.push([(row + 2) * boardSize + col, (row + 1) * boardSize + (col + 1), row * boardSize + (col + 2)]);
        }
    }

    return conditions;  
}

function isWin() {
    const conditions = []

    conditions.push(...checkRows());
    conditions.push(...checkColumns());
    conditions.push(...checkDiagonals());

    return conditions.some(condition => {
        const [a, b, c] = condition;
        const cellA = document.querySelector(`.cell[data-index="${a}"]`);
        const cellB = document.querySelector(`.cell[data-index="${b}"]`);
        const cellC = document.querySelector(`.cell[data-index="${c}"]`);

        return cellA.textContent &&
               cellA.textContent === cellB.textContent &&
                cellA.textContent === cellC.textContent;
    });
}


function endGame(player) {
    document.querySelectorAll('.cell').forEach(cell => {
        eventHandlerCellClick(cell, true);
    });
    isGame = false;

    document.getElementById("shadow-layer").style.display = "flex";

    if (player === '1') {
        player1Score.textContent = parseInt(player1Score.textContent) + 1;
        winner.textContent = "Player 1 won !";
    } else if (player === '2') {
        player2Score.textContent = parseInt(player2Score.textContent) + 1;
        winner.textContent = "Player 2 won !";
    } else {
        winner.textContent = "It's a draw !";
    }

    saveScore();
}

function resetGame() {
    isGame = true;
    turn = 0;
    document.getElementById("shadow-layer").style.display = "none";
    
    loaded(null);

    player1.parentNode.classList.add('player-turn');
    player2.parentNode.classList.remove('player-turn');
}


// LOADING FUNCTIONS

function saveScore() {
    localStorage.setItem('player1Score', player1Score.textContent);
    localStorage.setItem('player2Score', player2Score.textContent);
}

function loadScore() {
    if (localStorage.getItem('player1Score')) {
        player1Score.textContent = localStorage.getItem('player1Score');
    }

    if (localStorage.getItem('player2Score')) {
        player2Score.textContent = localStorage.getItem('player2Score');
    }
}

function loaded(e) {

    if (localStorage.getItem('boardSize')) {
        boardSize = parseInt(localStorage.getItem('boardSize'), 10);
    }

    if (localStorage.getItem('player1Name')) {
        document.getElementById("player1Label").textContent = localStorage.getItem('player1Name')+":";
    }
    if (localStorage.getItem('player2Name')) {
        document.getElementById("player2Label").textContent = localStorage.getItem('player2Name')+":";
    }

    loadScore();
    
    setBoardSize();
    resetBoard();

    for (let i = 0; i < boardSize * boardSize; i++) {
        createCell();
    }

    whoStart();
}


const gameBoard = document.getElementById('game-board'),
gameHeader = document.getElementById('game-header'),
player1 = document.getElementById('player1'),
player2 = document.getElementById('player2'),
player1Score = document.getElementById('player1-score'),
player2Score = document.getElementById('player2-score'),
winner = document.getElementById("winner");





let countCell = 0,
boardSize = 3;
isGame = true,
turn = 0;

if (!localStorage.getItem('player1Name')) {
    localStorage.setItem('player1Name', 'Player 1');
}
if (!localStorage.getItem('player2Name')) {
    localStorage.setItem('player2Name', 'Player 2');
}



document.addEventListener('DOMContentLoaded', loaded);