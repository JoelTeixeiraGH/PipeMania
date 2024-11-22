import pipeCircleTopLeftTexture from '../../assets/sprites/pipes/pipe_circle_topleft.png';
import Pipe from './Pipe';

export default class PipeCircleTopLeft extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleTopLeft',
    });

    this.canFlowDown = true;
    this.canFlowRight = true;

    this.loadTexture(pipeCircleTopLeftTexture);
  }
}
