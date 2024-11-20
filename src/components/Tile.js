import { Sprite, Assets } from 'pixi.js';
export default class Tile extends Sprite {
  constructor({ row, col, label }) {
    super();
    this.row = row;
    this.col = col;
    this.label = label;
    this.isShaking = false;
  }

  async loadTexture(texturePath) {
    const texture = await Assets.load(texturePath);
    texture.source.scaleMode = 'nearest';
    this.texture = texture;
  }

  highlight() {
    this.tint = 0xffff00;
  }

  resetHighlight() {
    this.tint = 0xffffff;
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
    if (this.isShaking) return;

    this.isShaking = true;
    const originalX = this.x;
    const shake = 3;
    const duration = 100;

    const shakeSequence = () => {
      this.x = originalX + shake;

      setTimeout(() => {
        this.x = originalX - shake;

        setTimeout(() => {
          this.x = originalX;
          this.isShaking = false;
        }, duration / 2);
      }, duration / 2);
    };

    shakeSequence();
  }
}
