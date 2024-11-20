import { Application } from 'pixi.js';
import Grid from './components/Grid';
import WaterFlow from './components/WaterFlow';

const app = new Application();

await app.init();
document.body.appendChild(app.canvas);

const grid = new Grid({ app });
await grid.init();

// Initialize water flow after grid is ready
const waterFlow = new WaterFlow({ grid });
