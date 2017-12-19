const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const box_size = 32;

const ground = new Image();
ground.src="assets/img/ground.png";

const food_image = new Image();
food_image.src = "assets/img/food.png";

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

// To Do: replace with set() to see what happens
let snake = [];
snake[0] = {
    x : 9 * box_size,
    y : 9 * box_size
}

let food = createFood();
let score = 0;
let direction;

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.keyCode == 37 && direction != "RIGHT") {
        left.play();
        direction = "LEFT";
    } else if (event.keyCode == 38 && direction != "DOWN") {
        up.play();
        direction = "UP";
    } else if (event.keyCode == 39 && direction != "LEFT") {
        right.play();
        direction = "RIGHT";
    } else if (event.keyCode == 40 && direction != "UP") {
        down.play();
        direction = "DOWN";
    }
}

function collision(head, array) {
    // To Do: if array == set(), maybe use something like set().has(), idk
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
        context.fillRect(snake[i].x, snake[i].y, box_size, box_size);

        context.strokeStyle = "red";
        context.strokeRect(snake[i].x, snake[i].y, box_size, box_size);
    }

    context.drawImage(food_image, food.x, food.y);

    // capture the old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (direction == "LEFT") snakeX -= box_size;
    if (direction == "UP") snakeY -= box_size;
    if (direction == "RIGHT") snakeX += box_size;
    if (direction == "DOWN") snakeY += box_size;

    // if the snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eat.play();
        food = createFood();
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
    if (snakeX < box_size || snakeX > 17 * box_size || snakeY < 3 * box_size || snakeY > 17 * box_size || collision(newHead, snake)) {
        clearInterval(game);
        dead.play();
    }

    snake.unshift(newHead);

    context.fillStyle = "white";
    context.font = "45px Open Sans";
    context.fillText(score, 2 * box_size, 1.6 * box_size);
}

function createFood() {
    return {
        x : Math.floor(Math.random()*17+1) * box_size,
        y : Math.floor(Math.random()*15+3) * box_size,
    }
}

// call the draw function every 100 ms
let game = setInterval(draw, 100);
