import { Application } from 'pixi.js';
import Grid from './components/Grid';

const app = new Application();

// Wait for the Renderer to be available
await app.init();

document.body.appendChild(app.canvas);

const grid = new Grid({ app });
await grid.init();
