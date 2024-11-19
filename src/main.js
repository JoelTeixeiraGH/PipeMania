import { Application, Sprite, Assets, Graphics, Container, Loader, Texture } from 'pixi.js';
import Grid from './components/Grid';
import WaterFlow from './components/WaterFlow';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new Application();

// Wait for the Renderer to be available
await app.init();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.canvas);

const grid = new Grid({ app });
grid.init();

const waterFlow = new WaterFlow({ grid });

// Start the flow after a short delay (for example, 10 seconds)
/* setTimeout(() => {
  const startingPoint = grid.startingPoint; // Assuming `grid.startingPoint` points to the starting tile
  waterFlow.startFlow(startingPoint); // Start the flow of water
}, 10000); */
