import { Application } from 'pixi.js';
import { initGame } from './components/Game';

let app;
let currentGame;

async function init() {
  // Create PixiJS application
  app = new Application();

  // Initialize the application
  await app.init();
  document.body.appendChild(app.canvas);

  // Start the game
  startGame();
}

async function startGame() {
  // Cleanup previous game if exists
  if (currentGame) {
    currentGame.destroy();
  }

  // Initialize new game
  currentGame = await initGame(app);
}

// Start the application
init().catch(console.error);
