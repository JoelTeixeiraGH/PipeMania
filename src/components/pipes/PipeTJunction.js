import pipeTJunctionTexture from '../../assets/sprites/pipes/pipe_tjunction.png';
import Pipe from './Pipe';

/**
 * Class representing a T-junction pipe
 * Allows water to flow in all four directions
 */
export default class PipeTJunction extends Pipe {
  /**
   * Creates a new T-junction pipe instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeTJunction',
    });

    // Set flow directions for T-junction (all directions)
    this.canFlowUp = true;
    this.canFlowDown = true;
    this.canFlowLeft = true;
    this.canFlowRight = true;

    // Load pipe-specific texture
    this.loadTexture(pipeTJunctionTexture);
  }
}
