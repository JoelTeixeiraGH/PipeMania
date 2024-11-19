import pipeVerticalTexture from '../../assets/pipe_vertical.png';
import Pipe from './Pipe';

export default class PipeVertical extends Pipe {
  constructor(row, col) {
    super({
      row: row,
      col: col,
      label: 'pipeHorizontal',
      up: true,
      down: true,
      left: false,
      right: false,
    });
    this.loadTexture(pipeVerticalTexture);
  }
}
