import { Container, Graphics, Ticker } from 'pixi.js';

export default class WaterPreviewBar {
  constructor({ grid, getFlowState }) {
    this.grid = grid;
    this.getFlowState = getFlowState;
    this.container = new Container();

    // Create new Graphics objects
    this.waterPreview = new Graphics();
    this.backgroundPreview = new Graphics();

    // Add to container in correct order
    this.container.addChild(this.backgroundPreview);
    this.container.addChild(this.waterPreview);

    // Initialize properties
    this.waterWidth = 30;
    this.cornerRadius = 4;
    this.borderWidth = 3;
    this.totalTime = 15000;
    this.remainingTime = this.totalTime;
    this.startTime = Date.now();
    this.totalHeight = this.grid.gridRows * this.grid.spriteHeight * this.grid.spriteScale;
    this.waterHeight = this.totalHeight;

    // Position the container
    this.positionContainer();

    // Draw initial state
    this.drawBar();

    // Start animation
    this.ticker = Ticker.shared.add(this.update, this);
  }

  positionContainer() {
    const gridRightX = this.grid.gridContainer.x + this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale;
    this.container.x = gridRightX + 20;
    this.container.y = this.grid.gridContainer.y;
  }

  update = () => {
    if (this.getFlowState()) return;

    const currentTime = Date.now();
    this.remainingTime = Math.max(0, this.totalTime - (currentTime - this.startTime));
    this.waterHeight = (this.remainingTime / this.totalTime) * this.totalHeight;

    if (this.remainingTime <= 0) {
      this.onTimeUp?.();
      return;
    }

    this.drawBar();
  };

  drawBar() {
    // Clear previous drawings
    this.backgroundPreview.clear();
    this.waterPreview.clear();

    // Draw background
    this.backgroundPreview.roundRect(0, 0, this.waterWidth, this.totalHeight, this.cornerRadius);
    this.backgroundPreview.fill({ color: 0x333333 });

    // Draw inner background (metallic effect)
    this.backgroundPreview.roundRect(
      this.borderWidth,
      this.borderWidth,
      this.waterWidth - this.borderWidth * 2,
      this.totalHeight - this.borderWidth * 2,
      this.cornerRadius / 2
    );
    this.backgroundPreview.fill({ color: 0x666666 });

    // Metallic shine lines
    for (let i = 0; i < 3; i++) {
      this.backgroundPreview.roundRect(this.borderWidth + i * 2, 0, 2, this.totalHeight, 1);
      this.backgroundPreview.fill({ color: 0x999999, alpha: 0.3 });
    }

    // Draw water (blue)
    this.waterPreview.roundRect(
      this.borderWidth,
      this.totalHeight - this.waterHeight + this.borderWidth,
      this.waterWidth - this.borderWidth * 2,
      this.waterHeight - this.borderWidth * 2,
      this.cornerRadius / 2
    );
    this.waterPreview.fill({ color: 0x0099ff, alpha: 0.9 });

    // Add shine effect on water
    this.waterPreview.roundRect(
      this.borderWidth + 2,
      this.totalHeight - this.waterHeight + this.borderWidth,
      4,
      this.waterHeight - this.borderWidth * 2,
      1
    );
    this.waterPreview.fill({ color: 0xffffff, alpha: 0.2 });
  }

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

  destroy() {
    if (this.ticker) {
      Ticker.shared.remove(this.update);
    }
    this.container.destroy({ children: true });
  }
}
