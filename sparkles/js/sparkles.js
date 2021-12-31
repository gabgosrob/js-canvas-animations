let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let context = canvas.getContext("2d");
resetCanvas();

const sparklesPerClick = 30;
const gravity = 1;
let currentSparkles = [];

class Sparkle {
    constructor(x, y) {
        this.color = this.getRandomColor();
        this.x = x;
        this.y = y;
        this.radius = this.getRandomRadius();
        this.xVelocity = this.getRandomXVelocity();
        this.yVelocity = this.getRandomYVelocity();
    }

    getRandomColor() {
        let r = 255 - Math.random() * 254;
        let g = 255 - Math.random() * 254;
        let b = 255 - Math.random() * 254;
        return `rgb(${r},${g},${b})`
    }

    getRandomRadius() {
        return 6 - Math.random() * 4;
    }

    getRandomXVelocity() {
        return 10 - Math.random() * 20;
    }

    getRandomYVelocity() {
        return 10 - Math.random() * 30;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        this.x += this.xVelocity;
        this.y += this.yVelocity
        this.yVelocity += gravity;
        if (this.x < 0 || this.x > canvas.width) {
            this.xVelocity = -this.xVelocity;
        }
    }
}

function resetCanvas() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "30px serif";
    context.fillStyle = "white";
    context.fillText("Click for sparkles :)", 20, 50);
}

function createSparkles(event) {
    for (let i = 0; i < sparklesPerClick; i++){
        let newSparkle = new Sparkle(event.clientX, event.clientY);
        currentSparkles.push(newSparkle);
    }
}

function render() {
    setTimeout(function() {
        resetCanvas();
        let sparklesToKeep = []
        currentSparkles.forEach(sparkle => {
            sparkle.draw();
            if (sparkle.y < canvas.height) {
                sparklesToKeep.push(sparkle);
            }
        });

        currentSparkles = [...sparklesToKeep];

        requestAnimationFrame(render);
    }, 1000/60)
}

document.addEventListener("click", createSparkles)
render();
