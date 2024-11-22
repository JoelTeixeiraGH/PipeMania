import { Container, Graphics, Text } from 'pixi.js';

export default class Button extends Container {
  constructor(
    label,
    { width = 200, height = 50, backgroundColor = 0x2a2a2a, textColor = 0xa4a4a4, textStyle = {} } = {}
  ) {
    super();

    // Create background
    this.background = new Graphics().fill({ color: backgroundColor });

    // Default text style merged with provided style
    const defaultStyle = {
      fontFamily: 'Impact',
      fontSize: 28,
      fill: textColor,
      stroke: {
        color: 'black',
        width: 2,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 3,
      letterSpacing: 2,
    };

    // Create text
    this.label = new Text({
      text: label,
      style: { ...defaultStyle, ...textStyle },
    });

    // Center text in button
    this.label.anchor.set(0.5);
    this.label.position.set(width / 2, height / 2);

    // Add to container
    this.addChild(this.background, this.label);

    // Make interactive
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }
}
