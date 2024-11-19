import { Sprite, Assets } from 'pixi.js';
export default class Tile extends Sprite {
  constructor({ row, col, label }) {
    super();
    this.row = row;
    this.col = col;
    this.label = label;

    // Optional: Initialize other properties
    this.isBlocked = false; // ??
    this.isFilled = false; // ???
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
}
