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

    this.fireSound = new Audio('../audio/fire.wav');

    // Objects references.
    this.player = new Player(canvasWidth / 2, canvasHeight - 100, canvasElement, this);
    this.fireFloor = [new Fire(this.leftBorder + 20, canvasHeight - 20, canvasElement, this.player)];
    this.player.panels = [new Panel(canvasWidth / 2, canvasHeight - 150, canvasElement, this.player)];
    this.player.tiles = [new Tile(0, 0, canvasElement, this.player, this), new Tile(0, -canvasHeight, canvasElement, this.player, this)];
    this.player.enemies = [];

    // Game logic.
    this.IsRunning = false;
    this.difficulty = 0;
  }

  displayScreen(name) {
    for (let screenName in this.screens) {
      this.screens[screenName].style.display = 'none';
    }
    this.screens[name].style.display = '';
  }

  gameStart() {
    this.displayScreen('playing');

    this.fireSound.loop = true;
    this.fireSound.play();

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

    if (this.player.score >= 15 && this.difficulty <= 29) this.difficulty = 1;
    else if (this.player.score >= 30 && this.difficulty <= 44) this.difficulty = 2;
    else if (this.player.score >= 45 && this.difficulty <= 59) this.difficulty = 3;
    else if (this.player.score >= 60) this.difficulty = 4;

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

    this.player.banners.forEach((banner) => {
      banner.update();
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

    this.player.banners.forEach((banner) => {
      banner.draw();
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
