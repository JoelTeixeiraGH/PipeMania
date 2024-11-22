import { Container, Ticker } from 'pixi.js';
import Pipe from '../pipes/Pipe';
import WaterPreviewBar from '../ui/hud/WaterPreviewBar';
import GameOverScreen from '../ui/screens/GameOverScreen';
import WinScreen from '../ui/screens/WinScreen';
import DistanceDisplay from '../ui/hud/DistanceDisplay';

export default class WaterFlow {
  constructor({ grid }) {
    this.grid = grid;
    this.isFlowing = false;
    this.gameOver = false;
    this.currentTile = null;
    this.fillProgress = 0;

    // Initialize game properties
    this.targetDistance = this.generateTargetDistance();
    this.currentDistance = 0;
    this.hasWon = false;

    // Initialize UI
    this.initializeUI();
  }

  initializeUI() {
    this.uiContainer = new Container();
    this.grid.app.stage.addChild(this.uiContainer);

    // Create water preview bar
    this.waterPreviewBar = new WaterPreviewBar({
      grid: this.grid,
      getFlowState: () => this.isFlowing,
    });
    this.waterPreviewBar.onTimeUp = () => this.startFlow();
    this.grid.app.stage.addChild(this.waterPreviewBar.container);

    // Create distance display
    this.distanceDisplay = new DistanceDisplay({ grid: this.grid });
    this.distanceDisplay.update(this.currentDistance, this.targetDistance);
    this.uiContainer.addChild(this.distanceDisplay.container);
  }

  async startFlow() {
    this.isFlowing = true;
    await this.waterPreviewBar.fadeOut();
    this.waterPreviewBar.destroy();
    setTimeout(() => this.startWaterFlow(), 100);
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
      this.currentTile.setFilled();
      this.currentDistance++;
      this.distanceDisplay.update(this.currentDistance, this.targetDistance);

      this.fillProgress = 0;
      this.lastTime = Date.now();

      // Check if target distance reached
      if (this.currentDistance >= this.targetDistance) {
        this.handleWin();
        return;
      }

      const nextTile = this.findNextPipe();

      if (!nextTile) {
        this.handleGameOver(false);
        return;
      }

      this.currentTile = nextTile;
    }
  };

  fillPipe(pipe, fillAmount) {
    // Mark pipe as flowing when filling starts
    if (fillAmount > 0 && !pipe.isFlowing) {
      pipe.startFlowing();
    }

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
    this.grid.gameOver = true;

    const ScreenComponent = wonGame ? WinScreen : GameOverScreen;
    const screen = new ScreenComponent({
      app: this.grid.app,
      currentDistance: this.currentDistance,
      targetDistance: this.targetDistance,
      onRestart: () => {
        // Get reference to the game instance
        const game = this.grid.app.game;
        if (game) {
          game.restart();
        }
      },
    });

    this.grid.app.stage.addChild(screen.container);
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

  destroy() {
    Ticker.shared.remove(this.updateWaterFlow);
    this.waterPreviewBar?.destroy();
    this.distanceDisplay?.destroy();
    this.uiContainer.destroy({ children: true });
  }
}
