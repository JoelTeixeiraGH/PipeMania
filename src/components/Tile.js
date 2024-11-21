import { Sprite, Assets, Graphics } from 'pixi.js';

export default class Tile extends Sprite {
  constructor({ row, col, label }) {
    super();
    this.row = row;
    this.col = col;
    this.label = label;
    this.isShaking = false;

    // Hover tint values
    this.normalTint = 0xffffff;
    this.hoverTint = 0xaaaaaa;
    this.tint = this.normalTint;
  }

  async loadTexture(texturePath) {
    const texture = await Assets.load(texturePath);
    texture.source.scaleMode = 'nearest';
    this.texture = texture;
  }

  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    // Add hover effects
    this.on('mouseover', this.onMouseOver);
    this.on('mouseout', this.onMouseOut);

    // Existing click handler
    this.on('pointerdown', () => {
      this.emit('tile:clicked', this);
    });
  }

  onMouseOver = () => {
    if (!this.isShaking) {
      this.tint = this.hoverTint;
    }
  };

  onMouseOut = () => {
    this.tint = this.normalTint;
  };

  showLockedFeedback() {
    if (this.isShaking) return;

    this.isShaking = true;
    const originalX = this.x;
    const shake = 3;
    const duration = 100;

    // Reset tint during shake
    this.tint = this.normalTint;

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
