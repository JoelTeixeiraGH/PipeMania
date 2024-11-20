import { Container, Graphics, Ticker, Text, TextStyle } from 'pixi.js';
import Pipe from './pipes/Pipe';

export default class WaterFlow {
  constructor({ grid }) {
    this.grid = grid;
    this.isFlowing = false;
    this.gameOver = false;
    this.currentTile = null;
    this.fillProgress = 0;

    // Create preview
    this.setupPreview();

    // Add distance goal properties
    this.targetDistance = this.generateTargetDistance();
    this.currentDistance = 0;

    // Add status
    this.hasWon = false;

    // Create UI container
    this.uiContainer = new Container();
    this.setupDistanceDisplay();
    this.grid.app.stage.addChild(this.uiContainer);
  }

  setupPreview() {
    this.previewContainer = new Container();
    this.waterPreview = new Graphics();
    this.backgroundPreview = new Graphics();
    this.previewContainer.addChild(this.backgroundPreview);
    this.previewContainer.addChild(this.waterPreview);

    // Position settings
    const gridRightX = this.grid.gridContainer.x + this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale;
    this.previewContainer.x = gridRightX + 20;
    this.previewContainer.y = this.grid.gridContainer.y;

    // Timer and animation properties
    this.waterWidth = 30;
    this.cornerRadius = 4;
    this.borderWidth = 3;
    this.totalTime = 15000;
    this.remainingTime = this.totalTime;
    this.startTime = Date.now();
    this.totalHeight = this.grid.gridRows * this.grid.spriteHeight * this.grid.spriteScale;
    this.waterHeight = this.totalHeight;
    this.waveOffset = 0;
    this.waveAmplitude = 1.5;

    this.grid.app.stage.addChild(this.previewContainer);

    // Start preview animation
    this.previewTicker = Ticker.shared.add(this.updatePreview, this);
  }

  updatePreview = (deltaMS) => {
    if (this.isFlowing) return;

    const currentTime = Date.now();
    this.remainingTime = Math.max(0, this.totalTime - (currentTime - this.startTime));
    this.waterHeight = (this.remainingTime / this.totalTime) * this.totalHeight;

    if (this.remainingTime <= 0) {
      this.startFlow();
      return;
    }

    this.backgroundPreview.clear();
    this.waterPreview.clear();

    // Draw metallic background with multiple layers
    // Outer border (darker)
    this.backgroundPreview
      .fill({ color: 0x333333 })
      .roundRect(0, 0, this.waterWidth, this.totalHeight, this.cornerRadius);

    // Inner border (metallic)
    this.backgroundPreview
      .fill({ color: 0x666666 })
      .roundRect(
        this.borderWidth,
        this.borderWidth,
        this.waterWidth - this.borderWidth * 2,
        this.totalHeight - this.borderWidth * 2,
        this.cornerRadius / 2
      );

    // Metallic shine lines
    for (let i = 0; i < 3; i++) {
      this.backgroundPreview
        .fill({ color: 0x999999, alpha: 0.3 })
        .roundRect(this.borderWidth + i * 2, 0, 2, this.totalHeight, 1);
    }

    // Wave effect
    this.waveOffset += 0.1;
    const waveX = Math.sin(this.waveOffset) * this.waveAmplitude;

    // Water colors
    const progress = this.remainingTime / this.totalTime;
    const waterColors = [
      { pos: 0, color: this.interpolateColor(progress, 0xcccccc, 0x666666) },
      { pos: 0.3, color: this.interpolateColor(progress, 0x99ccff, 0x3399cc) },
      { pos: 0.7, color: this.interpolateColor(progress, 0x6699cc, 0x336699) },
      { pos: 1, color: this.interpolateColor(progress, 0x336699, 0x333366) },
    ];

    // Draw water
    this.waterPreview
      .fill({
        color: waterColors[1].color,
        alpha: 0.9,
        gradient: waterColors,
      })
      .roundRect(
        this.borderWidth + waveX,
        this.totalHeight - this.waterHeight + this.borderWidth,
        this.waterWidth - this.borderWidth * 2,
        this.waterHeight - this.borderWidth * 2,
        this.cornerRadius / 2
      );

    // Metallic shine on water
    this.waterPreview
      .fill({ color: 0xffffff, alpha: 0.2 })
      .roundRect(
        this.borderWidth + waveX + 2,
        this.totalHeight - this.waterHeight + this.borderWidth,
        4,
        this.waterHeight - this.borderWidth * 2,
        1
      );
  };

