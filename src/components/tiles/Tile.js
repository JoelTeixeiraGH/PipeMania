import { Sprite, Assets, Graphics } from 'pixi.js';

/**
 * Base class for all tile sprites in the game
 * Handles basic tile properties, textures, and interactions
 */
export default class Tile extends Sprite {
  /**
   * Creates a new Tile instance
   * @param {Object} params - Tile initialization parameters
   * @param {number} params.row - Grid row position
   * @param {number} params.col - Grid column position
   * @param {string} params.label - Tile identifier label
   */
  constructor({ row, col, label }) {
    super();
    this.row = row;
    this.col = col;
    this.label = label;

    // Initialize tint colors for hover effects
    this.normalTint = 0xffffff; // no tint
    this.hoverTint = 0xaaaaaa; // Light gray hover tint
    this.tint = this.normalTint;
  }

  /**
   * Loads and sets the tile's texture
   * @param {string} texturePath - Path to the texture asset
   * @returns {Promise<void>}
   */
  async loadTexture(texturePath) {
    const texture = await Assets.load(texturePath);
    texture.source.scaleMode = 'nearest'; // Pixel-perfect scaling
    this.texture = texture;
  }

  /**
   * Makes the tile interactive and sets up event handlers
   */
  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';

    // Set up hover event handlers
    this.on('mouseover', this.onMouseOver);
    this.on('mouseout', this.onMouseOut);

    // Set up click handler
    this.on('pointerdown', () => {
      this.emit('tile:clicked', this);
    });
  }

  makeNonAllowedInteraction() {
    this.eventMode = 'static';
    this.cursor = 'not-allowed';
  }

  /**
   * Handler for mouse over event
   * Changes tile tint to hover color
   * @private
   */
  onMouseOver = () => {
    this.tint = this.hoverTint;
  };

  /**
   * Handler for mouse out event
   * Restores normal tile tint
   * @private
   */
  onMouseOut = () => {
    this.tint = this.normalTint;
  };
}
