class Game {
  constructor(canvasElement, contextElement, screens) {
    // Canvas references.
    this.canvas = canvasElement;
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.context = contextElement;
    this.leftBorder = 32;
    this.rightBorder = this.canvasWidth - 32;
    this.screens = screens;

    // Objects references.
    this.player = new Player(canvasWidth / 2, canvasHeight - 100, canvasElement, this);
    this.fireFloor = [new Fire(this.leftBorder + 20, canvasHeight - 20, canvasElement, this.player)];
    this.player.panels = [new Panel(canvasWidth / 2, canvasHeight - 150, canvasElement, this.player)];
    this.player.tiles = [new Tile(0, 0, canvasElement, this.player), new Tile(0, -canvasHeight, canvasElement, this.player)];
    this.player.enemies = [new EnemyCannon(this.leftBorder, 150, canvasElement, this.player)];

    // Game logic.
    this.IsRunning = false;
  }

  displayScreen(name) {
    for (let screenName in this.screens) {
      this.screens[screenName].style.display = 'none';
    }
    this.screens[name].style.display = '';
  }

  gameStart() {
    this.displayScreen('playing');

    // Spawn fire in place.
    let numberOfFires = this.canvasWidth / 26;
    let borderLeft = this.leftBorder + 20;
    let borderRight = this.rightBorder - 20;

    for (let i = 0; i < numberOfFires; i++) {
      let fire = new Fire(28 * i, this.canvasHeight - 20, this.canvas, this.player);
      fire.x = Clamp(fire.x, borderLeft, borderRight);
      this.fireFloor.push(fire);
    }

    this.IsRunning = true;
    this.gameUpdate();
  }

  gameUpdate(stamp) {
    if (!this.IsRunning) return;

    this.player.update(stamp);

    this.player.enemies.forEach((enemy) => {
      enemy.update();
    });

    this.player.tiles.forEach((tile) => {
      tile.update();
    });

    this.player.panels.forEach((panel) => {
      panel.update();
    });

    this.gameDraw(stamp);

    window.requestAnimationFrame((stamp) => this.gameUpdate(stamp));
  }

  gameDraw(stamp) {
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);

    game.player.tiles.forEach((tiles) => {
      tiles.draw();
    });

    game.player.panels.forEach((panel) => {
      panel.draw();
    });

    game.player.enemies.forEach((enemy) => {
      enemy.draw();
    });

    game.player.draw();

    game.player.enemies.forEach((enemy) => {
      enemy.cannonBalls.forEach((ball) => {
        ball.draw();
      });
    });

    this.fireFloor.forEach((fire) => {
      fire.draw(stamp);
    });
  }
}
