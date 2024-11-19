import pipeCircleTopRightTexture from '../../assets/pipe_circle_topright.png';
import Pipe from './Pipe';

export default class PipeCircleTopRight extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleTopRight',
      canFlowUp: true,
      canFlowRight: true,
    });
    this.loadTexture(pipeCircleTopRightTexture);
  }
}
