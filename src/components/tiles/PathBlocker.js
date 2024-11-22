import pathBlockerTexture from '../../assets/sprites/tiles/path_blocker.png';
import Tile from './Tile';

/**
 * Class representing a blocked tile in the game grid
 * These tiles cannot be replaced or have pipes placed on them
 */
export default class PathBlocker extends Tile {
  /**
   * Creates a new PathBlocker instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pathBlocker',
    });

    // Load the blocker texture
    this.loadTexture(pathBlockerTexture);
  }
}
