class CannonBall {
  constructor(x, y, canvasElement, player) {
    // CannonBall draw.
    this.sprite = new Image();
    this.sprite.src = '../sprites/cannonBall.png';
    this.spriteSizeX = 24;
    this.spriteSizeY = 24;
    this.colliderSizeX = 24;
    this.colliderSizeY = 24;

    // Enemy position.
    this.x = x;
    this.y = y;

    // Enemy physics.
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.05;

    // Game references.
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.player = player;
  }

  update() {
    if (this.player.IsDead) return;

    if (this.checkPlayerInside()) {
      this.player.hit();
    }

    this.physicsUpdate();

    this.checkCanvasBorders();
  }

  physicsUpdate() {
    this.x += this.vx;
    this.y += this.vy;

    this.vy += this.grav;
  }

  draw() {
    this.context.drawImage(this.sprite, this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY / 2, this.spriteSizeX, this.spriteSizeY);
  }

  // Check if player is inside ball boundaries.
  checkPlayerInside() {
    let checkX = this.player.x >= this.x - this.colliderSizeX / 2 && this.player.x <= this.x + this.colliderSizeX / 2;
    let checkY = this.player.y <= this.y + this.colliderSizeY / 2 && this.player.y >= this.y - this.colliderSizeY / 2;

    return checkX && checkY;
  }

  throwBall(force) {
    this.vx = force;
  }

  checkCanvasBorders() {
    const leftBorder = 32;
    const rightBorder = canvasWidth - 32;

    if (this.x + this.spriteSizeX / 2 >= rightBorder || this.x - this.spriteSizeX / 2 <= leftBorder) this.vx = -this.vx;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