  startFlow() {
    this.isFlowing = true;

    // Clean up preview
    const fadeOut = () => {
      this.previewContainer.alpha -= 0.05;
      if (this.previewContainer.alpha <= 0) {
        Ticker.shared.remove(this.previewTicker);
        this.grid.app.stage.removeChild(this.previewContainer);
        this.previewContainer.destroy();
        // Start water flow after preview is completely gone
        setTimeout(() => this.startWaterFlow(), 100);
      } else {
        requestAnimationFrame(fadeOut);
      }
    };

    fadeOut();
  }

  startWaterFlow() {
    this.currentTile = this.grid.startingPoint;

    if (!this.currentTile) {
      return;
    }

    this.fillProgress = 0;
    this.lastTime = Date.now();
    Ticker.shared.add(this.updateWaterFlow, this);
  }

  updateWaterFlow = () => {
    if (!this.currentTile || this.gameOver) {
      return;
    }

    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.fillProgress += deltaTime / 2;

    // Fill current pipe
    if (this.currentTile instanceof Pipe) {
      const fillAmount = Math.min(this.fillProgress, 1);
      this.fillPipe(this.currentTile, fillAmount);
    }

    // When current pipe is full
    if (this.fillProgress >= 1) {
      this.currentTile.isFilled = true;
      this.currentDistance++; // Increment distance counter
      this.updateDistanceText(); // Update the distance display

      this.fillProgress = 0;
      this.lastTime = Date.now();

      // Check if target distance reached
      if (this.currentDistance >= this.targetDistance) {
        this.handleWin();
        return;
      }

      const nextTile = this.findNextPipe();

      if (!nextTile) {
        this.handleGameOver(false); // Lost due to no valid path
        return;
      }

      this.currentTile = nextTile;
    }
  };

  fillPipe(pipe, fillAmount) {
    const waterColor = 0x0099ff;
    const startColor = 0xffffff;

    const color = this.interpolateColor(fillAmount, startColor, waterColor);
    pipe.tint = color;
    pipe.alpha = 0.8 + fillAmount * 0.2;
  }

  findNextPipe() {
    if (!this.currentTile) return null;

    const { row, col } = this.currentTile;

    const possibleMoves = [];

    // Check right
    if (this.currentTile.canFlowRight) {
      const nextTile = this.grid.getTileAt(row, col + 1);
      if (nextTile && nextTile instanceof Pipe && !nextTile.isFilled) {
        possibleMoves.push({ tile: nextTile, direction: 'right' });
      }
    }

    // Check left
    if (this.currentTile.canFlowLeft) {
      const nextTile = this.grid.getTileAt(row, col - 1);
      if (nextTile && nextTile instanceof Pipe && !nextTile.isFilled) {
        possibleMoves.push({ tile: nextTile, direction: 'left' });
      }
    }

    // Check up
    if (this.currentTile.canFlowUp) {
      const nextTile = this.grid.getTileAt(row - 1, col);
      if (nextTile && nextTile instanceof Pipe && !nextTile.isFilled) {
        possibleMoves.push({ tile: nextTile, direction: 'up' });
      }
    }

    // Check down
    if (this.currentTile.canFlowDown) {
      const nextTile = this.grid.getTileAt(row + 1, col);
      if (nextTile && nextTile instanceof Pipe && !nextTile.isFilled) {
        possibleMoves.push({ tile: nextTile, direction: 'down' });
      }
    }

    // Try each possible move
    for (const { tile, direction } of possibleMoves) {
      if (this.canConnect(this.currentTile, tile, direction)) {
        return tile;
      }
    }

    return null;
  }

  canConnect(fromPipe, toPipe, direction) {
    const canConnect = (() => {
      switch (direction) {
        case 'right':
          return fromPipe.canFlowRight && toPipe.canFlowLeft;
        case 'left':
          return fromPipe.canFlowLeft && toPipe.canFlowRight;
        case 'up':
          return fromPipe.canFlowUp && toPipe.canFlowDown;
        case 'down':
          return fromPipe.canFlowDown && toPipe.canFlowUp;
        default:
          return false;
      }
    })();

    return canConnect;
  }

  interpolateColor(progress, startColor, endColor) {
    const r1 = (startColor >> 16) & 0xff;
    const g1 = (startColor >> 8) & 0xff;
    const b1 = startColor & 0xff;

    const r2 = (endColor >> 16) & 0xff;
    const g2 = (endColor >> 8) & 0xff;
    const b2 = endColor & 0xff;

    const r = Math.floor(r1 + (r2 - r1) * progress);
    const g = Math.floor(g1 + (g2 - g1) * progress);
    const b = Math.floor(b1 + (b2 - b1) * progress);

    return (r << 16) | (g << 8) | b;
  }

