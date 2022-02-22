const canvasElement = document.querySelector('canvas');
const contextElement = canvasElement.getContext('2d');

const canvasWidth = canvasElement.width;
const canvasHeight = canvasElement.height;

const player = new Player(canvasWidth / 2, canvasHeight - 100, canvasElement);
const panels = [new Panel(canvasWidth / 2, canvasHeight - 200, canvasElement, player), new Panel(canvasWidth / 2 - 75, canvasHeight - 450, canvasElement, player), new Panel(canvasWidth / 2 + 100, canvasHeight - 350, canvasElement, player), new Panel(canvasWidth / 2 + 100, canvasHeight - 550, canvasElement, player)];
player.panels = panels;

function updateLoop() {
  player.update();
  panels.forEach((panel) => {
    panel.update();
  });
  drawGame();

  window.requestAnimationFrame(() => updateLoop());
}

function drawGame() {
  contextElement.clearRect(0, 0, canvasWidth, canvasHeight);
  panels.forEach((panel) => {
    panel.draw();
  });
  player.draw();
}

function getInputs(_player) {
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
        _player.keysPressed.push(e.key);
        break;
    }
  });
  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w':
      case 'a':
      case 's':
      case 'd':
        _player.keysPressed = _player.keysPressed.filter((keyName) => keyName !== e.key);
        break;
    }
  });
}

getInputs(player);
updateLoop();
