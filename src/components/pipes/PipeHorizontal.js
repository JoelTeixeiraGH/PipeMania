import pipeHorizontalTexture from '../../assets/pipe_horizontal.png';
import Pipe from './Pipe';
export default class PipeHorizontal extends Pipe {
  constructor(row, col) {
    super({
      label: 'pipeHorizontal',
      canConnectLeft: true,
      canConnectRight: true,
    });
    this.loadTexture(pipeHorizontalTexture);
  }
}
