import { Container, Graphics, Text } from 'pixi.js';
import ReplayButton from '../buttons/ReplayButton';

/**
 * Base class for game result screens
 */
export default class BaseScreen {
  /**
   * Creates a new screen
   * @param {Object} params - Screen parameters
   * @param {PIXI.Application} params.app - PIXI application instance
   * @param {Function} params.onRestart - Callback function for restart
   * @param {Object} params.config - Screen configuration
   */
  constructor({ app, onRestart, config }) {
    this.app = app;
    this.onRestart = onRestart;
    this.config = config;
    this.container = new Container();
    this.createScreen();
  }

  /**
   * Creates all screen elements
   * @private
   */
  createScreen() {
    this.createOverlay();
    this.createMessage();
    if (this.config.hasShine) {
      this.createShineEffect();
    }
    this.createReplayButton();
  }

  /**
   * Creates semi-transparent overlay
   * @private
   */
  createOverlay() {
    const overlay = new Graphics()
      .fill({ color: 0x111111, alpha: 0.85 })
      .rect(0, 0, this.app.screen.width, this.app.screen.height);
    this.container.addChild(overlay);
  }

  /**
   * Creates and animates the message
   * @private
   */
  createMessage() {
    const messageStyle = {
      fontFamily: 'Impact',
      fontSize: 64,
      fontWeight: 'bold',
      fill: this.config.messageColor,
      stroke: {
        color: 'white',
        width: 6,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 6,
      letterSpacing: 4,
      lineJoin: 'bevel',
    };

    this.message = new Text({
      text: this.config.messageText,
      style: messageStyle,
    });

    this.message.anchor.set(0.5);
    this.message.position.set(this.app.screen.width / 2, this.app.screen.height / 2 - 20);
    this.message.scale.set(0);
    this.container.addChild(this.message);

    this.animateMessage();
  }

  /**
   * Creates shine effect behind the message
   * @private
   */
  createShineEffect() {
    this.shine = new Graphics().fill({ color: 0xffffff, alpha: 0.3 }).circle(0, 0, 120);
    this.shine.position.set(this.message.x, this.message.y);
    this.shine.scale.set(0);
    this.container.addChildAt(this.shine, 0);
    setTimeout(() => this.animateShine(), 200);
  }

  /**
   * Creates and positions the replay button
   * @private
   */
  createReplayButton() {
    const button = new ReplayButton({
      app: this.app,
      onRestart: () => {
        this.onRestart();
        this.destroy();
      },
      text: this.config.buttonText,
    });

    button.position.set(this.app.screen.width / 2 - button.width / 2, this.message.y + this.message.height + 40);

    this.container.addChild(button);
  }

  /**
   * Animates the message scale
   * @private
   */
  animateMessage() {
    let scale = 0;
    const animate = () => {
      if (scale < 1) {
        scale += 0.05;
        this.message.scale.set(scale);
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  /**
   * Animates the shine effect
   * @private
   */
  animateShine() {
    let shineScale = 0;
    const animate = () => {
      if (shineScale < 2) {
        shineScale += 0.04;
        this.shine.scale.set(shineScale);
        this.shine.alpha = Math.max(0, 0.3 - shineScale / 4);
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  /**
   * Cleans up resources
   */
  destroy() {
    this.container.destroy({ children: true });
  }
}
