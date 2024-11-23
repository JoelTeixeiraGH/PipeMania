import { Container, Graphics, Ticker } from 'pixi.js';

/**
 * Class representing a visual water level indicator
 * Shows remaining time as a decreasing water level
 */
export default class WaterPreviewBar {
  /**
   * Creates a new water preview bar
   * @param {Object} params - Initialization parameters
   * @param {Grid} params.grid - Reference to the game grid
   * @param {Function} params.getFlowState - Function to check water flow state
   */
  constructor({ grid, getFlowState }) {
    this.grid = grid;
    this.getFlowState = getFlowState;
    this.container = new Container();

    // Create graphics objects for layering
    this.waterPreview = new Graphics();
    this.backgroundPreview = new Graphics();

    // Add to container in correct order (background first)
    this.container.addChild(this.backgroundPreview);
    this.container.addChild(this.waterPreview);

    // Initialize visual properties
    this.waterWidth = 30;
    this.cornerRadius = 4;
    this.borderWidth = 3;

    // Initialize timing properties
    this.totalTime = 15000; // 15 seconds
    this.remainingTime = this.totalTime;
    this.startTime = Date.now();

    // Calculate dimensions based on grid
    this.totalHeight = this.grid.gridRows * this.grid.spriteHeight * this.grid.spriteScale;
    this.waterHeight = this.totalHeight;

    // Setup and draw initial state
    this.positionContainer();
    this.drawBar();

    // Start update loop
    this.ticker = Ticker.shared.add(this.update, this);
  }

  /**
   * Positions the bar container relative to the grid
   * @private
   */
  positionContainer() {
    const gridRightX = this.grid.gridContainer.x + this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale;
    this.container.x = gridRightX + 20; // 20px padding from grid
    this.container.y = this.grid.gridContainer.y;
  }

  /**
   * Updates the water level based on remaining time
   * @private
   */
  update = () => {
    if (this.getFlowState()) return; // Don't update if water is flowing

    // Calculate remaining time and water height
    const currentTime = Date.now();
    this.remainingTime = Math.max(0, this.totalTime - (currentTime - this.startTime));
    this.waterHeight = (this.remainingTime / this.totalTime) * this.totalHeight;

    // Check for time up
    if (this.remainingTime <= 0) {
      this.onTimeUp?.();
      return;
    }

    this.drawBar();
  };

  /**
   * Draws the water preview bar with visual effects
   * @private
   */
  drawBar() {
    // Clear previous drawings
    this.backgroundPreview.clear();
    this.waterPreview.clear();

    // Draw outer background
    this.backgroundPreview.roundRect(0, 0, this.waterWidth, this.totalHeight, this.cornerRadius);
    this.backgroundPreview.fill({ color: 0x333333 });

    // Draw inner background with metallic effect
    this.backgroundPreview.roundRect(
      this.borderWidth,
      this.borderWidth,
      this.waterWidth - this.borderWidth * 2,
      this.totalHeight - this.borderWidth * 2,
      this.cornerRadius / 2
    );
    this.backgroundPreview.fill({ color: 0x666666 });

    // Add metallic shine lines
    for (let i = 0; i < 3; i++) {
      this.backgroundPreview.roundRect(this.borderWidth + i * 2, 0, 2, this.totalHeight, 1);
      this.backgroundPreview.fill({ color: 0x999999, alpha: 0.3 });
    }

    // Draw water level
    this.waterPreview.roundRect(
      this.borderWidth,
      this.totalHeight - this.waterHeight + this.borderWidth,
      this.waterWidth - this.borderWidth * 2,
      this.waterHeight - this.borderWidth * 2,
      this.cornerRadius / 2
    );
    this.waterPreview.fill({ color: 0x0099ff, alpha: 0.9 });

    // Add water shine effect
    this.waterPreview.roundRect(
      this.borderWidth + 2,
      this.totalHeight - this.waterHeight + this.borderWidth,
      4,
      this.waterHeight - this.borderWidth * 2,
      1
    );
    this.waterPreview.fill({ color: 0xffffff, alpha: 0.2 });
  }

  /**
   * Fades out the water preview bar
   * @returns {Promise} Resolves when fade is complete
   */
  fadeOut() {
    return new Promise((resolve) => {
      const fade = () => {
        this.container.alpha -= 0.05;
        if (this.container.alpha <= 0) {
          resolve();
        } else {
          requestAnimationFrame(fade);
        }
      };
      fade();
    });
  }

  /**
   * Cleans up resources and stops update loop
   */
  destroy() {
    if (this.ticker) {
      Ticker.shared.remove(this.update);
    }
    this.container.destroy({ children: true });
  }
}
