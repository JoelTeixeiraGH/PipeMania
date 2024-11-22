import { Container, Ticker } from 'pixi.js';
import Pipe from '../pipes/Pipe';
import WaterPreviewBar from '../ui/hud/WaterPreviewBar';
import GameOverScreen from '../ui/screens/GameOverScreen';
import WinScreen from '../ui/screens/WinScreen';
import DistanceDisplay from '../ui/hud/DistanceDisplay';

/**
 * Class managing water flow mechanics and game progression
 * Handles water animation, pipe connections, and game state
 */
export default class WaterFlow {
  /** Color of water when pipe is fully filled */
  static WATER_COLOR = 0x0099ff;
  /** Starting color when water begins filling pipe */
  static START_COLOR = 0xffffff;
  /** Speed at which pipes fill with water (2 seconds per pipe) */
  static FILL_SPEED = 0.5;
  /** Minimum distance required to win */
  static MIN_TARGET_DISTANCE = 15;
  /** Maximum distance possible to win */
  static MAX_TARGET_DISTANCE = 20;

  /**
   * Creates a new WaterFlow instance
   * @param {Object} params - Initialization parameters
   * @param {Grid} params.grid - Reference to the game grid
   */
  constructor({ grid }) {
    this.grid = grid;
    this.initializeGameState();
    this.initializeUI();
  }

  /**
   * Initializes game state variables
   */
  initializeGameState() {
    this.isFlowing = false;
    this.gameOver = false;
    this.currentTile = null;
    this.fillProgress = 0;
    this.targetDistance = this.generateTargetDistance();
    this.currentDistance = 0;
    this.hasWon = false;
    this.lastTime = Date.now();
  }

  /**
   * Sets up all UI components
   */
  initializeUI() {
    this.setupUIContainer();
    this.setupWaterPreviewBar();
    this.setupDistanceDisplay();
  }

  /**
   * Creates and sets up the main UI container
   */
  setupUIContainer() {
    this.uiContainer = new Container();
    this.grid.app.stage.addChild(this.uiContainer);
  }

  /**
   * Sets up the water preview bar UI element
   */
  setupWaterPreviewBar() {
    this.waterPreviewBar = new WaterPreviewBar({
      grid: this.grid,
      getFlowState: () => this.isFlowing,
    });
    this.waterPreviewBar.onTimeUp = () => this.startFlow();
    this.grid.app.stage.addChild(this.waterPreviewBar.container);
  }

  /**
   * Sets up the distance display UI element
   */
  setupDistanceDisplay() {
    this.distanceDisplay = new DistanceDisplay({ grid: this.grid });
    this.distanceDisplay.update(this.currentDistance, this.targetDistance);
    this.uiContainer.addChild(this.distanceDisplay.container);
  }

  /**
   * Initiates the water flow sequence
   */
  async startFlow() {
    this.isFlowing = true;
    await this.waterPreviewBar.fadeOut();
    this.waterPreviewBar.destroy();
    setTimeout(() => this.startWaterFlow(), 100);
  }

  /**
   * Starts the water flow animation
   */
  startWaterFlow() {
    this.currentTile = this.grid.startingPoint;
    if (!this.currentTile) return;

    this.fillProgress = 0;
    this.lastTime = Date.now();
    Ticker.shared.add(this.updateWaterFlow, this);
  }

  /**
   * Updates water flow animation each frame
   */
  updateWaterFlow = () => {
    if (!this.canContinueFlow()) return;

    this.updateFillProgress();
    this.fillCurrentPipe();
    this.checkPipeCompletion();
  };

  /**
   * Checks if water can continue flowing
   * @returns {boolean} Whether flow can continue
   */
  canContinueFlow() {
    return this.currentTile && !this.gameOver;
  }

  /**
   * Updates the fill progress based on elapsed time
   */
  updateFillProgress() {
    const deltaTime = (Date.now() - this.lastTime) / 1000;
    this.lastTime = Date.now();
    this.fillProgress += deltaTime * WaterFlow.FILL_SPEED;
  }

  /**
   * Fills the current pipe with water if it's a valid pipe
   */
  fillCurrentPipe() {
    if (this.currentTile instanceof Pipe) {
      const fillAmount = Math.min(this.fillProgress, 1);
      this.fillPipe(this.currentTile, fillAmount);
    }
  }

