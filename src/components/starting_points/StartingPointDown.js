import StartingPoint from './StartingPoint';
import startingPointDown from '../../assets/sprites/starting_points/starting_point_down.png';

/**
 * Starting point that allows water to flow downward
 * Represents the beginning of a path flowing down
 */
export default class StartingPointDown extends StartingPoint {
  /**
   * Creates a new downward-flowing starting point
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointDown',
    });

    // Set flow direction to downward
    this.canFlowDown = true;
    this.loadTexture(startingPointDown);
  }
}