  handleGameOver(wonGame = false) {
    this.gameOver = true;
    this.hasWon = wonGame;
    Ticker.shared.remove(this.updateWaterFlow);

    // Create and show game over animation
    this.showGameOverAnimation(wonGame);
  }

  showGameOverAnimation(wonGame) {
    const animContainer = new Container();
    this.grid.app.stage.addChild(animContainer);

    // Dark industrial overlay
    const overlay = new Graphics()
      .fill({ color: 0x111111, alpha: 0.85 })
      .rect(0, 0, this.grid.app.screen.width, this.grid.app.screen.height);
    animContainer.addChild(overlay);

    // Industrial message style
    const messageStyle = {
      fontFamily: 'Impact',
      fontSize: 64,
      fontWeight: 'bold',
      fill: wonGame ? '#FFD700' : '#FF3333',
      stroke: {
        color: '#2A2A2A',
        width: 6,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 6,
      letterSpacing: 4,
      lineJoin: 'bevel',
    };

    const message = new Text({
      text: wonGame ? 'MISSION COMPLETE' : 'SYSTEM FAILURE',
      style: messageStyle,
    });

    message.anchor.set(0.5);
    message.position.set(this.grid.app.screen.width / 2, this.grid.app.screen.height / 2 - 20);

    message.scale.set(0);
    animContainer.addChild(message);

    // Animate message
    let scale = 0;
    const animate = () => {
      if (scale < 1) {
        scale += 0.05;
        message.scale.set(scale);
        requestAnimationFrame(animate);
      }
    };
    animate();

    // Industrial stats style
    const statsStyle = {
      fontFamily: 'Impact',
      fontSize: 28,
      fill: '#A4A4A4',
      stroke: {
        color: '#2A2A2A',
        width: 2,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 3,
      letterSpacing: 2,
    };

    const statsText = new Text({
      text: wonGame
        ? `PIPES CONNECTED: ${this.currentDistance}`
        : `SYSTEM HALT AT: ${this.currentDistance}/${this.targetDistance}`,
      style: statsStyle,
    });

    statsText.anchor.set(0.5);
    statsText.position.set(this.grid.app.screen.width / 2, message.y + message.height + 40);
    statsText.alpha = 0;
    animContainer.addChild(statsText);

    // Fade in stats text
    const fadeInStats = () => {
      if (statsText.alpha < 1) {
        statsText.alpha += 0.05;
        requestAnimationFrame(fadeInStats);
      }
    };
    setTimeout(fadeInStats, 500);

    // Add metallic shine effect for win
    if (wonGame) {
      const shine = new Graphics().fill({ color: 0xffffff, alpha: 0.3 }).circle(0, 0, 120);

      shine.position.set(message.x, message.y);
      shine.scale.set(0);
      animContainer.addChildAt(shine, 0);

      // Animate shine with metallic effect
      let shineScale = 0;
      const animateShine = () => {
        if (shineScale < 2) {
          shineScale += 0.04;
          shine.scale.set(shineScale);
          shine.alpha = Math.max(0, 0.3 - shineScale / 4);
          requestAnimationFrame(animateShine);
        }
      };
      setTimeout(animateShine, 200);
    }
  }

  handleWin() {
    this.handleGameOver(true);
  }

  // Add method to get current progress
  getProgress() {
    return {
      current: this.currentDistance,
      target: this.targetDistance,
      percentage: (this.currentDistance / this.targetDistance) * 100,
    };
  }

  generateTargetDistance() {
    // Generate random number between 15-20
    return Math.floor(Math.random() * (20 - 15 + 1)) + 15;
  }

  setupDistanceDisplay() {
    const textStyle = {
      fontFamily: 'Impact',
      fontSize: 32,
      fill: '#FFD700',
      stroke: {
        color: '#2A2A2A',
        width: 4,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 3,
      letterSpacing: 2,
      lineJoin: 'bevel',
    };

    this.distanceText = new Text({
      text: '',
      style: textStyle,
    });

    // Center based on grid position
    this.distanceText.anchor.set(0.5, 0);
    this.distanceText.position.set(
      this.grid.gridContainer.x + (this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale) / 2,
      20
    );

    this.updateDistanceText();
    this.uiContainer.addChild(this.distanceText);
  }

  updateDistanceText() {
    this.distanceText.text = `DISTANCE: ${this.currentDistance}/${this.targetDistance}`;
  }
}
