class Panel {
  constructor(x, y, canvasElement, player) {
    // Panel draw.
    this.sprite = new Image();
    //this.sprite.src = '../images/panel.png'
    this.spriteSize = 80;
    this.player = player;

    // Panel position.
    this.x = x;
    this.y = y;

    // Panel physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.05;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
  }

  draw() {
    contextElement.save();
    this.context.fillStyle = 'grey';
    this.context.fillRect(this.x - this.spriteSize / 2, this.y - this.spriteSize / 2, this.spriteSize, this.spriteSize);
    //context.drawImage();
    contextElement.restore();
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
    let checkX = this.player.x >= this.x - this.spriteSize / 2 && this.player.x <= this.x + this.spriteSize / 2;
    let checkY = this.player.y <= this.y + this.spriteSize / 2 && this.player.y >= this.y - this.spriteSize / 2;

    return checkX && checkY;
  }

  // Check if player is inside panel border boundaries.
  checkPlayerInBorders() {
    let grabOffset = 12;

    let checkLeftBorder = this.player.x >= this.x - this.spriteSize / 2 && this.player.x <= this.x - this.spriteSize / 2 + grabOffset;
    let checkRightBorder = this.player.x <= this.x + this.spriteSize / 2 && this.player.x >= this.x + this.spriteSize / 2 - grabOffset;

    let checkUpBorder = this.player.y >= this.y - this.spriteSize / 2 && this.player.y <= this.y - this.spriteSize / 2 + grabOffset;
    let checkDownBorder = this.player.y <= this.y + this.spriteSize / 2 && this.player.y >= this.y + this.spriteSize / 2 - grabOffset;

    return checkLeftBorder || checkRightBorder || checkUpBorder || checkDownBorder;
  }
}

function Clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
