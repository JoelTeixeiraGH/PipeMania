import Tile from '../Tile';

export default class Pipe extends Tile {
  constructor({ row, col, label }) {
    super({ row, col, label });
    this.canFlowUp = false;
    this.canFlowDown = false;
    this.canFlowLeft = false;
    this.canFlowRight = false;
    this.isFilled = false;
    this.makeInteractive();
  }

  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', () => {
      if (this.isFilled) {
        this.showLockedFeedback();
        return;
      }
      this.emit('tile:clicked', this);
    });
  }

  isLocked() {
    return this.isFilled;
  }

  setFilled() {
    this.isFilled = true;
    this.cursor = 'not-allowed';
  }
}
