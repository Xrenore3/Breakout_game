const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let numberOfLoseFirstPlayer = 0;
let numberOfLoseSecondPlayer = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

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
const SecondPaddle = new Paddle(canvas.width / 2 - 40, 10);

class Ball {
  constructor(x, y) {
    (this.x = x),
      (this.y = y),
      (this.size = 10),
      (this.speed = 4),
      (this.dx = 4),
      (this.dy = -4);
  }

  drawBall() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "#93df0e";
    ctx.fill();
  }

  moveBall() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
      this.dx *= -1; // this.dx = this.dx * -1
    }

    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
      this.dy *= -1;
    }

    // console.log(this.x, this.y);

    if (
      this.x + this.size > FirstPaddle.x &&
      this.x - this.size < FirstPaddle.x + FirstPaddle.w &&
      this.y + this.size > FirstPaddle.y
    ) {
      this.speed += 0.25;
      this.dy = -this.speed;
    }

    if (
      this.x + this.size > SecondPaddle.x &&
      this.x - this.size < SecondPaddle.x + SecondPaddle.w &&
      this.y - this.size < SecondPaddle.y + SecondPaddle.h
    ) {
      this.speed += 0.25;
      this.dy = this.speed;
    }

    bricks.forEach((column) => {
      column.forEach((brick) => {
        if (brick.visible) {
          if (
            this.x - this.size > brick.x && // left brick side check
            this.x + this.size < brick.x + brick.w && // right brick side check
            this.y + this.size > brick.y && // top brick side check
            this.y - this.size < brick.y + brick.h // bottom brick side check
          ) {
            this.dy *= -1;
            brick.visible = false;

            increaseScore();
          }
        }
      });
    });

    // Hit bottom and top wall - Lose
    //bottom wall
    if (this.y + this.size > canvas.height) {
      FirstPaddle.w -= 20;
      numberOfLoseFirstPlayer++;
      if (numberOfLoseFirstPlayer > 2) {
        this.speed = 4;
        this.y = canvas.height / 4;
        this.dy = 4;
        numberOfLoseFirstPlayer = 0;
        SecondPaddle.w = 80;
        FirstPaddle.w = 80;
        showAllBricks();
        score = 0;
      }
    }

    //top wall
    if (this.y < 10) {
      SecondPaddle.w -= 20;
      numberOfLoseSecondPlayer++;
      if (numberOfLoseSecondPlayer > 2) {
        this.speed = 4;
        this.y = (canvas.height / 4) * 3;
        this.dy = -4;
        this.speed = 4;
        numberOfLoseSecondPlayer = 0;
        FirstPaddle.w = 80;
        SecondPaddle.w = 80;
        showAllBricks();
        score = 0;
      }
    }
  }
}

const FirstBall = new Ball(canvas.width / 2, (canvas.height / 4) * 3);
const SecondBall = new Ball(canvas.width / 2, canvas.height / 4);

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
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 50);
}

function increaseScore() {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  FirstBall.drawBall();
  SecondBall.drawBall();

  FirstPaddle.drawPaddle();
  SecondPaddle.drawPaddle();

  drawScore();
  drawBricks();
}

function update() {
  FirstBall.moveBall();
  SecondBall.moveBall();

  FirstPaddle.movePaddle();
  SecondPaddle.movePaddle();

  draw();
  requestAnimationFrame(update);
}
update();
draw();

function keyDownFirstPlayer(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    FirstPaddle.dx = FirstPaddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    FirstPaddle.dx = -FirstPaddle.speed;
  }
}
function keyUpFirstPlayer(e) {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    FirstPaddle.dx = 0;
  }
}

function keyDownSecondPlayer(e) {
  if (e.code === "KeyX") {
    SecondPaddle.dx = SecondPaddle.speed;
  } else if (e.code === "KeyZ") {
    SecondPaddle.dx = -SecondPaddle.speed;
  }
}
function keyUpSecondPlayer(e) {
  if (e.code === "KeyX" || e.code === "KeyZ") {
    SecondPaddle.dx = 0;
  }
}

document.addEventListener("keydown", keyDownFirstPlayer);
document.addEventListener("keyup", keyUpFirstPlayer);

document.addEventListener("keydown", keyDownSecondPlayer);
document.addEventListener("keyup", keyUpSecondPlayer);

rulesBtn.addEventListener("click", () => rules.classList.add("show"));
closeBtn.addEventListener("click", () => rules.classList.remove("show"));
