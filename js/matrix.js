let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext("2d");
context.fillStyle = "black";
context.fillRect(0, 0, canvas.width, canvas.height);

const maxLetters = window.innerWidth / 15;
const LETTERS = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X",
    "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
    "w", "x", "y", "z"
]
let currentLetters = [];

class Letter {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "rgb(130, 255, 0)";
        this.fontSize = 30;
    }

    update() {
        context.fillStyle = this.color;
        context.font = this.fontSize + "px Matrix";
        context.fillText(
            LETTERS[Math.floor(Math.random() * LETTERS.length)],
            this.x,
            this.y
        )
        this.y += this.fontSize * 0.8;
        if (this.y >= canvas.height) {
            this.changePosition();
        }
    }

    changePosition() {
        this.x = this.getRandomX();
        this.y = 0
    }

    getRandomX() {
        return Math.random() * canvas.width;
    }
}

function render() {
    setTimeout(function() {
        makeEverythingMoreTransparent();
        if (currentLetters.length < maxLetters) {
            let newLetter = new Letter(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            currentLetters.push(newLetter);
        }

        currentLetters.forEach(letter => {
            letter.update();
        });

        requestAnimationFrame(render);
    }, 1000/20)
    
}

function makeEverythingMoreTransparent() {
    // paint over everything with a bit of transparency
    context.fillStyle = "rgba(0, 0, 0, 0.18)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

render();
