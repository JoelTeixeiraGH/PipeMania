import chain from '../../assets/sprites/tiles/chain.png';
import Tile from './Tile';

/**
 * Class representing a chain tile in the game grid
 * These tiles can be replaced with pipes during gameplay
 */
export default class Chain extends Tile {
  /**
   * Creates a new Chain instance
   * @param {number} row - Grid row position
   * @param {number} col - Grid column position
   */
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'chain',
    });

    // Make the chain tile interactive for player interaction
    this.makeInteractive();

    // Load the chain texture
    this.loadTexture(chain);
  }
}
