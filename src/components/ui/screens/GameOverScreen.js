import BaseScreen from './BaseScreen';

const GAME_OVER_CONFIG = {
  messageText: 'MISSION FAILED',
  messageColor: '#FF3333',
  buttonText: 'TRY AGAIN',
  hasShine: false,
};

export default class GameOverScreen extends BaseScreen {
  constructor({ app, onRestart }) {
    super({ app, onRestart, config: GAME_OVER_CONFIG });
  }
}
