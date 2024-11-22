import { Container, Graphics, Text } from 'pixi.js';

export default class Button extends Container {
  constructor(text, options = {}) {
    super();

    const { width = 200, height = 60, backgroundColor = 0x0099ff, textColor = 0x000000 } = options;

    // Create text
    this.label = new Text(text, {
      fontFamily: 'Impact',
      fontSize: 28,
      fill: textColor,
      letterSpacing: 2,
    });

    // Center text
    this.label.anchor.set(0.5);
    this.label.x = width / 2;
    this.label.y = height / 2;

    // Add interactivity
    this.eventMode = 'static';
    this.cursor = 'pointer';

    // Add children
    this.addChild(this.label);
  }
}
