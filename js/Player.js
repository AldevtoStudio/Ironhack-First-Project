class Player {
  constructor(x, y, canvasElement) {
    // Player draw.
    this.direction = 'down';
    this.sprites = {};
    this.spriteSize = 32;

    // Player position.
    this.x = x;
    this.y = y;

    // Player logic.
    this.IsGrabbing = true;
    this.IsDead = false;
    this.WasGrabbing = false;
    this.canThrow = true; // Return to false after testing!
    this.score = 0;
    this.keysPressed = [];

    // Player physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.3;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');

    // Player sprites direction/path pair value.
    const playerSprites = {
      left: 'images/playerLeft.png',
      up: 'images/playerUp.png',
      right: 'images/playerRight.png',
      down: 'images/playerDown.png'
    };

    /*// Load and storing player sprites.
    for (var orientation in playerSprites) {
      this.sprites[orientation] = new Image();
      this.sprites[orientation].src = playerSprites[orientation];
    }*/
  }

  draw() {
    this.context.fillRect(this.x - this.spriteSize / 2, this.y - this.spriteSize / 2, this.spriteSize, this.spriteSize);
    //context.drawImage();
  }

  update() {
    if (this.IsDead) return;

    if (this.IsGrabbing) this.checkWASDInputs();

    this.checkMouseInputs();

    // Get mouse position inside canvas boundaries.
    this.mousePosition();

    this.physicsUpdate();

    // Die but letting the head of the player just a little bit above the lava.
    if (this.y > this.canvas.height) {
      console.log('You lost!');
      this.IsDead = true;
    }
  }

  physicsUpdate() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.IsGrabbing) {
      this.vy = 0;
      this.vx = 0;
    } else {
      this.vy += this.grav;
    }
  }

  mousePosition() {
    this.canvas.onmousemove = (event) => {
      this.mouseX = Clamp(event.offsetX, 0, this.canvas.width);
      this.mouseY = Clamp(event.offsetY, 0, this.canvas.height);
    };
  }

  // Check if mouse is inside player boundaries.
  checkGrab() {
    let grabOffset = 8;
    return this.mouseX >= this.x - this.spriteSize / 2 - grabOffset && this.mouseX <= this.x + this.spriteSize / 2 + grabOffset && this.mouseY <= this.y + this.spriteSize / 2 + grabOffset && this.mouseY >= this.y - this.spriteSize / 2 - grabOffset;
  }

  checkMouseInputs() {
    // Get mouse position relative to player position on mouse down (start point).
    this.canvas.onmousedown = (event) => {
      // First check if mouse is over the player sprite.
      if (!this.checkGrab()) return;

      this.WasGrabbing = true;

      this.startPoint = new Point(this.mouseX - this.x, this.mouseY - this.y);
      //console.log(`Start Point: (${this.startPoint.value})`);
    };

    // Get mouse position relative to player position on mouse up (end point).
    this.canvas.onmouseup = (event) => {
      // First check if client was grabbing the player sprite.
      if (!this.WasGrabbing) return;

      this.endPoint = new Point(this.mouseX - this.x, this.mouseY - this.y);
      this.grabVector = new Vector(this.startPoint, this.endPoint);

      //console.log(`EndPoint: (${this.endPoint.value})`);
      //console.log(`GrabVector: (${this.grabVector.value})`);
      //console.log(`GrabVector magnitude: ${this.grabVector.magnitude()}`);
      //console.log(`GrabVector normalized: (${this.grabVector.normalized().value})`);
      this.throwPlayer();
    };
  }

  checkWASDInputs() {
    for (const key of this.keysPressed) {
      switch (key) {
        case 'w':
          this.vy = -0.5;
          break;
        case 's':
          this.vy = +0.5;
          break;
        case 'a':
          this.vx = -0.5;
          break;
        case 'd':
          this.vx = +0.5;
          break;
      }
    }
  }

  throwPlayer() {
    if (!this.canThrow) return;

    this.vx = -(5 * this.grabVector.normalized().x);
    this.vy = -(10 * this.grabVector.normalized().y);
    console.log(`X vel: ${this.vx}`);
    console.log(`Y vel: ${this.vy}`);

    this.IsGrabbing = false;
    this.WasGrabbing = false;
  }
}

function Clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
