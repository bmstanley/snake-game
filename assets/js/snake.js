const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

const keyCodeDown = { keyCode: 40, key: 'ArrowDown' };
const keyCodeUp = { keyCode: 38, key: 'ArrowUp' };
const keyCodeRight = { keyCode: 39, key: 'ArrowRight' };
const keyCodeLeft = { keyCode: 37, key: 'ArrowLeft' };

const box_size = 32;
const playable_area_height = 15;
const playable_area_width = 17;
const left_offset = 1;
const top_offset = 3;

const left_boundary = box_size;
const right_boundary = playable_area_width * box_size;
const top_boundary = top_offset * box_size;
const bottom_boundary = (top_offset + playable_area_height - 1) * box_size;

const ground = new Image();
ground.src="assets/img/ground.png";

const food_image = new Image();
food_image.src = "assets/img/food.png";

const dead_audio = new Audio();
const eat_audio = new Audio();
const up_audio = new Audio();
const down_audio = new Audio();
const left_audio = new Audio();
const right_audio = new Audio();

dead_audio.src = "assets/audio/dead.mp3";
eat_audio.src = "assets/audio/eat.mp3";
up_audio.src = "assets/audio/up.mp3";
down_audio.src = "assets/audio/down.mp3";
left_audio.src = "assets/audio/left.mp3";
right_audio.src = "assets/audio/right.mp3";

let snake = [];
snake[0] = {
    x : 9 * box_size,
    y : 9 * box_size
}

let food = createFood();
let score = 0;
let direction;

let game_running = true;

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (game_running === false) {
        return false;
    }
    if (event.key == keyCodeLeft.key && direction != "RIGHT") {
        left_audio.play();
        direction = "LEFT";
    } else if (event.key == keyCodeUp.key && direction != "DOWN") {
        up_audio.play();
        direction = "UP";
    } else if (event.key == keyCodeRight.key && direction != "LEFT") {
        right_audio.play();
        direction = "RIGHT";
    } else if (event.key == keyCodeDown.key && direction != "UP") {
        down_audio.play();
        direction = "DOWN";
    }
}

function collision(needle, haystack) {
    for (let i = 0, len = haystack.length; i < len; i++) {
        if (needle.x == haystack[i].x && needle.y == haystack[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    context.drawImage(ground, 0, 0);
    for (let i = 0, len = snake.length; i < len; i++) {
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
        eat_audio.play();
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
    if (snakeX < left_boundary || snakeX > right_boundary || snakeY < top_boundary || snakeY > bottom_boundary || collision(newHead, snake)) {
        clearInterval(game);
        dead_audio.play();
        game_running = false;
    }

    snake.unshift(newHead);

    context.fillStyle = "white";
    context.font = "45px Open Sans";
    // offset the score text by 2 boxes on left and 1.7 boxes on top
    context.fillText(score, box_size * 2, box_size * 1.7);

    autoplay();
}

function createFood() {
    do {
        var potential = {
            x : Math.floor(Math.random() * playable_area_width + left_offset) * box_size,
            y : Math.floor(Math.random() * playable_area_height + top_offset) * box_size,
        }
    } while (collision(potential, snake));
    return potential;
}

function autoplay() {
    if (snake[0].x == food.x) {
        if (snake[0].y < food.y) {
            if (direction == "UP") {
                triggerKeydown(keyCodeLeft);
            } else {
                triggerKeydown(keyCodeDown);
            }
        } else if (snake[0].y > food.y) {
            if (direction == "DOWN") {
                triggerKeydown(keyCodeLeft);
            } else {
                triggerKeydown(keyCodeUp);
            }
        }
    } else if (snake[0].y == food.y) {
        if (snake[0].x < food.x) {
            if (direction == "LEFT") {
                triggerKeydown(keyCodeUp);
            } else {
                triggerKeydown(keyCodeRight);
            }
        } else if (snake[0].x > food.x) {
            if (direction == "RIGHT") {
                triggerKeydown(keyCodeUp);
            } else {
                triggerKeydown(keyCodeLeft);
            }
        }
    } else if (snake[0].x == left_boundary && snake[0].y == top_boundary) {
        if (direction == "UP") {
            triggerKeydown(keyCodeRight);
        } else {
            triggerKeydown(keyCodeDown);
        }
    } else if (snake[0].x == left_boundary && snake[0].y == bottom_boundary) {
        if (direction == "DOWN") {
            triggerKeydown(keyCodeRight);
        } else {
            triggerKeydown(keyCodeUp);
        }
    } else if (snake[0].x == right_boundary && snake[0].y == top_boundary) {
        if (direction == "UP") {
            triggerKeydown(keyCodeLeft);
        } else {
            triggerKeydown(keyCodeDown);
        }
    } else if (snake[0].x == right_boundary && snake[0].y == bottom_boundary) {
        if (direction == "DOWN") {
            triggerKeydown(keyCodeLeft);
        } else {
            triggerKeydown(keyCodeUp);
        }
    } else if (snake[0].x == left_boundary) {
        triggerKeydown(keyCodeDown);
    } else if (snake[0].x == right_boundary) {
        triggerKeydown(keyCodeDown);
    } else if (snake[0].y == top_boundary) {
        triggerKeydown(keyCodeLeft);
    } else if (snake[0].y == bottom_boundary) {
        triggerKeydown(keyCodeRight);
    }
}

function triggerKeydown(code) {
    let event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        code: code.key,
        composed: true,
        key: code.key
    });
    document.dispatchEvent(event);
}

// call the draw function every 100 ms
let game = setInterval(draw, 100);
