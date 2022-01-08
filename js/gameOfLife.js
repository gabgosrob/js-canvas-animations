"use-strict";

const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight * 0.8;
canvas.width = canvas.height;
const context = canvas.getContext("2d");
const pausePlayImage = document.getElementById("pause-play");
const stopImage = document.getElementById("stop");

let isPlaying = false;
const fps = 5;
const rowSize = 30;
const cellSize = canvas.width / rowSize;
const rowAmount = canvas.height / cellSize
let board = [];

class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = false;
    }

    toggle() {
        if (this.alive) {
            this.alive =  false;
        }
        else {
            this.alive = true;
        }
    }

    setAlive() {
        this.alive = true;
    }

    setDead() {
        this.alive = false;
    }

    isAlive() {
        return this.alive;
    }

    draw() {
        context.fillStyle = "#0f0";
        context.fillRect(this.x, this.y, cellSize, cellSize);
    }
}

function togglePausePlay() {
    if (isPlaying) {
        isPlaying = false;
        pausePlayImage.src = "img/play.png";
    }
    else {
        isPlaying = true;
        pausePlayImage.src = "img/pause.png";
        play();
    }
}

function stop() {
    isPlaying = false;
    pausePlayImage.src = "img/play.png";
    board = createEmptyBoard();
    resetCanvas();
}

function play() {
    setTimeout(function() {
        drawBoard();

        const futureBoard = createEmptyBoard();

        for (let i = 1; i < rowAmount - 1; i++) {
            for (let j = 1; j < rowSize - 1; j++) {
                // update current cell
                let aliveNeighbours = 0;
                for (let k = -1; k < 2; k++)
                    for (let l = -1; l < 2; l++)
                        if (board[i+k][j+l].isAlive() & !(k == 0 && l == 0)) {
                            aliveNeighbours++;
                        }

                //rules of life
                let isAlive = board[i][j].isAlive();
                if (isAlive && aliveNeighbours < 2){
                    futureBoard[i][j].setDead();
                }
                else if (isAlive && aliveNeighbours > 3) {
                    futureBoard[i][j].setDead();
                }
                else if (!isAlive && aliveNeighbours == 3) {
                    futureBoard[i][j].setAlive();
                }
                else {
                    futureBoard[i][j] = board[i][j];
                }
            }
        }

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j] = futureBoard[i][j];
            }
        }

        if (isPlaying){
            requestAnimationFrame(play);
        }
        else {
            drawBoard();
        }
    }, 1000/fps)
}

function drawBoard() {
    resetCanvas();
    for (let i = 0; i < rowAmount; i++) {
        for (let j = 0; j < rowSize; j++) {
            if (board[i][j].isAlive()) {
                board[i][j].draw();
            }
        }
    }
}

function createEmptyBoard() {
    let newBoard = [];
    for (let i = 0; i < rowAmount; i++) {
        let newRow = [];
        for (let j = 0; j < rowSize; j++) {
            let newCell = new Cell(j*cellSize, i*cellSize);
            newRow.push(newCell);
        }

        newBoard.push(newRow)
    }

    return newBoard;
}

function resetCanvas() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < rowSize; i++) {
        context.strokeStyle = "rgba(255, 255, 255, 0.5)";
        context.beginPath();
        
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, canvas.height);
        context.stroke();

        context.moveTo(0, i * cellSize);
        context.lineTo(canvas.width, i * cellSize);
        context.stroke();
    }
}

function getClickedCellIndexes(x, y) {
    const rowIndex = Math.floor(y / cellSize);
    const columnIndex = Math.floor(x / cellSize);

    return [rowIndex, columnIndex];
}

canvas.addEventListener('click', e => {
    // get relative x and y
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cellIndexes = getClickedCellIndexes(x, y);
    const rowIndex = cellIndexes[0];
    const columnIndex = cellIndexes[1];
    board[rowIndex][columnIndex].toggle();
    drawBoard();
});

pausePlayImage.addEventListener("click", togglePausePlay);

stopImage.addEventListener("click", stop)

document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        togglePausePlay();
    }
    if (event.key === 'r') {
        stop();
    }
});

board = createEmptyBoard();
resetCanvas();
