import { Container, Assets } from 'pixi.js';
import Tile from './Tile'; // Import the Tile class

import pipeCircleDownLeft from '../components/pipes/PipeCircleDownLeft';
import pipeCircleDownRight from '../components/pipes/PipeCircleDownRight';
import pipeCircleUpLeft from '../components/pipes/PipeCircleTopLeft';
import pipeCircleUpRight from '../components/pipes/PipeCircleTopRight';
import pipeHorizontal from '../components/pipes/PipeHorizontal';
import pipeVertical from '../components/pipes/PipeVertical';
import pipeTJunction from '../components/pipes/PipeTJunction';

export default class NewBlocksRow {
  constructor({ app, grid }) {
    this.app = app;
    this.grid = grid;
    this.container = new Container();

    // Calculate position relative to the grid
    const gridLeftEdge = this.grid.gridContainer.x;
    const gridTopEdge = this.grid.gridContainer.y;
    const padding = 20; // Space between grid and NewBlocksRow
    const newBlocksWidth = this.grid.spriteWidth * this.grid.spriteScale; // Width of one tile

    // Position the container to the left of the grid
    this.container.x = gridLeftEdge - newBlocksWidth - padding;
    this.container.y = gridTopEdge + 2 * this.grid.spriteHeight * this.grid.spriteScale; // Adjust this multiplier to move up/down

    app.stage.addChild(this.container);

    this.tiles = []; // Stores the 5 Tile instances

    // Define available pipe types
    this.pipeTypes = [
      pipeCircleDownLeft,
      pipeCircleDownRight,
      pipeCircleUpLeft,
      pipeCircleUpRight,
      pipeHorizontal,
      pipeVertical,
      pipeTJunction,
    ];

    this.initializeTiles();
    this.highlightFirstTile();
  }

  initializeTiles() {
    for (let i = 0; i < 5; i++) {
      const PipeClass = this.pipeTypes[Math.floor(Math.random() * this.pipeTypes.length)];

      const tile = new PipeClass({
        row: 0,
        col: i,
      });

      tile.scale.set(this.grid.spriteScale);
      tile.x = 0;
      tile.y = (4 - i) * this.grid.spriteHeight * this.grid.spriteScale;

      this.container.addChild(tile);
      this.tiles.push(tile);
    }
  }

  highlightFirstTile() {
    // Remove highlight from all tiles
    this.tiles.forEach((tile) => {
      tile.alpha = 0.7; // Dim all tiles
      tile.scale.set(this.grid.spriteScale); // Reset scale
    });

    // Highlight the first tile if it exists
    if (this.tiles[0]) {
      this.tiles[0].alpha = 1; // Full opacity
      // Optional: slightly larger scale for the first tile
      this.tiles[0].scale.set(this.grid.spriteScale * 1.1);
    }
  }

  shiftTilesUp() {
    const removedTile = this.tiles.shift();
    this.container.removeChild(removedTile);

    // Move remaining tiles up
    this.tiles.forEach((tile, index) => {
      tile.y = (4 - index) * this.grid.spriteHeight * this.grid.spriteScale;
    });

    // Create new tile at bottom
    const PipeClass = this.pipeTypes[Math.floor(Math.random() * this.pipeTypes.length)];

    const newTile = new PipeClass({
      row: 0,
      col: 4,
    });

    newTile.scale.set(this.grid.spriteScale);
    newTile.x = 0;
    newTile.y = 0;

    this.container.addChild(newTile);
    this.tiles.push(newTile);

    this.highlightFirstTile();
  }
}
