import pipeCircleTopLeftTexture from '../../assets/pipe_circle_topleft.png';
import Pipe from './Pipe';

export default class PipeCircleTopLeft extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleTopLeft',
      canFlowDown: true,
      canFlowRight: true,
    });
    this.loadTexture(pipeCircleTopLeftTexture);
  }
}
