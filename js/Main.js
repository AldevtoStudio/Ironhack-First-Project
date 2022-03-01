const canvasElement = document.querySelector('canvas');
const contextElement = canvasElement.getContext('2d');

const canvasWidth = canvasElement.width;
const canvasHeight = canvasElement.height;

const leftBorder = 32;
const rightBorder = canvasWidth - 32;

const player = new Player(canvasWidth / 2, canvasHeight - 100, canvasElement);
const panels = [new Panel(canvasWidth / 2, canvasHeight - 150, canvasElement, player)];
let tiles = [new Tile(0, 0, canvasElement, player), new Tile(0, -canvasHeight, canvasElement, player)];
let enemies = [new EnemyCannon(leftBorder, 150, canvasElement, player)];
const fireFloor = [new Fire(leftBorder + 20, canvasHeight - 20, canvasElement, player)];

player.panels = panels;
player.tiles = tiles;
player.enemies = enemies;

function start() {
  let numberOfFires = canvasWidth / 26;
  let borderLeft = leftBorder + 20;
  let borderRight = rightBorder - 20;

  for (let i = 0; i < numberOfFires; i++) {
    let fire = new Fire(28 * i, canvasHeight - 20, canvasElement, player);
    fire.x = Clamp(fire.x, borderLeft, borderRight);
    fireFloor.push(fire);
  }
}

function updateLoop(stamp) {
  player.update(stamp);

  player.enemies.forEach((enemy) => {
    enemy.update();
  });

  tiles.forEach((tile) => {
    tile.update();
  });

  player.panels.forEach((panel) => {
    panel.update();
  });

  drawGame(stamp);

  window.requestAnimationFrame((stamp) => updateLoop(stamp));
}

function drawGame(stamp) {
  contextElement.clearRect(0, 0, canvasWidth, canvasHeight);

  player.tiles.forEach((tiles) => {
    tiles.draw();
  });

  player.panels.forEach((panel) => {
    panel.draw();
  });

  player.enemies.forEach((enemy) => {
    enemy.draw();
  });

  player.draw();

  player.enemies.forEach((enemy) => {
    enemy.cannonBalls.forEach((ball) => {
      ball.draw();
    });
  });

  fireFloor.forEach((fire) => {
    fire.draw(stamp);
  });
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

start();
getInputs(player);
updateLoop();
