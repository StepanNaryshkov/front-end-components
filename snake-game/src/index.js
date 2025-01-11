          // HighScoreService to handle high score storage
          class HighScoreService {
            async getHighScore() {
                // Simulate async behavior for localStorage
                return new Promise((resolve) => {
                    const highScore = localStorage.getItem("highScore");
                    resolve(highScore ? parseInt(highScore, 10) : 0);
                });
            }

            async updateHighScore(newHighScore) {
                // Simulate async behavior for localStorage
                return new Promise((resolve) => {
                    localStorage.setItem("highScore", newHighScore);
                    resolve();
                });
            }
        }

        // SnakeGame class
        class SnakeGame {
            constructor({ canvasId, width, height, gridSize, speed, highScoreService }) {
                this.canvas = document.getElementById(canvasId);
                this.ctx = this.canvas.getContext("2d");
                this.canvas.width = width;
                this.canvas.height = height;

                this.width = width;
                this.height = height;
                this.gridSize = gridSize;
                this.speed = speed;

                this.score = 0;
                this.highScore = 0; // Default value; will be fetched from HighScoreService
                this.isPaused = false;
                this.gameOver = false;
                this.lastRenderTime = 0;
                this.snake = [{ x: 0, y: 0 }];
                this.food = this.generateFood();

                this.directions = {
                    UP: "UP",
                    DOWN: "DOWN",
                    LEFT: "LEFT",
                    RIGHT: "RIGHT",
                };

                this.buttonMap = {
                    ArrowUp: document.getElementById("upButton"),
                    ArrowDown: document.getElementById("downButton"),
                    ArrowLeft: document.getElementById("leftButton"),
                    ArrowRight: document.getElementById("rightButton"),
                };

                this.currentDirection = this.directions.RIGHT;

                this.highScoreService = highScoreService; // Inject HighScoreService

                this.init();
            }

            async init() {
                this.highScore = await this.highScoreService.getHighScore(); // Fetch high score
                this.updateScoreDisplay();
                this.addEventListeners();
                requestAnimationFrame(this.gameLoop.bind(this));
            }

            updateScoreDisplay() {
                document.getElementById("currentScore").textContent = `Score: ${this.score}`;
                document.getElementById("highScore").textContent = `High Score: ${this.highScore}`;
            }

            addEventListeners() {
                document.addEventListener("keydown", (event) => {
                    const button = this.buttonMap[event.key];
                    if (button) {
                        button.focus(); // Simulate :active state
                    }
                  this.changeDirection({ key: event.key });
                });

                Object.entries(this.buttonMap).forEach(([key, button]) => {
                    button.addEventListener("click", () => {
                        this.changeDirection({ key });
                    });
                });
            }

            togglePause() {
                this.isPaused = !this.isPaused;
                if (!this.isPaused) {
                    this.lastRenderTime = performance.now();
                    requestAnimationFrame(this.gameLoop.bind(this));
                }
            }

            generateFood() {
                let foodPosition;
                while (true) {
                    const x = Math.floor(Math.random() * (this.width / this.gridSize)) * this.gridSize;
                    const y = Math.floor(Math.random() * (this.height / this.gridSize)) * this.gridSize;
                    foodPosition = { x, y };

                    if (!this.snake.some(segment => segment.x === x && segment.y === y)) {
                        break;
                    }
                }
                return foodPosition;
            }

            drawSnake() {
                this.ctx.fillStyle = "blue";
                this.ctx.fillRect(this.snake[0].x, this.snake[0].y, this.gridSize, this.gridSize);

                this.ctx.fillStyle = "green";
                for (let i = 1; i < this.snake.length; i++) {
                    this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.gridSize, this.gridSize);
                }
            }

            drawFood() {
                this.ctx.fillStyle = "red";
                this.ctx.fillRect(this.food.x, this.food.y, this.gridSize, this.gridSize);
            }

            moveSnake() {
                const head = { ...this.snake[0] };

                switch (this.currentDirection) {
                    case this.directions.UP:
                        head.y -= this.gridSize;
                        break;
                    case this.directions.DOWN:
                        head.y += this.gridSize;
                        break;
                    case this.directions.LEFT:
                        head.x -= this.gridSize;
                        break;
                    case this.directions.RIGHT:
                        head.x += this.gridSize;
                        break;
                }

                if (head.x < 0) head.x = this.width - this.gridSize;
                if (head.x >= this.width) head.x = 0;
                if (head.y < 0) head.y = this.height - this.gridSize;
                if (head.y >= this.height) head.y = 0;

                if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                    this.stopGame();
                    return;
                }

                this.snake.unshift(head);

                if (head.x === this.food.x && head.y === this.food.y) {
                    this.food = this.generateFood();
                    this.score++;
                    this.speed = Math.max(50, this.speed - 5);
                    this.updateScoreDisplay();
                } else {
                    this.snake.pop();
                }
            }

            gameLoop(timestamp) {
                if (this.isPaused || this.gameOver) return;

                const deltaTime = timestamp - this.lastRenderTime;
                if (deltaTime > this.speed) {
                    this.lastRenderTime = timestamp;
                    this.ctx.clearRect(0, 0, this.width, this.height);
                    this.moveSnake();
                    this.drawSnake();
                    this.drawFood();
                }

                requestAnimationFrame(this.gameLoop.bind(this));
            }

            changeDirection(event) {
                if (this.gameOver) return;

                if (event.key === "p") {
                    this.togglePause();
                    return;
                }

                switch (event.key) {
                    case "ArrowUp":
                        if (this.currentDirection !== this.directions.DOWN) this.currentDirection = this.directions.UP;
                        break;
                    case "ArrowDown":
                        if (this.currentDirection !== this.directions.UP) this.currentDirection = this.directions.DOWN;
                        break;
                    case "ArrowLeft":
                        if (this.currentDirection !== this.directions.RIGHT) this.currentDirection = this.directions.LEFT;
                        break;
                    case "ArrowRight":
                        if (this.currentDirection !== this.directions.LEFT) this.currentDirection = this.directions.RIGHT;
                        break;
                }
            }

            async stopGame() {
                this.gameOver = true;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    await this.highScoreService.updateHighScore(this.highScore); // Update high score
                }
                alert(`Game Over! Your score: ${this.score}`);
                setTimeout(() => this.resetGame(), 1000);
            }

            resetGame() {
                this.snake = [{ x: 0, y: 0 }];
                this.food = this.generateFood();
                this.score = 0;
                this.gameOver = false;
                this.speed = speed;
                this.currentDirection = this.directions.RIGHT;
                this.updateScoreDisplay();
                requestAnimationFrame(this.gameLoop.bind(this));
            }
        }

        // Create HighScoreService instance
        const highScoreService = new HighScoreService();

        // Instantiate SnakeGame with HighScoreService
        new SnakeGame({
            canvasId: "gameCanvas",
            width: 400,
            height: 400,
            gridSize: 20,
            speed: 150,
            highScoreService,
        });