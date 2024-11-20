import startingPointRight from '../../assets/starting_point_right.png';
import Pipe from './Pipe';

export default class StartingPointRight extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'startingPointRight',
    });

    this.canFlowRight = true;

    this.interactive = false;
    this.buttonMode = false;

    this.loadTexture(startingPointRight);
  }
}
