import pipeVerticalTexture from '../../assets/pipe_vertical.png';
import Pipe from './Pipe';

export default class PipeVertical extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeHorizontal',
      canFlowUp: true,
      canFlowDown: true,
    });
    this.loadTexture(pipeVerticalTexture);
  }
}
