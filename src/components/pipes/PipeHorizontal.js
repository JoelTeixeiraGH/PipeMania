export default class PipeHorizontal extends Pipe {
  constructor(row, col) {
    super({
      label: 'pipeHorizontal',
      up: false,
      down: false,
      left: true,
      right: true,
      // texture: ...
    });
  }

  //load texture or init object?
}
