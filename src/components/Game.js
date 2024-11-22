import Grid from './core/Grid';
import WaterFlow from './core/WaterFlow';

/**
 * Main game class that manages the game lifecycle and core components
 */
export class Game {
  /**
   * Creates a new Game instance
   * @param {PIXI.Application} app - The PIXI application instance
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * Initializes the game components
   * Creates the grid and water flow systems
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    // Create and initialize grid
    this.grid = new Grid({ app: this.app });
    await this.grid.init();

    // Initialize water flow after grid is ready
    this.waterFlow = new WaterFlow({ grid: this.grid });
  }

  /**
   * Cleans up game resources and destroys components
   */
  destroy() {
    this.waterFlow?.destroy();
    this.grid?.destroy();
  }

  /**
   * Restarts the game by destroying current instance and creating a new one
   */
  async restart() {
    // Clean up existing game
    this.destroy();

    // Clear the stage
    this.app.stage.removeChildren();

    // Reinitialize the game
    await this.init();
  }
}

/**
 * Factory function to create and initialize a new game instance
 * @param {PIXI.Application} app - The PIXI application instance
 * @returns {Promise<Game>} The initialized game instance
 */
export async function initGame(app) {
  const game = new Game(app);
  await game.init();
  return game;
}
