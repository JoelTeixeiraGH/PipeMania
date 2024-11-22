import pipeVertical from '../../assets/sprites/pipes/pipe_vertical.png';
import Pipe from './Pipe';

/**
 * Class representing a straight vertical pipe
 * Allows water to flow up and down
 */
export default class PipeVertical extends Pipe {
  /**
   * Creates a new vertical pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({ row, col, label: 'pipeVertical' });

    // Set flow directions for vertical pipe
    this.canFlowUp = true;
    this.canFlowDown = true;

    // Load pipe-specific texture
    this.loadTexture(pipeVertical);
  }
}
