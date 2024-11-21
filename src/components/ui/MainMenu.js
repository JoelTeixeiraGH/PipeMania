import { Container, Text, Graphics } from 'pixi.js';

export default class MainMenu {
  constructor({ app, onPlayClick }) {
    this.app = app;
    this.onPlayClick = onPlayClick;
    this.container = new Container();

    this.createBackground();
    this.createTitle();
    this.createPlayButton();
  }

  createBackground() {
    const background = new Graphics()
      .fill({ color: 0x111111 })
      .rect(0, 0, this.app.screen.width, this.app.screen.height);
    this.container.addChild(background);
  }

  createTitle() {
    const titleStyle = {
      fontFamily: 'Impact',
      fontSize: 120,
      fill: ['#4444ff', '#0099ff'], // Gradient fill
      fillGradientType: 1,
      fillGradientStops: [0, 1],
      stroke: {
        color: '#ffffff',
        width: 6,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 6,
      letterSpacing: 4,
      lineJoin: 'round',
    };

    this.title = new Text({
      text: 'PIPE MANIA',
      style: titleStyle,
    });

    this.title.anchor.set(0.5);
    this.title.position.set(this.app.screen.width / 2, this.app.screen.height / 3);

    // Add shine animation
    this.createShineEffect();

    this.container.addChild(this.title);
  }

  createPlayButton() {
    const buttonWidth = 240;
    const buttonHeight = 80;
    const buttonRadius = 12;

    // Create button container
    this.playButton = new Container();
    this.playButton.position.set(this.app.screen.width / 2, this.app.screen.height * 0.6);

    // Create button background
    const buttonBackground = new Graphics()
      .fill({ color: 0x0099ff })
      .roundRect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight, buttonRadius);

    // Create button text
    const buttonStyle = {
      fontFamily: 'Impact',
      fontSize: 48,
      fill: '#ffffff',
      stroke: {
        color: '#000000',
        width: 3,
      },
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 2,
      dropShadowAngle: Math.PI / 3,
      dropShadowDistance: 2,
    };

    const buttonText = new Text({
      text: 'PLAY',
      style: buttonStyle,
    });
    buttonText.anchor.set(0.5);

    // Add hover effects
    this.playButton.eventMode = 'static';
    this.playButton.cursor = 'pointer';

    this.playButton
      .on('pointerover', () => {
        buttonBackground.tint = 0x00bbff;
        this.playButton.scale.set(1.05);
      })
      .on('pointerout', () => {
        buttonBackground.tint = 0xffffff;
        this.playButton.scale.set(1);
      })
      .on('pointerdown', () => {
        buttonBackground.tint = 0x0077cc;
        this.playButton.scale.set(0.95);
      })
      .on('pointerup', () => {
        this.onPlayClick();
      });

    this.playButton.addChild(buttonBackground);
    this.playButton.addChild(buttonText);
    this.container.addChild(this.playButton);
  }

  createShineEffect() {
    this.shine = new Graphics().fill({ color: 0xffffff, alpha: 0.3 }).circle(0, 0, 150);

    this.shine.position.copyFrom(this.title.position);
    this.shine.scale.set(0);
    this.container.addChildAt(this.shine, 0);

    this.animateShine();
  }

  animateShine() {
    let shineScale = 0;
    const animate = () => {
      if (this.destroyed) return;

      shineScale += 0.02;
      if (shineScale >= 2) {
        shineScale = 0;
      }

      this.shine.scale.set(shineScale);
      this.shine.alpha = Math.max(0, 0.3 - shineScale / 4);

      requestAnimationFrame(animate);
    };
    animate();
  }

  destroy() {
    this.destroyed = true;
    this.container.destroy({ children: true });
  }
}
