import BaseScreen from './BaseScreen';

const WIN_CONFIG = {
  messageText: 'MISSION COMPLETE',
  messageColor: 'green',
  buttonText: 'PLAY AGAIN',
  hasShine: true,
};

export default class WinScreen extends BaseScreen {
  constructor({ app, onRestart }) {
    super({ app, onRestart, config: WIN_CONFIG });
  }
}
