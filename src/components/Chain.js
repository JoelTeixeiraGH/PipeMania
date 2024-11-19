import chain from '../assets/bg_basic_tile.png';
import Tile from './Tile';

export default class Chain extends Tile {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'chain',
    });

    // These two, maybe can pass to the tile class
    this.interactive = true;
    this.buttonMode = true;

    this.loadTexture(chain);

    this.on('pointerdown', (event) => this.onPointerDown(event));
  }

  onPointerDown(event) {
    console.log('cliquei');
  }
}
