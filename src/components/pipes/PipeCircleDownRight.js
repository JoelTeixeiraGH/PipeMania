import pipeCircleDownRightTexture from '../../assets/pipe_circle_downright.png';
import Pipe from './Pipe';

export default class PipeCircleDownRight extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleDownRight',
    });

    this.canFlowUp = true;
    this.canFlowLeft = true;

    this.loadTexture(pipeCircleDownRightTexture);
  }
}
