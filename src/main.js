import { Application } from 'pixi.js';
import { initGame } from './components/Game';
import MainMenu from './components/ui/MainMenu';

let app;
let currentScreen;

async function init() {
  // Create PixiJS application
  app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x111111,
  });

  // Initialize the application
  await app.init();
  document.body.appendChild(app.canvas);

  // Show main menu first
  showMainMenu();

  // Handle window resize
  window.addEventListener('resize', handleResize);
}

function handleResize() {
  app.renderer.resize(window.innerWidth, window.innerHeight);

  if (currentScreen) {
    if (currentScreen instanceof MainMenu) {
      showMainMenu(); // Recreate menu for proper positioning
    } else {
      startGame(); // Restart game for proper positioning
    }
  }
}

function showMainMenu() {
  if (currentScreen) {
    currentScreen.destroy();
  }

  currentScreen = new MainMenu({
    app,
    onPlayClick: startGame,
  });

  app.stage.addChild(currentScreen.container);
}

async function startGame() {
  if (currentScreen) {
    currentScreen.destroy();
  }

  currentScreen = await initGame(app);
}

// Start the application
init().catch(console.error);
