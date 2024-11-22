import pipeCircleTopRightTexture from '../../assets/sprites/pipes/pipe_circle_topright.png';
import Pipe from './Pipe';

/**
 * Class representing a curved pipe that connects down and left directions
 * Forms a quarter circle from down to left
 */
export default class PipeCircleTopRight extends Pipe {
  /**
   * Creates a new curved pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleTopRight',
    });

    // Set flow directions for this pipe type
    this.canFlowDown = true;
    this.canFlowLeft = true;

    // Load pipe-specific texture
    this.loadTexture(pipeCircleTopRightTexture);
  }
}
