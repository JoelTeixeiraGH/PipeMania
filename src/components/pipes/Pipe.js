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

  makeInteractive() {
    this.interactive = true;
    this.cursor = 'pointer';

    this.on('pointerdown', () => {
      // Don't allow interaction if pipe is filled
      if (this.isFilled) {
        // Optional: Add visual or sound feedback that pipe can't be changed
        this.showLockedFeedback();
        return;
      }

      this.emit('pipeClicked', {
        row: this.row,
        col: this.col,
      });
    });
  }

  showLockedFeedback() {
    // Optional: Add a quick shake or flash animation to show pipe is locked
    const originalX = this.x;
    const shake = 3; // Shake amount in pixels
    const duration = 100; // Duration in milliseconds

    // Quick shake animation
    this.x += shake;
    setTimeout(() => {
      this.x = originalX - shake;
      setTimeout(() => {
        this.x = originalX;
      }, duration / 2);
    }, duration / 2);
  }

  // When pipe gets filled
  setFilled() {
    this.isFilled = true;
    this.cursor = 'not-allowed'; // Change cursor to indicate pipe can't be changed
  }
}
