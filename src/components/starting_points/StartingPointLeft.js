import StartingPoint from './StartingPoint';
import startingPointLeft from '../../assets/sprites/starting_points/starting_point_left.png';

/**
 * Starting point that allows water to flow leftward
 * Represents the beginning of a path flowing left
 */
export default class StartingPointLeft extends StartingPoint {
  /**
   * Creates a new leftward-flowing starting point
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointLeft',
    });

    // Set flow direction to leftward
    this.canFlowLeft = true;
    this.loadTexture(startingPointLeft);
  }
}
