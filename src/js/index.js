import '../css/style.css';
var inner = getById('inner'),
  innerLeft = inner.offsetLeft,
  innerRight = inner.offsetLeft + inner.offsetWidth,
  bat = getById('bat'),
  ball = getById('ball'),
  ballHDirection = 'right',
  ballVDirection = 'left',
  interval = 400,
  score = 0,
  gameStatus,
  positions = [0, 10, 20, 30, 40, 50, 60, 70, 80, 100];

ball.style.left = positions[getIntRandomNumber(10)] + 'px';

function getById(id) {
  return document.getElementById(id);
}

function getIntRandomNumber(n) {
  return parseInt(Math.floor(Math.random() * n));
}

function getRandomeLeft(n) {
  var arr = [3, 5, 7, 9];
  return arr[getIntRandomNumber(5)];
}

function getBatDirection(ball, batLeft, batRight, ballLeft, ballRight, ballHDirection) {
  var isLeftCornerHit = ballRight >= batLeft && ballRight <= batLeft + 20,
    isRightCornerHit = ballLeft >= batRight - 20 && ballLeft <= batRight;
  if (isLeftCornerHit) {
    score += 10;
    ball.style.left = ballLeft + 15 + 'px';
    return 'left';
  } else if (isRightCornerHit) {
    score += 10;
    ball.style.right = ballRight + 15 + 'px';
    return 'right';
  }
  score += 10;
  return ballHDirection;
}

getById('outer').addEventListener('mousemove', function(event) {
  var mouseX = event.pageX - innerLeft;
  var validXMove = mouseX >= 0 && mouseX <= inner.offsetWidth - bat.offsetWidth;
  if (validXMove) {
    bat.style.left = mouseX + 'px';
  } else if (mouseX < 0) {
    bat.style.left = '0px';
  } else {
    bat.style.left = inner.offsetWidth - bat.offsetWidth + 'px';
  }
});

function moveBall() {
  var inner = getById('inner'),
    innerLeft = inner.offsetLeft,
    innerRight = inner.offsetLeft + inner.offsetWidth,
    bat = getById('bat'),
    batLeft = bat.offsetLeft,
    ball = getById('ball'),
    ballTop = ball.offsetTop,
    ballLeft = ball.offsetLeft,
    ballRight = ball.offsetLeft + ball.offsetWidth,
    canBallMoveDown = ball.offsetTop + ball.offsetHeight < inner.offsetHeight - 2,
    isHitByBat =
      ball.offsetLeft + ball.offsetWidth >= batLeft &&
      ball.offsetLeft <= batLeft + bat.offsetWidth &&
      ball.offsetTop + ball.offsetHeight >= bat.offsetTop &&
      ball.offsetTop + ball.offsetHeight <= bat.offsetTop + bat.offsetHeight;

  if (!canBallMoveDown) {
    stopGame();
    getById('popup').style.display = 'block';
    return;
  }

  ballVDirection = ball.offsetTop === 0 ? 'down' : ballVDirection;
  ballVDirection = isHitByBat ? 'up' : ballVDirection;

  ballHDirection = ball.offsetLeft === 0 ? 'right' : ballHDirection;
  ballHDirection = ballRight >= inner.offsetWidth - 2 ? 'left' : ballHDirection;
  ballHDirection = isHitByBat
    ? getBatDirection(ball, batLeft, batLeft + bat.offsetWidth, ballLeft, ballRight, ballHDirection)
    : ballHDirection;

  if (ballVDirection === 'down') {
    ballTop = ballTop + 10;
    ballTop = ballTop > 480 ? 480 : ballTop;
  }

  if (ballHDirection === 'left') {
    ballLeft = ballLeft - 10;
    ballLeft = isHitByBat ? ballLeft - getRandomeLeft() : ballLeft;
    ballLeft = ballLeft < 0 ? 0 : ballLeft;
  }

  if (ballHDirection === 'right') {
    ballLeft = ballLeft + 10;
    ballLeft = isHitByBat ? ballLeft + getRandomeLeft() : ballLeft;
    ballLeft = ballLeft > 480 ? 480 : ballLeft;
  }

  if (ballVDirection === 'up') {
    ballTop = ballTop - 10;
    ballTop = ballTop < 0 ? 0 : ballTop;
  }

  ball.style.top = ballTop + 'px';
  ball.style.left = ballLeft + 'px';
  getById('score').innerHTML = score;
}

function stopGame() {
  clearInterval(gameStatus);
}

getById('pause').addEventListener('click', stopGame);
getById('start').addEventListener('click', startGame);
getById('re-start').addEventListener('click', reStartGame);

function reStartGame() {
  bat.style.left = ball.style.top = score = 0;
  ball.style.left = positions[getIntRandomNumber(10)] + 'px';
  getById('popup').style.display = 'none';
  gameStatus = setInterval(moveBall, 20);
}
function startGame() {
  gameStatus = setInterval(moveBall, 20);
}
