import { Texture } from 'pixi.js';
import Pipe from './Pipe';
import startingPointLeft from '../../assets/sprites/starting_points/starting_point_left.png';

export default class StartingPointLeft extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointLeft',
    });

    this.canFlowLeft = true;

    this.loadTexture(startingPointLeft);

    this.makeInteractive();
  }

  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'not-allowed';
  }

  isLocked() {
    return true;
  }
}
