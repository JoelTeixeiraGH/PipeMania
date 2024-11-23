import StartingPoint from './StartingPoint';
import startingPointRight from '../../assets/sprites/starting_points/starting_point_right.png';

/**
 * Starting point that allows water to flow rightward
 * Represents the beginning of a path flowing right
 */
export default class StartingPointRight extends StartingPoint {
  /**
   * Creates a new rightward-flowing starting point
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointRight',
    });

    // Set flow direction to rightward
    this.canFlowRight = true;
    this.loadTexture(startingPointRight);
  }
}
