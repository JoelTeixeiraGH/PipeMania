import Tile from '../Tile';

export default class Pipe extends Tile {
  constructor({ row, col, label }) {
    super({ row, col, label });
    this.row = row;
    this.col = col;
    this.canFlowUp = false;
    this.canFlowDown = false;
    this.canFlowLeft = false;
    this.canFlowRight = false;
    this.isFilled = false;
    this.makeInteractive();
  }
}
