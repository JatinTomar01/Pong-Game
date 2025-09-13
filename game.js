const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;
const PADDLE_SPEED = 6;
const BALL_SPEED = 5;

// State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);

// Mouse paddle control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center line
    ctx.strokeStyle = '#444';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Player paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // AI paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Collision detection
function collide(paddleX, paddleY) {
    return (
        ballX < paddleX + PADDLE_WIDTH &&
        ballX + BALL_SIZE > paddleX &&
        ballY < paddleY + PADDLE_HEIGHT &&
        ballY + BALL_SIZE > paddleY
    );
}

// Game logic
function update() {
    // Move ball
    ballX += ballVX;
    ballY += ballVY;

    // Ball collision with top/bottom walls
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVY = -ballVY;
        ballY = ballY <= 0 ? 0 : canvas.height - BALL_SIZE;
    }

    // Ball collision with player paddle
    if (collide(PLAYER_X, playerY)) {
        ballVX = Math.abs(ballVX);
        // Add some "spin" depending on where the ball hit the paddle
        let collidePoint = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballVY += collidePoint * 0.15;
    }

    // Ball collision with AI paddle
    if (collide(AI_X, aiY)) {
        ballVX = -Math.abs(ballVX);
        let collidePoint = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballVY += collidePoint * 0.15;
    }

    // Ball out of bounds (left or right)
    if (ballX < 0 || ballX > canvas.width) {
        // Reset ball
        ballX = canvas.width / 2 - BALL_SIZE / 2;
        ballY = canvas.height / 2 - BALL_SIZE / 2;
        ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        ballVY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    }

    // Simple AI: move paddle toward ball
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    let ballCenter = ballY + BALL_SIZE / 2;
    if (aiCenter < ballCenter - 10) {
        aiY += PADDLE_SPEED;
    } else if (aiCenter > ballCenter + 10) {
        aiY -= PADDLE_SPEED;
    }
    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();