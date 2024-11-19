import { Sprite } from 'pixi.js';

export default class Tile extends Sprite {
  constructor({ texture, row, col, label }) {
    super(texture); // Call Sprite constructor with the texture
    this.row = row;
    this.col = col;
    this.label = label;

    // Optional: Initialize other properties
    this.isBlocked = false; // ??
    this.isFilled = false; // ???
    this.interactive = true; // Make tiles interactive by default
    this.buttonMode = true; // Show pointer cursor by default
  }

  // Example method to block a tile
  blockTile(blockedTexture) {
    this.texture = blockedTexture;
    this.isBlocked = true;
    this.interactive = false;
    this.buttonMode = false;
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
