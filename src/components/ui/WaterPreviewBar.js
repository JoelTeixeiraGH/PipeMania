import { Container, Graphics, Ticker } from 'pixi.js';

export default class WaterPreviewBar {
  constructor({ grid, getFlowState }) {
    this.grid = grid;
    this.getFlowState = getFlowState;
    this.container = new Container();
    this.waterPreview = new Graphics();
    this.backgroundPreview = new Graphics();

    // Setup container
    this.container.addChild(this.backgroundPreview);
    this.container.addChild(this.waterPreview);
    this.positionContainer();

    // Initialize properties
    this.waterWidth = 30;
    this.cornerRadius = 4;
    this.borderWidth = 3;
    this.totalTime = 15000;
    this.remainingTime = this.totalTime;
    this.startTime = Date.now();
    this.totalHeight = this.grid.gridRows * this.grid.spriteHeight * this.grid.spriteScale;
    this.waterHeight = this.totalHeight;
    this.waveOffset = 0;
    this.waveAmplitude = 1.5;

    // Start animation
    this.ticker = Ticker.shared.add(this.update, this);
  }

  positionContainer() {
    const gridRightX = this.grid.gridContainer.x + this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale;
    this.container.x = gridRightX + 20;
    this.container.y = this.grid.gridContainer.y;
  }

  update = (deltaMS) => {
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
    this.backgroundPreview.clear();
    this.waterPreview.clear();

    // Draw metallic background
    this.backgroundPreview
      .fill({ color: 0x333333 })
      .roundRect(0, 0, this.waterWidth, this.totalHeight, this.cornerRadius);

    this.backgroundPreview
      .fill({ color: 0x666666 })
      .roundRect(
        this.borderWidth,
        this.borderWidth,
        this.waterWidth - this.borderWidth * 2,
        this.totalHeight - this.borderWidth * 2,
        this.cornerRadius / 2
      );

    // Metallic shine lines
    for (let i = 0; i < 3; i++) {
      this.backgroundPreview
        .fill({ color: 0x999999, alpha: 0.3 })
        .roundRect(this.borderWidth + i * 2, 0, 2, this.totalHeight, 1);
    }

    // Wave effect
    this.waveOffset += 0.1;
    const waveX = Math.sin(this.waveOffset) * this.waveAmplitude;

    // Water colors
    const progress = this.remainingTime / this.totalTime;
    const waterColors = [
      { pos: 0, color: this.interpolateColor(progress, 0xcccccc, 0x666666) },
      { pos: 0.3, color: this.interpolateColor(progress, 0x99ccff, 0x3399cc) },
      { pos: 0.7, color: this.interpolateColor(progress, 0x6699cc, 0x336699) },
      { pos: 1, color: this.interpolateColor(progress, 0x336699, 0x333366) },
    ];

    // Draw water
    this.waterPreview
      .fill({
        color: waterColors[1].color,
        alpha: 0.9,
        gradient: waterColors,
      })
      .roundRect(
        this.borderWidth + waveX,
        this.totalHeight - this.waterHeight + this.borderWidth,
        this.waterWidth - this.borderWidth * 2,
        this.waterHeight - this.borderWidth * 2,
        this.cornerRadius / 2
      );

    // Metallic shine on water
    this.waterPreview
      .fill({ color: 0xffffff, alpha: 0.2 })
      .roundRect(
        this.borderWidth + waveX + 2,
        this.totalHeight - this.waterHeight + this.borderWidth,
        4,
        this.waterHeight - this.borderWidth * 2,
        1
      );
  }

  interpolateColor(progress, startColor, endColor) {
    const r1 = (startColor >> 16) & 0xff;
    const g1 = (startColor >> 8) & 0xff;
    const b1 = startColor & 0xff;

    const r2 = (endColor >> 16) & 0xff;
    const g2 = (endColor >> 8) & 0xff;
    const b2 = endColor & 0xff;

    const r = Math.floor(r1 + (r2 - r1) * progress);
    const g = Math.floor(g1 + (g2 - g1) * progress);
    const b = Math.floor(b1 + (b2 - b1) * progress);

    return (r << 16) | (g << 8) | b;
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
      Ticker.shared.remove(this.ticker);
    }
    this.container.destroy({ children: true });
  }
}
