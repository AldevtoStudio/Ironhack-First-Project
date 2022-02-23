class EnemyCannon {
  constructor(x, y, canvasElement, player) {
    // EnemyCannon draw.
    this.sprite = new Image();
    this.sprite.src = x < canvasElement.width / 2 ? '../sprites/enemyCannonLeft.png' : '../sprites/enemyCannonRight.png';
    this.spriteSizeX = 96;
    this.spriteSizeY = 64;

    // Enemy position.
    this.x = x < canvasElement.width / 2 ? x + 48 : x - 48;
    this.y = y;

    // Enemy logic.
    this.IsWaiting = false;

    // Enemy physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.2;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.player = player;
    this.cannonBalls = [];
  }

  update() {
    if (this.player.IsDead) return;

    if (this.cannonBalls.length === 0 && !this.IsWaiting) {
      this.createBall();
    }

    this.cannonBalls.forEach((ball) => {
      ball.update();
    });

    this.checkBallOutsideCanvas();

    this.physicsUpdate();
  }

  physicsUpdate() {
    this.x += this.vx;
    this.y += this.grav;

    this.vy += 0;
  }

  draw() {
    this.context.drawImage(this.sprite, this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY / 2, this.spriteSizeX, this.spriteSizeY);
  }

  createBall() {
    let ball = this.x < this.canvas.width / 2 ? new CannonBall(this.x + 30, this.y - 12, this.canvas, this.player) : new CannonBall(this.x - 30, this.y - 12, this.canvas, this.player);
    this.cannonBalls.push(ball);
    ball.throwBall();
    this.IsWaiting = true;
  }

  checkBallOutsideCanvas() {
    this.cannonBalls.forEach((ball) => {
      let index = this.cannonBalls.indexOf(ball);

      if (ball.x < -this.spriteSizeX * 2 || ball.x > this.canvas.width + this.spriteSizeX * 2 || ball.y > this.canvas.height + this.spriteSizeY) {
        this.cannonBalls.splice(index, 1);
        setTimeout(() => {
          this.IsWaiting = false;
        }, 1000);
      }
    });
  }
}
