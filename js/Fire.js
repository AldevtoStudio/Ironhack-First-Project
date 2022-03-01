class Fire {
  constructor(x, y, canvasElement, player) {
    // Fire draw.
    this.sprite = new Image();
    this.sprite.src = '../sprites/fireFloor.png';
    this.spriteSizeX = 45;
    this.spriteSizeY = 72;
    this.frame = 0;
    this.player = player;
    this.framesPerSec = 8;
    this.lastRender = 0;
    this.frame = 0;
    this.last = 0;

    // Fire position.
    this.x = x;
    this.y = y;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
  }

  draw(stamp) {
    if (!this.last || stamp - this.last >= 0.1 * 1000) {
      this.last = stamp;
      if (this.player.IsDead) {
        this.frame = 0;
      } else this.frame++;
    }

    this.context.drawImage(this.sprite, this.spriteSizeX * (this.frame % 8), 0, this.spriteSizeX, this.spriteSizeY, this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY / 2, this.spriteSizeX, this.spriteSizeY);
  }
}
