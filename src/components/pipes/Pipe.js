import Tile from '../Tile';

export default class Pipe extends Tile {
  constructor({ row, col, label }) {
    super({ row, col, label });
    this.canFlowUp = false;
    this.canFlowDown = false;
    this.canFlowLeft = false;
    this.canFlowRight = false;
    this.isFilled = false;
    this.isFlowing = false;
    this.makeInteractive();
  }

  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', () => {
      if (this.isFilled || this.isFlowing) {
        this.showLockedFeedback();
        return;
      }
      this.emit('tile:clicked', this);
    });
  }

  isLocked() {
    return this.isFilled || this.isFlowing;
  }

  setFilled() {
    this.isFilled = true;
    this.isFlowing = false;
    this.cursor = 'not-allowed';
  }

  startFlowing() {
    this.isFlowing = true;
    this.cursor = 'not-allowed';
  }

  stopFlowing() {
    this.isFlowing = false;
    if (!this.isFilled) {
      this.cursor = 'pointer';
    }
  }
}
