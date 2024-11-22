import pipeVertical from '../../assets/sprites/pipes/pipe_vertical.png';
import Pipe from './Pipe';

export default class PipeVertical extends Pipe {
  constructor(row, col) {
    super({ row, col, label: 'pipeVertical' });

    this.canFlowUp = true;
    this.canFlowDown = true;

    this.loadTexture(pipeVertical);
  }
}
