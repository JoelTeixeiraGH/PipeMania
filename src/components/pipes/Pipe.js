import Tile from '../Tile';

export default class Pipe extends Tile {
  constructor({ row, col, label }) {
    super({ row, col, label }); // Call the parent constructor
    this.canFlowUp = false;
    this.canFlowDown = false;
    this.canFlowLeft = false;
    this.canFlowRight = false;
    this.isFilled = false;
  }
}
