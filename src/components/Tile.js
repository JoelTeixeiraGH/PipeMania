import { Sprite, Assets } from 'pixi.js';
export default class Tile extends Sprite {
  constructor({ row, col, label }) {
    super();
    this.row = row;
    this.col = col;
    this.label = label;
  }

  async loadTexture(texturePath) {
    const texture = await Assets.load(texturePath);
    texture.source.scaleMode = 'nearest';
    this.texture = texture;
  }

  highlight() {
    this.tint = 0xffff00; // Apply a color tint
  }

  resetHighlight() {
    this.tint = 0xffffff; // Reset to white
  }

  fillWithWater() {
    this.tint = 0x0096ff;
  }

  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.on('pointerdown', () => {
      this.emit('tile:clicked', this);
    });
  }

  showLockedFeedback() {
    const originalX = this.x;
    const shake = 3;
    const duration = 100;

    this.x += shake;
    setTimeout(() => {
      this.x = originalX - shake;
      setTimeout(() => {
        this.x = originalX;
      }, duration / 2);
    }, duration / 2);
  }
}
