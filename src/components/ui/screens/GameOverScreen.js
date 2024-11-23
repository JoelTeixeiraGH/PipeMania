import { Container, Graphics, Text } from 'pixi.js';
import ReplayButton from '../buttons/ReplayButton';

/**
 * Screen displayed when the game is over
 */
export default class GameOverScreen {
  /**
   * Creates a new game over screen
   * @param {Object} params - Screen parameters
   * @param {PIXI.Application} params.app - PIXI application instance
   * @param {Function} params.onRestart - Callback function for restart
   */
  constructor({ app, onRestart }) {
    this.app = app;
    this.onRestart = onRestart;
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
   * Creates and animates the failure message
   * @private
   */
  createMessage() {
    const messageStyle = {
      fontFamily: 'Impact',
      fontSize: 64,
      fontWeight: 'bold',
      fill: '#FF3333',
      stroke: {
        color: '#2A2A2A',
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
      text: 'MISSION FAILED',
      style: messageStyle,
    });

    this.message.anchor.set(0.5);
    this.message.position.set(this.app.screen.width / 2, this.app.screen.height / 2 - 20);
    this.message.scale.set(0);
    this.container.addChild(this.message);

    this.animateMessage();
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
    });

    button.position.set(this.app.screen.width / 2 - button.width / 2, this.message.y + this.message.height + 40);

    this.container.addChild(button);
  }

  /**
   * Cleans up resources
   */
  destroy() {
    this.container.destroy({ children: true });
  }
}
