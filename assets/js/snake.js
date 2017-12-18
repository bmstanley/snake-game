const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const box = 32;

const ground = new Image();
ground.src="assets/img/ground.png";

const foodImg = new Image();
foodImg.src = "assets/img/food.png";

const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();

dead.src = "assets/audio/dead.mp3";
eat.src = "assets/audio/eat.mp3";
up.src = "assets/audio/up.mp3";
left.src = "assets/audio/left.mp3";
right.src = "assets/audio/right.mp3";
down.src = "assets/audio/down.mp3";

let snake = [];
snake[0] = {
    x : 9 * box,
    y : 9 * box
}

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box,
}

let score = 0;

let d;

document.addEventListener("keydown", direction);

function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") {
        left.play();
        d = "LEFT";
    } else if (event.keyCode == 38 && d != "DOWN") {
        up.play();
        d = "UP";
    } else if (event.keyCode == 39 && d != "LEFT") {
        right.play();
        d = "RIGHT";
    } else if (event.keyCode == 40 && d != "UP") {
        down.play();
        d = "DOWN";
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    context.drawImage(ground, 0, 0);
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = (i == 0) ? "green" : "white";
        context.fillRect(snake[i].x, snake[i].y, box, box);

        context.strokeStyle = "red";
        context.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    context.drawImage(foodImg, food.x, food.y);

    // capture the old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box,
        }
    } else {
        // remove the tail
        snake.pop();
    }

    // add new head
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over
    if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)) {
        clearInterval(game);
        dead.play();
    }

    snake.unshift(newHead);

    context.fillStyle = "white";
    context.font = "45px Open Sans";
    context.fillText(score, 2 * box, 1.6 * box);
}

// call the draw function every 100 ms
let game = setInterval(draw, 100);
