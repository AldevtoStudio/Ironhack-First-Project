class Panel {
  constructor(x, y, canvasElement, player) {
    // Panel draw.
    this.sprite = new Image();
    this.sprite.src = '../sprites/window.png';
    this.colliderSizeX = 70;
    this.colliderSizeY = 74;
    this.spriteSizeX = 80;
    this.spriteSizeY = 98;
    this.player = player;

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
  }

  draw() {
    this.context.drawImage(this.sprite, this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY / 2, this.spriteSizeX, this.spriteSizeY);
  }

  update() {
    if (this.player.IsDead) return;

    if (this.checkPlayerInside()) {
      this.player.x += this.vx;
      this.player.y += this.grav;
      this.player.IsGrabbing = true;
      this.player.canThrow = false;
    }

    if (this.checkPlayerInside() && this.checkPlayerInBorders()) {
      this.player.canThrow = true;
    }

    this.physicsUpdate();
  }

  physicsUpdate() {
    this.x += this.vx;
    this.y += this.grav;

    this.vy += 0;
  }

  // Check if player is inside panel boundaries.
  checkPlayerInside() {
    let checkX = this.player.x >= this.x - this.colliderSizeX / 2 && this.player.x <= this.x + this.colliderSizeX / 2;
    let checkY = this.player.y <= this.y + this.colliderSizeY / 2 && this.player.y >= this.y - this.colliderSizeY / 2;

    return checkX && checkY;
  }

  // Check if player is inside panel border boundaries.
  checkPlayerInBorders() {
    let offset = 4;

    let checkLeftBorder = this.player.x >= this.x - this.colliderSizeX / 2 && this.player.x <= this.x - this.colliderSizeX / 2 + offset;
    let checkRightBorder = this.player.x <= this.x + this.colliderSizeX / 2 && this.player.x >= this.x + this.colliderSizeX / 2 - offset;

    let checkUpBorder = this.player.y >= this.y - this.colliderSizeY / 2 && this.player.y <= this.y - this.colliderSizeY / 2 + offset;
    let checkDownBorder = this.player.y <= this.y + this.colliderSizeY / 2 && this.player.y >= this.y + this.colliderSizeY / 2 - offset;

    if (checkLeftBorder) this.player.state = 'left';
    else if (checkRightBorder) this.player.state = 'right';
    else this.player.state = 'idle';

    return checkLeftBorder || checkRightBorder || checkUpBorder || checkDownBorder;
  }
}

function Clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
