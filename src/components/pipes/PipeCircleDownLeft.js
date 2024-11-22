import pipeCircleDownLeftTexture from '../../assets/sprites/pipes/pipe_circle_downleft.png';
import Pipe from './Pipe';

/**
 * Class representing a curved pipe that connects up and right directions
 * Forms a quarter circle from up to right
 */
export default class PipeCircleDownLeft extends Pipe {
  /**
   * Creates a new curved pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleDownLeft',
    });

    // Set flow directions for this pipe type
    this.canFlowUp = true;
    this.canFlowRight = true;

    // Load pipe-specific texture
    this.loadTexture(pipeCircleDownLeftTexture);
  }
}
