import Button from './Button';

export default class ReplayButton extends Button {
  constructor({ app, onRestart, text = 'TRY AGAIN' }) {
    super(text, {
      backgroundColor: 0x2a2a2a,
      textColor: 'white',
      textStyle: {
        fontFamily: 'Impact',
        fontSize: 28,
        stroke: {
          color: '#2A2A2A',
          width: 2,
        },
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 2,
        dropShadowAngle: Math.PI / 3,
        dropShadowDistance: 3,
        letterSpacing: 2,
      },
    });

    this.alpha = 0;
    this.on('pointerdown', () => {
      onRestart();
    });

    this.fadeIn();
  }

  fadeIn() {
    setTimeout(() => {
      const animate = () => {
        if (this.alpha < 1) {
          this.alpha += 0.05;
          requestAnimationFrame(animate);
        }
      };
      animate();
    }, 1000);
  }
}
