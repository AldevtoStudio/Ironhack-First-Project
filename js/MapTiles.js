class Tile {
  constructor(x, y, canvasElement, player) {
    // Panel draw.
    this.sprite = new Image();
    this.sprite.src = '../sprites/towerBackground.png';

    // Panel position.
    this.x = x;
    this.y = y;

    // Panel physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.2;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.player = player;
  }

  draw() {
    //this.context.fillRect(this.x - this.spriteSize / 2, this.y - this.spriteSize / 2, this.spriteSize, this.spriteSize);
    this.context.drawImage(this.sprite, this.x, this.y, this.canvas.width, this.canvas.height);
  }

  update() {
    if (this.player.IsDead) return;

    this.physicsUpdate();
  }

  physicsUpdate() {
    this.x += this.vx;
    this.y += this.grav;

    this.vy += 0;
  }
}
