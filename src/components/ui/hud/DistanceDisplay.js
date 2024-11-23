import { Container, Text } from 'pixi.js';

/**
 * Class representing the distance display in the HUD
 * Shows current progress towards target distance
 */
export default class DistanceDisplay {
  /**
   * Creates a new distance display
   * @param {Object} params - Initialization parameters
   * @param {Grid} params.grid - Reference to the game grid
   */
  constructor({ grid }) {
    this.grid = grid;
    this.container = new Container();
    this.createDisplay();
  }

  /**
   * Creates the distance display text with styling
   * @private
   */
  createDisplay() {
    // Text style configuration
    const textStyle = {
      fontFamily: 'Impact',
      fontSize: 32,
      fill: 'white',
      stroke: {
        color: '#2A2A2A',
        width: 4,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 3,
      letterSpacing: 2,
      lineJoin: 'bevel',
    };

    // Create text instance
    this.distanceText = new Text({
      text: '',
      style: textStyle,
    });

    // Position text at the top center of the grid
    this.distanceText.anchor.set(0.5, 0);
    this.distanceText.position.set(
      this.grid.gridContainer.x + (this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale) / 2,
      20 // Pixels from top
    );

    this.container.addChild(this.distanceText);
  }

  /**
   * Updates the display with new distance values
   * @param {number} current - Current distance achieved
   * @param {number} target - Target distance to reach
   */
  update(current, target) {
    this.distanceText.text = `DISTANCE: ${current}/${target}`;
  }

  /**
   * Cleans up resources
   */
  destroy() {
    this.container.destroy({ children: true });
  }
}
