// HTML elements.
const canvasElement = document.querySelector('canvas');
const contextElement = canvasElement.getContext('2d');
const canvasWidth = canvasElement.width;
const canvasHeight = canvasElement.height;
const startBtn = document.querySelector('#startBtn');
const tryAgainBtn = document.querySelector('#tryAgainBtn');
const startScreen = document.getElementById('start-screen');
const playingScreen = document.getElementById('playing-screen');
const endScreen = document.getElementById('end-screen');

const screens = {
  start: startScreen,
  playing: playingScreen,
  end: endScreen
};

// Game logic.
const leftBorder = 32;
const rightBorder = canvasWidth - 32;

// Game.
let game = new Game(canvasElement, contextElement, screens);

function start() {
  game.gameStart();
  getInputs(game.player);
}

function tryAgain() {
  game = new Game(canvasElement, contextElement, screens);
  game.gameStart();
  getInputs(game.player);
}

function getInputs(player) {
  window.addEventListener('keydown', (e) => {
    e.preventDefault();
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        player.keysPressed.push(e.key);
        break;
    }
  });
  window.addEventListener('keyup', (e) => {
    e.preventDefault();
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        player.keysPressed = player.keysPressed.filter((keyName) => keyName !== e.key);
        break;
    }
  });
}

startBtn.addEventListener('click', () => {
  start();
});

tryAgainBtn.addEventListener('click', () => {
  tryAgain();
});
