const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Bird properties
let bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 15,
    velocity: 0,
    gravity: 0.1, // Reduced gravity
    jumpStrength: -6.5 // Reduced jump strength
};

// Pipes properties
let pipes = [];
const pipeWidth = 50;
const pipeGap = 200; // Increased gap between pipes
let pipeInterval = 200; // Increased interval between pipe spawns
let pipeCount = Math.floor(canvas.width / pipeInterval);

// Game variables
let score = 0;
let gameover = true; // Game starts as over
let touchStart = false; // To handle touch start event

// Event listeners for touch input
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);

// Function to handle touch start
function handleTouchStart(event) {
    event.preventDefault();
    if (gameover) {
        startGame();
    } else {
        bird.velocity = bird.jumpStrength;
    }
    touchStart = true;
}

// Function to handle touch end
function handleTouchEnd(event) {
    event.preventDefault();
    bird.velocity = bird.gravity; // Resume gravity after touch end
}

// Function to start the game
function startGame() {
    gameover = false;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    for (let i = 0; i < pipeCount; i++) {
        let topHeight = Math.random() * (canvas.height - pipeGap);
        pipes.push({
            x: canvas.width + i * pipeInterval,
            top: topHeight,
            bottom: topHeight + pipeGap,
            scored: false
        });
    }
    requestAnimationFrame(gameLoop);
}

// Function to draw the bird
function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5733';
    ctx.fill();
    ctx.closePath();
}

// Function to draw pipes
function drawPipes() {
    ctx.fillStyle = '#006400';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
    });
}

// Function to move pipes to the left
function movePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if (pipes[0].x + pipeWidth <= 0) {
        pipes.shift();
        let topHeight = Math.random() * (canvas.height - pipeGap);
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + pipeGap
        });
    }
}

// Function to check for collisions
function checkCollisions() {
    if (bird.y - bird.radius <= 0 || bird.y + bird.radius >= canvas.height) {
        return true;
    }

    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth) {
            if (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom) {
                return true;
            }
        }
    }

    return false;
}

// Function to update game state
function update() {
    if (!gameover) {
        // Update bird's position
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        // Update pipes
        movePipes();

        // Check for collisions
        if (checkCollisions()) {
            endGame();
        }

        // Calculate score
        pipes.forEach(pipe => {
            if (bird.x > pipe.x + pipeWidth && !pipe.scored) {
                pipe.scored = true;
                score++;
            }
        });
    }
}

// Function to draw everything on canvas
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    drawBird();

    // Draw pipes
    drawPipes();

    // Draw score
    ctx.fillStyle = '#FFF'; // White color
    ctx.font = '24px Arial';
    ctx.fillText(`${score}`, 10, 30);

    // Draw game over message
    if (gameover && touchStart) {
        ctx.fillStyle = '#FF5733';
        ctx.fillText('Game Over', canvas.width / 2 - 60, canvas.height / 2 - 20);
        ctx.fillText(`${score}`, canvas.width / 2 - 20, canvas.height / 2 + 20);

        // Draw play again button
        ctx.fillStyle = '#006400';
        ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 40);
        ctx.fillStyle = '#FFF';
        ctx.font = '16px Arial';
        ctx.fillText('Play Again', canvas.width / 2 - 40, canvas.height / 2 + 74);
    }
}

// Function to end the game
function endGame() {
    gameover = true;
    touchStart = false;
}

// Main game loop
function gameLoop() {
    update();
    draw();

    if (!gameover) {
        requestAnimationFrame(gameLoop);
    }
}

// Initially draw the start screen
draw();
