import Tile from '../Tile';

export default class Pipe extends Tile {
  constructor({ row, col, label }) {
    super({ row, col, label }); // Call the parent constructor
    this.canConnectUp = false;
    this.canConnectDown = false;
    this.canConnectLeft = false;
    this.canConnectRight = false;
    this.isFilled = false;
  }
}
