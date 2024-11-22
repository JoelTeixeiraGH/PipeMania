import { Application } from 'pixi.js';
import { Game } from './components/Game';

let app;

async function init() {
  // Create PixiJS application
  app = new Application();

  // Initialize the application
  await app.init();
  document.body.appendChild(app.canvas);

  // Create and store game instance
  app.game = new Game(app);
  await app.game.init();
}

// Start the application
init().catch(console.error);
