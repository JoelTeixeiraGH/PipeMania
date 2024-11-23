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
   * Direction constants for pipe flow
   * @enum {string}
   */
  static DIRECTION = {
    RIGHT: 'right',
    LEFT: 'left',
    UP: 'up',
    DOWN: 'down',
  };

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
   * Finds the next valid pipe in the sequence, prioritizing paths with more connections
   * @returns {Pipe|null} Next pipe or null if none found
   */
  findNextPipe() {
    if (!this.currentTile) return null;

    const validPaths = this.getValidDirections()
      .filter(({ tile, direction }) => this.canConnect(this.currentTile, tile, direction))
      .map((path) => ({
        ...path,
        connectionScore: this.calculatePathScore(path.tile),
      }))
      .sort((a, b) => b.connectionScore - a.connectionScore); // Sort by highest score first

    return validPaths.length > 0 ? validPaths[0].tile : null;
  }

  /**
   * Calculates a score for a path based on number of connected pipes
   * @param {Pipe} startPipe - The pipe to start checking from
   * @param {Set<string>} visited - Set of visited positions (for recursion)
   * @param {number} depth - Current recursion depth
   * @returns {number} Score for the path
   */
  calculatePathScore(startPipe, visited = new Set(), depth = 0) {
    // Limit recursion depth to prevent infinite loops
    const MAX_DEPTH = 5;
    if (depth >= MAX_DEPTH) return 0;

    // Create position key for visited set
    const posKey = `${startPipe.row},${startPipe.col}`;
    if (visited.has(posKey)) return 0;
    visited.add(posKey);

    // Get all possible connections from this pipe
    const connections = this.getPossibleConnections(startPipe);
    if (connections.length === 0) return 1;

    // Recursively calculate scores for each connection
    const connectionScores = connections.map((nextPipe) =>
      this.calculatePathScore(nextPipe, new Set(visited), depth + 1)
    );

    // Return sum of all connection scores plus this pipe
    return 1 + connectionScores.reduce((sum, score) => sum + score, 0);
  }

  /**
   * Gets all possible pipe connections from a given pipe
   * @param {Pipe} pipe - The pipe to check connections from
   * @returns {Array<Pipe>} Array of connected pipes
   */
  getPossibleConnections(pipe) {
    const connections = [];
    const { row, col } = pipe;

    // Check each direction (keeping original approach)
    if (pipe.canFlowRight) {
      const rightPipe = this.grid.getTileAt(row, col + 1);
      if (rightPipe instanceof Pipe && !rightPipe.isFilled && rightPipe.canFlowLeft) {
        connections.push(rightPipe);
      }
    }

    if (pipe.canFlowLeft) {
      const leftPipe = this.grid.getTileAt(row, col - 1);
      if (leftPipe instanceof Pipe && !leftPipe.isFilled && leftPipe.canFlowRight) {
        connections.push(leftPipe);
      }
    }

    if (pipe.canFlowUp) {
      const upPipe = this.grid.getTileAt(row - 1, col);
      if (upPipe instanceof Pipe && !upPipe.isFilled && upPipe.canFlowDown) {
        connections.push(upPipe);
      }
    }

    if (pipe.canFlowDown) {
      const downPipe = this.grid.getTileAt(row + 1, col);
      if (downPipe instanceof Pipe && !downPipe.isFilled && downPipe.canFlowUp) {
        connections.push(downPipe);
      }
    }

    return connections;
  }

  /**
   * Gets all valid directions from current position
   * @returns {Array<{tile: Pipe, direction: string}>} Valid directions
   */
  getValidDirections() {
    const { row, col } = this.currentTile;
    const directions = [];

    this.checkDirection(row, col + 1, WaterFlow.DIRECTION.RIGHT, directions);
    this.checkDirection(row, col - 1, WaterFlow.DIRECTION.LEFT, directions);
    this.checkDirection(row - 1, col, WaterFlow.DIRECTION.UP, directions);
    this.checkDirection(row + 1, col, WaterFlow.DIRECTION.DOWN, directions);

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
      case WaterFlow.DIRECTION.RIGHT:
        return fromPipe.canFlowRight && toPipe.canFlowLeft;
      case WaterFlow.DIRECTION.LEFT:
        return fromPipe.canFlowLeft && toPipe.canFlowRight;
      case WaterFlow.DIRECTION.UP:
        return fromPipe.canFlowUp && toPipe.canFlowDown;
      case WaterFlow.DIRECTION.DOWN:
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
