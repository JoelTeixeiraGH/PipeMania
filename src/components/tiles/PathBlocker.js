import pathBlockerTexture from '../../assets/sprites/tiles/path_blocker.png';
import Tile from './Tile';

export default class PathBlocker extends Tile {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pathBlocker',
    });

    this.interactive = true;
    this.cursor = 'not-allowed';

    this.loadTexture(pathBlockerTexture);
  }
}
