import Tile from '../tiles/Tile';

/**
 * Base class for all pipe tiles in the game
 * Handles pipe flow directions, states, and interactions
 */
export default class Pipe extends Tile {
  /**
   * Creates a new Pipe instance
   * @param {Object} params - Pipe initialization parameters
   * @param {number} params.row - Grid row position
   * @param {number} params.col - Grid column position
   * @param {string} params.label - Pipe identifier label
   */
  constructor({ row, col, label }) {
    super({ row, col, label });

    // Initialize flow direction flags
    this.canFlowUp = false;
    this.canFlowDown = false;
    this.canFlowLeft = false;
    this.canFlowRight = false;

    // Initialize pipe state
    this.isFilled = false;
    this.isFlowing = false;

    // Make pipe interactive
    this.makeInteractive();
  }

  /**
   * Makes the pipe interactive and sets up click handler
   * @override
   */
  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', () => {
      if (!this.isLocked()) {
        this.emit('tile:clicked', this);
      }
    });
  }

  /**
   * Checks if the pipe is locked (filled or currently flowing)
   * @returns {boolean} Whether the pipe is locked
   */
  isLocked() {
    return this.isFilled || this.isFlowing;
  }

  /**
   * Marks the pipe as filled with water
   */
  setFilled() {
    this.isFilled = true;
    this.isFlowing = false;
    this.cursor = 'not-allowed';
  }

  /**
   * Starts water flow through the pipe
   */
  startFlowing() {
    this.isFlowing = true;
    this.cursor = 'not-allowed';
  }

  /**
   * Stops water flow through the pipe
   */
  stopFlowing() {
    this.isFlowing = false;
    if (!this.isFilled) {
      this.cursor = 'pointer';
    }
  }
}
