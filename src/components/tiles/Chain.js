import chain from '../../assets/sprites/tiles/chain.png';
import Tile from './Tile';

export default class Chain extends Tile {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'chain',
    });

    this.makeInteractive();

    this.loadTexture(chain);
  }
}
