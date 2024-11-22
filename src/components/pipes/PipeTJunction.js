import pipeTJunctionTexture from '../../assets/sprites/pipes/pipe_tjunction.png';
import Pipe from './Pipe';

export default class PipeTJunction extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeTJunction',
    });

    this.canFlowUp = true;
    this.canFlowDown = true;
    this.canFlowLeft = true;
    this.canFlowRight = true;

    this.loadTexture(pipeTJunctionTexture);
  }
}
