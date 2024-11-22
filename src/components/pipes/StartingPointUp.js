import { Texture } from 'pixi.js';
import Pipe from './Pipe';
import startingPointUp from '../../assets/sprites/starting_points/starting_point_up.png';

export default class StartingPointUp extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointUp',
    });

    this.canFlowUp = true;

    this.loadTexture(startingPointUp);

    this.makeInteractive();
  }

  isLocked() {
    return true;
  }
}
