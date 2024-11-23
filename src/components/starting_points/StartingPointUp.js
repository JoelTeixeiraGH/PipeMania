import StartingPoint from './StartingPoint';
import startingPointUp from '../../assets/sprites/starting_points/starting_point_up.png';

/**
 * Starting point that allows water to flow upward
 * Represents the beginning of a path flowing up
 */
export default class StartingPointUp extends StartingPoint {
  /**
   * Creates a new upward-flowing starting point
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointUp',
    });

    // Set flow direction to upward
    this.canFlowUp = true;
    this.loadTexture(startingPointUp);
  }
}
