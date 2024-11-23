import { Container, Graphics, Text } from 'pixi.js';

/**
 * Default button configuration
 */
const DEFAULT_CONFIG = {
  dimensions: {
    width: 200,
    height: 50,
  },
  colors: {
    background: 0x2a2a2a,
    text: 0xa4a4a4,
  },
  text: {
    fontFamily: 'Impact',
    fontSize: 28,
    stroke: {
      color: 'black',
      width: 2,
    },
    dropShadow: {
      color: '#000000',
      blur: 2,
      angle: Math.PI / 3,
      distance: 3,
    },
    letterSpacing: 2,
  },
};

/**
 * Interactive button component with customizable appearance
 */
export default class Button extends Container {
  /**
   * Creates a new button instance
   * @param {string} label - Button text
   * @param {Object} options - Button configuration
   * @param {number} options.width - Button width
   * @param {number} options.height - Button height
   * @param {number} options.backgroundColor - Button background color
   * @param {number} options.textColor - Button text color
   * @param {Object} options.textStyle - Custom text style properties
   */
  constructor(
    label,
    {
      width = DEFAULT_CONFIG.dimensions.width,
      height = DEFAULT_CONFIG.dimensions.height,
      backgroundColor = DEFAULT_CONFIG.colors.background,
      textColor = DEFAULT_CONFIG.colors.text,
      textStyle = {},
    } = {}
  ) {
    super();

    this.dimensions = { width, height };
    this.colors = { background: backgroundColor, text: textColor };

    this.createBackground();
    this.createLabel(label, textStyle);
    this.makeInteractive();
  }

  /**
   * Creates the button background
   * @private
   */
  createBackground() {
    this.background = new Graphics().fill({ color: this.colors.background });
    this.addChild(this.background);
  }

  /**
   * Creates the button label
   * @private
   * @param {string} text - Button text
   * @param {Object} customStyle - Custom text style properties
   */
  createLabel(text, customStyle) {
    const style = this.createTextStyle(customStyle);

    this.label = new Text({
      text,
      style,
    });

    this.centerLabel();
    this.addChild(this.label);
  }

  /**
   * Creates the text style by merging defaults with custom properties
   * @private
   * @param {Object} customStyle - Custom text style properties
   * @returns {Object} Complete text style
   */
  createTextStyle(customStyle) {
    const defaultStyle = {
      fontFamily: DEFAULT_CONFIG.text.fontFamily,
      fontSize: DEFAULT_CONFIG.text.fontSize,
      fill: this.colors.text,
      stroke: DEFAULT_CONFIG.text.stroke,
      dropShadow: true,
      dropShadowColor: DEFAULT_CONFIG.text.dropShadow.color,
      dropShadowBlur: DEFAULT_CONFIG.text.dropShadow.blur,
      dropShadowAngle: DEFAULT_CONFIG.text.dropShadow.angle,
      dropShadowDistance: DEFAULT_CONFIG.text.dropShadow.distance,
      letterSpacing: DEFAULT_CONFIG.text.letterSpacing,
    };

    return { ...defaultStyle, ...customStyle };
  }

  /**
   * Centers the label within the button
   * @private
   */
  centerLabel() {
    this.label.anchor.set(0.5);
    this.label.position.set(this.dimensions.width / 2, this.dimensions.height / 2);
  }

  /**
   * Makes the button interactive
   * @private
   */
  makeInteractive() {
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }
}
