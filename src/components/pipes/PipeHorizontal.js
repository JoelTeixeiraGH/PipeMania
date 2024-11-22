import pipeHorizontal from '../../assets/sprites/pipes/pipe_horizontal.png';
import Pipe from './Pipe';

/**
 * Class representing a straight horizontal pipe
 * Allows water to flow left and right
 */
export default class PipeHorizontal extends Pipe {
  /**
   * Creates a new horizontal pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({ row, col, label: 'pipeHorizontal' });

    // Set flow directions for horizontal pipe
    this.canFlowLeft = true;
    this.canFlowRight = true;

    // Load pipe-specific texture
    this.loadTexture(pipeHorizontal);
  }
}
