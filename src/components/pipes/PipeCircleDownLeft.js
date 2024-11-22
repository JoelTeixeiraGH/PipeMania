import pipeCircleDownLeftTexture from '../../assets/sprites/pipes/pipe_circle_downleft.png';
import Pipe from './Pipe';

export default class PipeCircleDownLeft extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeCircleDownLeft',
    });

    this.canFlowUp = true;
    this.canFlowRight = true;

    this.loadTexture(pipeCircleDownLeftTexture);
  }
}
