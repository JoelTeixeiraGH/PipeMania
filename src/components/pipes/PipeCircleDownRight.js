import pipeCircleDownRightTexture from '../../assets/sprites/pipes/pipe_circle_downright.png';
import Pipe from './Pipe';

/**
 * Class representing a curved pipe that connects up and left directions
 * Forms a quarter circle from up to left
 */
export default class PipeCircleDownRight extends Pipe {
  /**
   * Creates a new curved pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleDownRight',
    });

    // Set flow directions for this pipe type
    this.canFlowUp = true;
    this.canFlowLeft = true;

    // Load pipe-specific texture
    this.loadTexture(pipeCircleDownRightTexture);
  }
}
