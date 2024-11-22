import { Container, Graphics, Text } from 'pixi.js';

export default class Button extends Container {
  constructor(text, options = {}) {
    super();

    const {
      width = 200,
      height = 60,
      backgroundColor = 0x0099ff,
      textStyle = {
        fontFamily: 'Impact',
        fontSize: 28,
        fill: '#FFFFFF',
        letterSpacing: 2,
      },
    } = options;

    // Create button background
    this.background = new Graphics().fill({ color: backgroundColor }).roundRect(0, 0, width, height, 10);

    // Create text
    this.label = new Text({
      text,
      style: textStyle,
    });

    // Center text
    this.label.anchor.set(0.5);
    this.label.x = width / 2;
    this.label.y = height / 2;

    // Add interactivity
    this.eventMode = 'static';
    this.cursor = 'pointer';

    // Add hover effects
    this.on('pointerover', this.onPointerOver);
    this.on('pointerout', this.onPointerOut);

    // Add children
    this.addChild(this.background);
    this.addChild(this.label);

    // Store original scale
    this.normalScale = 1;
  }

  onPointerOver = () => {
    this.scale.set(this.normalScale * 1.05);
  };

  onPointerOut = () => {
    this.scale.set(this.normalScale);
  };
}
