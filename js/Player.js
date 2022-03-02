class Player {
  constructor(x, y, canvasElement, game) {
    // Player draw.
    this.sprites = {};
    this.state = 'idle';

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
    this.last = 0;
    this.score = 0;

    // Player physics
    this.vx = 0;
    this.vy = 0;
    this.grav = 0.3;
    this.throwXForce = 6;
    this.throwYForce = 11;

    // Game references
    this.canvas = canvasElement;
    this.context = canvasElement.getContext('2d');
    this.panels = [];
    this.tiles = [];
    this.enemies = [];
    this.game = game;

    // Player sprites direction/path pair value.
    const playerSprites = { idle: '../sprites/player.png', left: '../sprites/playerLeft.png', right: '../sprites/playerRight.png' };

    // Load and storing player sprites.
    for (var state in playerSprites) {
      this.sprites[state] = new Image();
      this.sprites[state].src = playerSprites[state];
    }
  }

  draw() {
    this.context.drawImage(this.sprites[this.state], this.x - this.spriteSizeX / 2, this.y - this.spriteSizeY / 2, this.spriteSizeX, this.spriteSizeY);
  }

  update(now) {
    if (this.IsDead) return;

    if (!this.last || now - this.last >= 2 * 1000) {
      this.last = now;
      this.score++;
      console.log(this.score);
    }

    // Die if goes below fire.
    if (this.y - this.spriteSizeY / 2 > this.canvas.height) {
      this.die();
    }

    // Enable WASD movement if player is inside windows.
    this.panels.forEach((panel) => {
      if (panel.checkPlayerInside()) {
        this.checkWASDInputs(panel);
        this.FirstTime = false;
      } else if (!this.FirstTime && panel.checkPlayerInside()) this.IsOnAir = true;
    });

    // Get mouse click and drag.
    this.checkMouseInputs();

    // Get mouse position inside canvas boundaries.
    this.mousePosition();

    // Logic for physics.
    this.physicsUpdate();

    // Bounce if colliding with tower borders.
    this.checkCanvasBorders();

    // Generate new Tile.
    this.checkTilesOutside();

    // Check intersection with enemies body.
    this.checkKillEnemies();
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

    this.vx = -(this.throwXForce * this.grabVector.normalized().x);
    this.vy = -(this.throwYForce * this.grabVector.normalized().y);

    this.IsGrabbing = false;
    this.WasGrabbing = false;
  }

  checkTilesOutside() {
    this.tiles.forEach((tile) => {
      if (tile.y >= this.canvas.height && tile.y <= this.canvas.height + 0.2) {
        let index = this.tiles.indexOf(tile);
        this.tiles.splice(index, 1);

        this.tiles.push(new Tile(0, -canvasHeight, this.canvas, this));
        console.log('Tile generated!');
      }
    });
  }

  checkCanvasBorders() {
    const leftBorder = 32;
    const rightBorder = canvasWidth - 32;

    if (this.x + this.spriteSizeX / 2 >= rightBorder || this.x - this.spriteSizeX / 2 <= leftBorder) {
      this.vx = -this.vx;
    }
  }

  checkKillEnemies() {
    this.enemies.forEach((enemy) => {
      let checkX = this.x >= enemy.x - enemy.colliderSizeX / 2 && this.x <= enemy.x + enemy.colliderSizeX / 2;
      let checkY = this.y <= enemy.y + enemy.colliderSizeY / 2 && this.y >= enemy.y - enemy.colliderSizeY / 2;

      let checkUpBorder = this.y >= enemy.y - enemy.colliderSizeY / 2 && this.y <= enemy.y;

      if (checkUpBorder && checkX && checkY && Math.sign(this.vy * 2) === 1) {
        this.vy += -Math.abs(this.vy * 2);
        enemy.grav = 0.1;
      }
    });
  }

  die() {
    console.log('You lost!');
    this.IsDead = true;
    
    //this.game.metersText.innerText = this.score;
    this.game.displayScreen('end');
    this.metersText = this.game.screens['end'].querySelector('p > span');
    this.metersText.innerText = this.score;
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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
