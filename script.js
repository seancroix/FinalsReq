const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

// Create the game grid
const grid = [];
for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < columns; c++) {
        grid[r][c] = 0;
    }
}

// Draw the game grid
function drawGrid() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (grid[r][c] === 1) {
                context.fillStyle = '#000';
                context.fillRect(c * scale, r * scale, scale, scale);
            } else {
                context.fillStyle = '#fff';
                context.fillRect(c * scale, r * scale, scale, scale);
                context.strokeStyle = '#ccc';
                context.strokeRect(c * scale, r * scale, scale, scale);
            }
        }
    }
}

// Create a Tetromino
class Tetromino {
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;
        this.x = 0;
        this.y = 0;
    }

    draw() {
        for (let r = 0; r < this.shape.length; r++) {
            for (let c = 0; c < this.shape[r].length; c++) {
                if (this.shape[r][c]) {
                    context.fillStyle = this.color;
                    context.fillRect((this.x + c) * scale, (this.y + r) * scale, scale, scale);
                }
            }
        }
    }

    moveDown() {
        if (!this.collision(0, 1, this.shape)) {
            this.y++;
        } else {
            this.lock();
            tetromino = createTetromino();
        }
    }

    moveRight() {
        if (!this.collision(1, 0, this.shape)) {
            this.x++;
        }
    }

    moveLeft() {
        if (!this.collision(-1, 0, this.shape)) {
            this.x--;
        }
    }

    rotate() {
        const rotatedShape = this.rotateMatrix(this.shape);
        if (!this.collision(0, 0, rotatedShape)) {
            this.shape = rotatedShape;
        }
    }

    collision(dx, dy, shape) {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (!shape[r][c]) {
                    continue;
                }

                const newX = this.x + c + dx;
                const newY = this.y + r + dy;

                if (newX < 0 || newX >= columns || newY >= rows) {
                    return true;
                }

                if (newY < 0) {
                    continue;
                }

                if (grid[newY][newX]) {
                    return true;
                }
            }
        }

        return false;
    }

    lock() {
        for (let r = 0; r < this.shape.length; r++) {
            for (let c = 0; c < this.shape[r].length; c++) {
                if (!this.shape[r][c]) {
                    continue;
                }

                if (this.y + r < 0) {
                    // Game over
                    alert("Game Over");
                    // You can add more logic here, like restarting the game.
                    break;
                }

                grid[this.y + r][this.x + c] = 1;
            }
        }

        // Clear filled rows
        for (let r = 0; r < rows; r++) {
            let rowFilled = true;
            for (let c = 0; c < columns; c++) {
                if (grid[r][c] === 0) {
                    rowFilled = false;
                    break;
                }
            }

            if (rowFilled) {
                // Shift rows down
                for (let y = r; y > 0; y--) {
                    for (let c = 0; c < columns; c++) {
                        grid[y][c] = grid[y - 1][c];
                    }
                }

                // Clear top row
                for (let c = 0; c < columns; c++) {
                    grid[0][c] = 0;
                }
            }
        }
    }

    rotateMatrix(matrix) {
        const rows = matrix.length;
        const columns = matrix[0].length;
        const rotatedMatrix = [];

        for (let c = 0; c < columns; c++) {
            const newRow = [];
            for (let r = rows - 1; r >= 0; r--) {
                newRow.push(matrix[r][c]);
            }
            rotatedMatrix.push(newRow);
        }

        return rotatedMatrix;
    }
}

// Tetromino shapes and colors
const shapes = [
    [[1]],
    [[1, 1]],
    [[1, 1], [1, 1]],
    [[1, 0], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1, 1]]
];

const colors = [
    '#fff',
    '#f00',
    '#0f0',
    '#00f',
    '#ff0',
    '#f0f',
    '#0ff'
];

function createTetromino() {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    return new Tetromino(randomShape, randomColor);
}

let tetromino = createTetromino();

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    tetromino.draw();
}

function update() {
    draw();
    tetromino.moveDown();
}

// Game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
