class Player {
  constructor(x, y, canvasElement) {
    // Player draw.
    this.direction = 'down';
    this.sprite = new Image();
    this.sprite.src = '../sprites/player.png';
    //this.sprites = {};
    this.spriteSizeX = 34;
    this.spriteSizeY = 40;

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
    this.IsOnAir = false;
    this.FirstTime = true;

    // Player physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.3;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.panels = [];
    this.tiles = [];

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
    this.context.drawImage(this.sprite, this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY / 2, this.spriteSizeX, this.spriteSizeY);
  }

  update() {
    if (this.IsDead) return;

    this.panels.forEach((panel) => {
      if (panel.checkPlayerInside()) {
        this.checkWASDInputs(panel);
        this.FirstTime = false;
      } else if (!this.FirstTime && panel.checkPlayerInside()) this.IsOnAir = true;
    });

    this.checkMouseInputs();

    // Get mouse position inside canvas boundaries.
    this.mousePosition();

    this.physicsUpdate();

    // Die but letting the head of the player just a little bit above the lava.
    if (this.y > this.canvas.height) {
      this.die();
    }
  }

  physicsUpdate() {
    if (this.IsOnAir) {
      this.x += this.vx;
      this.y += this.vy;

      this.vy += this.grav;
    } else {
      this.x += this.vx;
      this.y += this.vy;

      if (this.IsGrabbing) {
        this.vy = 0;
        this.vx = 0;
      } else {
        this.vy += this.grav;
      }
    }

    this.checkTilesOutside();
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
    return this.mouseX >= this.x - this.spriteSizeX / 2 - grabOffset && this.mouseX <= this.x + this.spriteSizeX / 2 + grabOffset && this.mouseY <= this.y + this.spriteSizeY / 2 + grabOffset && this.mouseY >= this.y - this.spriteSizeY / 2 - grabOffset;
  }

  checkMouseInputs() {
    // Get mouse position relative to player position on mouse down (start point).
    this.canvas.onmousedown = (event) => {
      // First check if mouse is over the player sprite.
      if (!this.checkGrab()) return;

      this.WasGrabbing = true;

      this.startPoint = new Point(this.mouseX - this.x, this.mouseY - this.y);
    };

    // Get mouse position relative to player position on mouse up (end point).
    this.canvas.onmouseup = (event) => {
      // First check if client was grabbing the player sprite.
      if (!this.WasGrabbing) return;

      this.endPoint = new Point(this.mouseX - this.x, this.mouseY - this.y);
      this.grabVector = new Vector(this.startPoint, this.endPoint);

      this.throwPlayer();
    };
  }

  checkWASDInputs(panel) {
    if (this.IsHit) return;

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

      // Clamp player position.
      let offset = 2;

      this.x = Clamp(this.x, panel.x - panel.colliderSizeX / 2 + offset, panel.x + panel.colliderSizeX / 2 - offset);
      this.y = Clamp(this.y, panel.y - panel.colliderSizeY / 2 + offset, panel.y + panel.colliderSizeY / 2 - offset);
    }
  }

  throwPlayer() {
    if (!this.canThrow) return;

    this.vx = -(5 * this.grabVector.normalized().x);
    this.vy = -(10 * this.grabVector.normalized().y);

    this.IsGrabbing = false;
    this.WasGrabbing = false;
  }

  checkTilesOutside() {
    this.tiles.forEach((tile) => {
      if (tile.y == this.canvas.height) {
        let index = this.tiles.indexOf(tile);
        this.tiles.slice(index, 1);

        tiles.push(new Tile(0, -canvasHeight, this.canvas, this));
      }
    });
  }

  die() {
    console.log('You lost!');
    this.IsDead = true;
  }

  hit() {
    this.IsHit = true;

    this.IsGrabbing = false;
    this.WasGrabbing = false;
    this.IsOnAir = true;
    this.canThrow = false;

    this.vx = 0;
    this.vy = -3;
  }
}

function Clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
