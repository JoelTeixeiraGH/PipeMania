import { Container, Text } from 'pixi.js';

export default class DistanceDisplay {
  constructor({ grid }) {
    this.grid = grid;
    this.container = new Container();
    this.createDisplay();
  }

  createDisplay() {
    const textStyle = {
      fontFamily: 'Impact',
      fontSize: 32,
      fill: '#FFD700',
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

    this.distanceText = new Text({
      text: '',
      style: textStyle,
    });

    // Center based on grid position
    this.distanceText.anchor.set(0.5, 0);
    this.distanceText.position.set(
      this.grid.gridContainer.x + (this.grid.gridCols * this.grid.spriteWidth * this.grid.spriteScale) / 2,
      20
    );

    this.container.addChild(this.distanceText);
  }

  update(current, target) {
    this.distanceText.text = `DISTANCE: ${current}/${target}`;
  }

  destroy() {
    this.container.destroy({ children: true });
  }
}
