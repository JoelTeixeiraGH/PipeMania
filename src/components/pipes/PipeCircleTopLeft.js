import pipeCircleTopLeftTexture from '../../assets/sprites/pipes/pipe_circle_topleft.png';
import Pipe from './Pipe';

/**
 * Class representing a curved pipe that connects down and right directions
 * Forms a quarter circle from down to right
 */
export default class PipeCircleTopLeft extends Pipe {
  /**
   * Creates a new curved pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleTopLeft',
    });

    // Set flow directions for this pipe type
    this.canFlowDown = true;
    this.canFlowRight = true;

    // Load pipe-specific texture
    this.loadTexture(pipeCircleTopLeftTexture);
  }
}
