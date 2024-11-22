import Grid from './core/Grid';
import WaterFlow from './core/WaterFlow';

export class Game {
  constructor(app) {
    this.app = app;
  }

  async init() {
    // Create and initialize grid
    this.grid = new Grid({ app: this.app });
    await this.grid.init();

    // Initialize water flow after grid is ready
    this.waterFlow = new WaterFlow({ grid: this.grid });
  }

  destroy() {
    this.waterFlow?.destroy();
    this.grid?.destroy();
  }

  async restart() {
    // Clean up existing game
    this.destroy();

    // Clear the stage
    this.app.stage.removeChildren();

    // Reinitialize the game
    await this.init();
  }
}

export async function initGame(app) {
  const game = new Game(app);
  await game.init();
  return game;
}