  /**
   * Checks if current pipe is completely filled
   */
  checkPipeCompletion() {
    if (this.fillProgress >= 1) {
      this.completePipe();
    }
  }

  /**
   * Handles pipe completion and moves to next pipe
   */
  completePipe() {
    this.currentTile.setFilled();
    this.updateDistance();

    if (this.currentDistance >= this.targetDistance) {
      this.handleWin();
      return;
    }

    this.moveToNextPipe();
  }

  /**
   * Updates the distance counter and UI
   */
  updateDistance() {
    this.currentDistance++;
    this.distanceDisplay.update(this.currentDistance, this.targetDistance);
    this.fillProgress = 0;
    this.lastTime = Date.now();
  }

  /**
   * Moves to the next pipe in the sequence
   */
  moveToNextPipe() {
    const nextTile = this.findNextPipe();
    if (!nextTile) {
      this.handleGameOver(false);
      return;
    }
    this.currentTile = nextTile;
  }

  /**
   * Fills a pipe with water and updates its appearance
   * @param {Pipe} pipe - The pipe to fill
   * @param {number} fillAmount - Amount to fill (0-1)
   */
  fillPipe(pipe, fillAmount) {
    if (fillAmount > 0 && !pipe.isFlowing) {
      pipe.startFlowing();
    }

    const color = this.interpolateColor(fillAmount, WaterFlow.START_COLOR, WaterFlow.WATER_COLOR);

    pipe.tint = color;
    pipe.alpha = 0.8 + fillAmount * 0.2;
  }

  /**
   * Finds the next valid pipe in the sequence
   * @returns {Pipe|null} Next pipe or null if none found
   */
  findNextPipe() {
    if (!this.currentTile) return null;

    const directions = this.getValidDirections();
    for (const { tile, direction } of directions) {
      if (this.canConnect(this.currentTile, tile, direction)) {
        return tile;
      }
    }
    return null;
  }

  /**
   * Gets all valid directions from current position
   * @returns {Array<{tile: Pipe, direction: string}>} Valid directions
   */
  getValidDirections() {
    const { row, col } = this.currentTile;
    const directions = [];

    this.checkDirection(row, col + 1, 'right', directions);
    this.checkDirection(row, col - 1, 'left', directions);
    this.checkDirection(row - 1, col, 'up', directions);
    this.checkDirection(row + 1, col, 'down', directions);

    return directions;
  }

  /**
   * Checks if a direction is valid and adds it to directions array
   * @param {number} row - Row to check
   * @param {number} col - Column to check
   * @param {string} direction - Direction
   * @param {Array<{tile: Pipe, direction: string}>} directions - Directions array
   */
  checkDirection(row, col, direction, directions) {
    const nextTile = this.grid.getTileAt(row, col);
    if (nextTile && nextTile instanceof Pipe && !nextTile.isFilled) {
      directions.push({ tile: nextTile, direction });
    }
  }

  /**
   * Checks if two pipes can connect
   * @param {Pipe} fromPipe - Starting pipe
   * @param {Pipe} toPipe - Ending pipe
   * @param {string} direction - Direction of connection
   * @returns {boolean} Whether pipes can connect
   */
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

  /**
   * Interpolates between two colors
   * @param {number} progress - Progress between 0 and 1
   * @param {number} startColor - Starting color
   * @param {number} endColor - Ending color
   * @returns {number} Interpolated color
   */
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

  /**
   * Handles game over sequence
   * @param {boolean} wonGame - Whether the player won the game
   */
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

  /**
   * Handles win sequence
   */
  handleWin() {
    this.handleGameOver(true);
  }

  /**
   * Gets current progress
   * @returns {Object} Current progress
   */
  getProgress() {
    return {
      current: this.currentDistance,
      target: this.targetDistance,
      percentage: (this.currentDistance / this.targetDistance) * 100,
    };
  }

  /**
   * Generates target distance
   * @returns {number} Target distance
   */
  generateTargetDistance() {
    // Generate random number between 15-20
    return Math.floor(Math.random() * (20 - 15 + 1)) + 15;
  }

  /**
   * Destroys all UI components and removes event listeners
   */
  destroy() {
    Ticker.shared.remove(this.updateWaterFlow);
    this.waterPreviewBar?.destroy();
    this.distanceDisplay?.destroy();
    this.uiContainer.destroy({ children: true });
  }
}
