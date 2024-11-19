import pipeCircleDownLeftTexture from '../../assets/pipe_circle_downleft.png';
import Pipe from './Pipe';

export default class PipeCircleDownLeft extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleDownLeft',
      canFlowUp: true,
      canFlowRight: true,
    });
    this.loadTexture(pipeCircleDownLeftTexture);
  }
}
