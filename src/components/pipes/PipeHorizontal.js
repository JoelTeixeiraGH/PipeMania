import pipeHorizontal from '../../assets/pipe_horizontal.png';
import Pipe from './Pipe';

export default class PipeHorizontal extends Pipe {
  constructor(row, col) {
    super({ row, col, label: 'pipeHorizontal' });

    this.canFlowLeft = true;
    this.canFlowRight = true;

    this.loadTexture(pipeHorizontal);
  }
}
