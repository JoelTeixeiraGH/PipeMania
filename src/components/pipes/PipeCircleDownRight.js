import pipeCircleDownRightTexture from '../../assets/pipe_circle_downright.png';
import Pipe from './Pipe';

export default class PipeCircleDownRight extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleDownRight',
      canFlowUp: true,
      canFlowLeft: true,
    });
    this.loadTexture(pipeCircleDownRightTexture);
  }
}
