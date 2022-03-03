class Banner {
  constructor(x, y, canvasElement, player) {
    // Banner draw.
    this.sprite = new Image();
    this.sprite.src = '../sprites/banner.png';
    this.spriteSizeX = 64;
    this.spriteSizeY = 192;
    this.text = player.score;

    // Banner position.
    this.x = x;
    this.y = y;

    // Banner physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.2;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.player = player;
  }

  draw() {
    this.context.drawImage(this.sprite, this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY, this.spriteSizeX, this.spriteSizeY);
    this.context.save();
    this.context.font = `38px Pixellari`;
    this.context.fillStyle = 'white';
    this.context.fillVerticalText('' + this.text, this.x - 10, this.y - this.spriteSizeY + 46, 32);
    this.context.restore();
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
