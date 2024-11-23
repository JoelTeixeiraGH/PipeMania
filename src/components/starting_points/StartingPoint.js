import { Texture } from 'pixi.js';
import Pipe from '../pipes/Pipe';

/**
 * Base class for all starting points
 * Extends the Pipe class to provide common starting point functionality
 */
export default class StartingPoint extends Pipe {
  /**
   * Creates a new starting point
   * @param {Object} params - Initialization parameters
   * @param {number} params.row - Grid row position
   * @param {number} params.col - Grid column position
   * @param {string} params.label - Unique identifier for the starting point
   */
  constructor({ row, col, label }) {
    super({ row, col, label });
  }

  /**
   * Indicates if the pipe can be moved/rotated
   * Starting points are always locked in place
   * @returns {boolean} Always returns true for starting points
   */
  isLocked() {
    return true;
  }
}
