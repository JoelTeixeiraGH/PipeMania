import { Container, Assets } from 'pixi.js';
import Tile from '../tiles/Tile';
import pipeCircleDownLeft from '../pipes/PipeCircleDownLeft';
import pipeCircleDownRight from '../pipes/PipeCircleDownRight';
import pipeCircleUpLeft from '../pipes/PipeCircleTopLeft';
import pipeCircleUpRight from '../pipes/PipeCircleTopRight';
import pipeHorizontal from '../pipes/PipeHorizontal';
import pipeVertical from '../pipes/PipeVertical';
import pipeTJunction from '../pipes/PipeTJunction';

export default class NewBlocksRow {
  constructor({ app, grid }) {
    this.app = app;
    this.grid = grid;
    this.container = new Container();

    // Calculate position relative to the grid
    const gridLeftEdge = this.grid.gridContainer.x;
    const gridTopEdge = this.grid.gridContainer.y;
    const padding = 20;
    const newBlocksWidth = this.grid.spriteWidth * this.grid.spriteScale;

    this.container.x = gridLeftEdge - newBlocksWidth - padding;
    this.container.y = gridTopEdge + 2 * this.grid.spriteHeight * this.grid.spriteScale;

    app.stage.addChild(this.container);

    this.tiles = [];

    // Cache pipe types
    this.pipeTypes = [
      pipeCircleDownLeft,
      pipeCircleDownRight,
      pipeCircleUpLeft,
      pipeCircleUpRight,
      pipeHorizontal,
      pipeVertical,
      pipeTJunction,
    ];

    // Pre-create a pool of tiles
    this.tilePool = this.createTilePool();

    this.initializeTiles();
    this.highlightFirstTile();
  }

  // Create a pool of pre-instantiated tiles
  createTilePool() {
    const pool = [];
    const poolSize = 10; // More than we need for buffer

    this.pipeTypes.forEach((PipeClass) => {
      const tiles = [];
      for (let i = 0; i < poolSize; i++) {
        const tile = new PipeClass({
          row: 0,
          col: 0,
        });
        tile.scale.set(this.grid.spriteScale);
        tile.visible = false; // Hide initially
        tiles.push(tile);
      }
      pool.push(tiles);
    });
    return pool;
  }

  // Get a tile from the pool
  getTileFromPool() {
    const typeIndex = Math.floor(Math.random() * this.pipeTypes.length);
    const tiles = this.tilePool[typeIndex];

    // Find an available tile
    const tile = tiles.find((t) => !t.visible);
    if (tile) {
      tile.visible = true;
      return tile;
    }

    // If no tile available, create a new one
    const PipeClass = this.pipeTypes[typeIndex];
    return new PipeClass({ row: 0, col: 0 });
  }

  initializeTiles() {
    for (let i = 0; i < 5; i++) {
      const tile = this.getTileFromPool();
      tile.scale.set(this.grid.spriteScale);
      tile.x = 0;
      tile.y = (4 - i) * this.grid.spriteHeight * this.grid.spriteScale;

      this.container.addChild(tile);
      this.tiles.push(tile);
    }
  }

  highlightFirstTile() {
    this.tiles.forEach((tile) => {
      tile.alpha = 0.7;
      tile.scale.set(this.grid.spriteScale);
    });

    if (this.tiles[0]) {
      this.tiles[0].alpha = 1;
      this.tiles[0].scale.set(this.grid.spriteScale * 1.1);
    }
  }

  shiftTilesUp() {
    const removedTile = this.tiles.shift();
    this.container.removeChild(removedTile);
    removedTile.visible = false; // Return to pool instead of destroying

    this.tiles.forEach((tile, index) => {
      tile.y = (4 - index) * this.grid.spriteHeight * this.grid.spriteScale;
    });

    const newTile = this.getTileFromPool();
    newTile.scale.set(this.grid.spriteScale);
    newTile.x = 0;
    newTile.y = 0;

    this.container.addChild(newTile);
    this.tiles.push(newTile);

    this.highlightFirstTile();
  }

  destroy() {
    // Hide all tiles instead of destroying them
    this.tilePool.flat().forEach((tile) => {
      tile.visible = false;
      tile.removeAllListeners();
    });

    this.tiles = [];
    this.container.removeChildren();
    this.container.destroy();
  }
}
