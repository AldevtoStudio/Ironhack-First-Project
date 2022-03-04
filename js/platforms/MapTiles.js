class Tile {
  constructor(x, y, canvasElement, player, game) {
    // Tile draw.
    this.sprite = new Image();
    this.sprite.src = '../sprites/towerBackground.png';

    // Tile position.
    this.x = x;
    this.y = y;

    // Tile physics.
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.2;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.player = player;
    this.xPositions = [];
    this.yPositions = [];
    this.game = game;
  }

  generatePanels() {
    // Store the lastX position.
    let lastX;

    // Store generated panels.
    let generatedPanels = 0;

    // Generate random windows.
    for (let i = 0; i < this.yPositions.length - 1; i++) {
      // Stop generating panels if reached maxPanelsPerTile.
      if (this.maxPanelsPerTile === generatedPanels) return;

      // Generate random x positions and prevent the first time to be the same as the last x.
      let randomXPos = this.xPositions[Math.floor(Math.random() * this.xPositions.length)];
      if (lastX == randomXPos) randomXPos = this.xPositions[Math.floor(Math.random() * this.xPositions.length)];

      // Get fixed y position.
      let yPos = this.yPositions[i];

      // Generate panel.
      this.player.panels.push(new Panel(randomXPos * this.player.panels[0].spriteSizeX, yPos * this.player.panels[0].spriteSizeY + this.y, this.canvas, this.player));
      lastX = randomXPos;
      generatedPanels++;

      // Remove panel position from xPositions array.
      let indexOfX = this.xPositions.indexOf(randomXPos);
      this.xPositions.splice(indexOfX, 1);
    }
  }

  generateEnemies() {
    let yPos = [100, 200, 300, 400];

    for (let i = 0; i < this.maxEnemiesPerTile; i++) {
      let randomNumber = Math.random();
      let randomYPos = yPos[Math.floor(Math.random() * yPos.length)];

      let enemy = new EnemyCannon(randomNumber >= 0.5 ? rightBorder : leftBorder, randomYPos + this.y, this.canvas, this.player);
      this.player.enemies.push(enemy);

      let index = yPos.indexOf(randomYPos);
      yPos.splice(index, 1);
    }
  }

  drawGrid() {
    // Tile grid.
    this.numberOfRows = this.canvas.width / this.player.panels[0].spriteSizeX;
    this.numberOfCols = this.canvas.height / this.player.panels[0].spriteSizeY;
    this.gridSizeX = this.canvas.width / this.numberOfRows;
    this.gridSizeY = this.canvas.height / this.numberOfCols;

    for (let row = 0; row < this.numberOfRows + 1; row++) {
      if (!this.IsGenerated) this.yPositions.push(row);
      for (let column = 1; column < this.numberOfCols - 2; column++) {
        if (!this.IsGenerated) this.xPositions.push(column);
        //this.context.strokeRect(column * this.gridSizeX, row * this.gridSizeY + this.y, this.gridSizeX, this.gridSizeY);
      }
    }

    if (!this.IsGenerated) {
      this.generatePanels();
      this.generateEnemies();

      this.IsGenerated = true;
    }
  }

  draw() {
    this.context.drawImage(this.sprite, this.x, this.y, this.canvas.width, this.canvas.height);
    this.drawGrid();
  }

  update() {
    if (this.player.IsDead) return;

    switch (this.game.difficulty) {
      case 0:
        this.maxPanelsPerTile = 9;
        this.maxEnemiesPerTile = 0;
        break;
      case 1:
        this.maxPanelsPerTile = 8;
        this.maxEnemiesPerTile = 1;
        break;
      case 2:
        this.maxPanelsPerTile = 8;
        this.maxEnemiesPerTile = 2;
        break;
      case 3:
        this.maxPanelsPerTile = 8;
        this.maxEnemiesPerTile = 3;
        break;
      case 4:
        this.maxPanelsPerTile = 7;
        this.maxEnemiesPerTile = 2;
        break;

      default:
        this.maxPanelsPerTile = 9;
        this.maxEnemiesPerTile = 1;
        break;
    }

    this.physicsUpdate();
  }

  physicsUpdate() {
    this.x += this.vx;
    this.y += this.grav;

    this.vy += 0;
  }
}
