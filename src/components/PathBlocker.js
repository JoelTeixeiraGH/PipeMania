import pathBlockerTexture from '../assets/blocked_tile.png';
import Tile from './Tile';

export default class PathBlocker extends Tile {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pathBlocker',
    });
    this.interactive = false;
    this.buttonMode = false;
    this.loadTexture(pathBlockerTexture);
  }
}
