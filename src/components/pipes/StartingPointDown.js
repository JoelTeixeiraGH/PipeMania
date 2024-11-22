import { Texture } from 'pixi.js';
import Pipe from './Pipe';
import startingPointDown from '../../assets/sprites/starting_points/starting_point_down.png';

export default class StartingPointDown extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointDown',
    });

    this.canFlowDown = true;

    this.loadTexture(startingPointDown);
  }

  isLocked() {
    return true;
  }
}
