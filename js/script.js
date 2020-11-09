const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let numberOfLoseFirstPlayer = 0;
let numberOfLoseSecondPlayer = 0;

let scoreResult = document.querySelector(".score");
scoreResult.innerHTML = score;

class Paddle {
  constructor(x, y) {
    (this.x = x),
      (this.y = y),
      (this.w = 80),
      (this.h = 10),
      (this.speed = 8),
      (this.dx = 0);
  }
  drawPaddle() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "#0095dd";
    ctx.fill();
  }
  movePaddle() {
    this.x += this.dx;

    if (this.x + this.w > canvas.width) {
      this.x = canvas.width - this.w;
    }

    if (this.x < 0) {
      this.x = 0;
    }
  }
}

const FirstPaddle = new Paddle(canvas.width / 2 - 40, canvas.height - 20);
const SecondPaddle = new Paddle(canvas.width / 2 - 40, 10)

FirstPaddle.drawPaddle();
SecondPaddle.drawPaddle()


const brickRowCount = 9;
const brickColumnCount = 5;

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: canvas.height / 2 - 70,
  visible: true,
};

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#ffca27" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

drawBricks();
