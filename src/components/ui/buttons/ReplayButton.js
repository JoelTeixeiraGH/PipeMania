import Button from './Button';

/**
 * Configuration for the replay button
 */
const REPLAY_CONFIG = {
  text: 'TRY AGAIN',
  style: {
    background: 0x2a2a2a,
    text: 'white',
    font: {
      family: 'Impact',
      size: 28,
      letterSpacing: 2,
      stroke: {
        color: '#2A2A2A',
        width: 2,
      },
      dropShadow: {
        enabled: true,
        color: '#000000',
        blur: 2,
        angle: Math.PI / 3,
        distance: 3,
      },
    },
  },
  animation: {
    delay: 1000,
    fadeStep: 0.05,
    targetAlpha: 1,
  },
};

/**
 * Button that appears after game over to restart the game
 */
export default class ReplayButton extends Button {
  /**
   * Creates a new replay button
   * @param {Object} params - Button parameters
   * @param {PIXI.Application} params.app - PIXI application instance
   * @param {Function} params.onRestart - Callback function for restart
   * @param {string} [params.text] - Custom button text
   */
  constructor({ app, onRestart, text = REPLAY_CONFIG.text }) {
    super(text, {
      backgroundColor: REPLAY_CONFIG.style.background,
      textColor: REPLAY_CONFIG.style.text,
      textStyle: {
        fontFamily: REPLAY_CONFIG.style.font.family,
        fontSize: REPLAY_CONFIG.style.font.size,
        stroke: REPLAY_CONFIG.style.font.stroke,
        dropShadow: REPLAY_CONFIG.style.font.dropShadow.enabled,
        dropShadowColor: REPLAY_CONFIG.style.font.dropShadow.color,
        dropShadowBlur: REPLAY_CONFIG.style.font.dropShadow.blur,
        dropShadowAngle: REPLAY_CONFIG.style.font.dropShadow.angle,
        dropShadowDistance: REPLAY_CONFIG.style.font.dropShadow.distance,
        letterSpacing: REPLAY_CONFIG.style.font.letterSpacing,
      },
    });

    this.initializeButton(onRestart);
  }

  /**
   * Initializes button properties and event handlers
   * @private
   * @param {Function} onRestart - Restart callback
   */
  initializeButton(onRestart) {
    this.alpha = 0;
    this.setupEventListeners(onRestart);
    this.fadeIn();
  }

  /**
   * Sets up button event listeners
   * @param {Function} onRestart - Restart callback
   */
  setupEventListeners(onRestart) {
    this.on('pointerdown', onRestart);
  }

  /**
   * Starts the fade-in animation
   */
  fadeIn() {
    setTimeout(() => this.startFadeAnimation(), REPLAY_CONFIG.animation.delay);
  }

  /**
   * Handles the fade animation logic
   */
  startFadeAnimation() {
    const animate = () => {
      if (this.alpha < REPLAY_CONFIG.animation.targetAlpha) {
        this.alpha += REPLAY_CONFIG.animation.fadeStep;
        requestAnimationFrame(animate);
      }
    };
    animate();
  }
}
