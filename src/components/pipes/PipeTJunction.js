import pipeVerticalTexture from '../../assets/pipe_vertical.png';
import Pipe from './Pipe';

export default class PipeTJunction extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeTJunction',
      canFlowUp: true,
      canFlowDown: true,
      canFlowLeft: true,
      canFlowRight: true,
    });
    this.loadTexture(pipeVerticalTexture);
  }
}
