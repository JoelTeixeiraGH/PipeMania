import { Container, Assets } from 'pixi.js';
import Tile from '../tiles/Tile';
import pipeCircleDownLeft from '../pipes/PipeCircleDownLeft';
import pipeCircleDownRight from '../pipes/PipeCircleDownRight';
import pipeCircleUpLeft from '../pipes/PipeCircleTopLeft';
import pipeCircleUpRight from '../pipes/PipeCircleTopRight';
import pipeHorizontal from '../pipes/PipeHorizontal';
import pipeVertical from '../pipes/PipeVertical';
import pipeTJunction from '../pipes/PipeTJunction';

/**
 * Class representing a row of new blocks that can be used to replace tiles in the grid
 */
export default class NewBlocksRow {
  /**
   * Creates a new NewBlocksRow instance
   * @param {Object} params - The initialization parameters
   * @param {PIXI.Application} params.app - The PIXI application instance
   * @param {Grid} params.grid - The grid instance this row belongs to
   */
  constructor({ app, grid }) {
    this.app = app;
    this.grid = grid;
    this.container = new Container();

    // Calculate position relative to the grid
    const gridLeftEdge = this.grid.gridContainer.x;
    const gridTopEdge = this.grid.gridContainer.y;
    const padding = 20;
    const newBlocksWidth = this.grid.spriteWidth * this.grid.spriteScale;

    // Position the container
    this.container.x = gridLeftEdge - newBlocksWidth - padding;
    this.container.y = gridTopEdge + 2 * this.grid.spriteHeight * this.grid.spriteScale;

    app.stage.addChild(this.container);

    this.tiles = [];

    // Available pipe types for new blocks
    this.pipeTypes = [
      pipeCircleDownLeft,
      pipeCircleDownRight,
      pipeCircleUpLeft,
      pipeCircleUpRight,
      pipeHorizontal,
      pipeVertical,
      pipeTJunction,
    ];

    // Initialize tile pool and tiles
    this.tilePool = this.createTilePool();
    this.initializeTiles();
    this.highlightFirstTile();
  }

  /**
   * Creates a pool of pre-instantiated tiles for better performance
   * @returns {Array<Array<Tile>>} Pool of tiles organized by pipe type
   */
  createTilePool() {
    const pool = [];
    const poolSize = 10; // Buffer size for each pipe type

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

  /**
   * Gets an available tile from the pool or creates a new one if needed
   * @returns {Tile} A tile instance ready for use
   */
  getTileFromPool() {
    const typeIndex = Math.floor(Math.random() * this.pipeTypes.length);
    const tiles = this.tilePool[typeIndex];

    // Find an available tile
    const tile = tiles.find((t) => !t.visible);
    if (tile) {
      tile.visible = true;
      return tile;
    }

    // Create new tile if pool is exhausted
    const PipeClass = this.pipeTypes[typeIndex];
    return new PipeClass({ row: 0, col: 0 });
  }

  /**
   * Initializes the initial set of tiles in the row
   */
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

  /**
   * Highlights the first tile in the row and dims others
   */
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

  /**
   * Shifts all tiles up and adds a new one at the bottom
   */
  shiftTilesUp() {
    // Remove top tile and return it to pool
    const removedTile = this.tiles.shift();
    this.container.removeChild(removedTile);
    removedTile.visible = false;

    // Shift remaining tiles up
    this.tiles.forEach((tile, index) => {
      tile.y = (4 - index) * this.grid.spriteHeight * this.grid.spriteScale;
    });

    // Add new tile at bottom
    const newTile = this.getTileFromPool();
    newTile.scale.set(this.grid.spriteScale);
    newTile.x = 0;
    newTile.y = 0;

    this.container.addChild(newTile);
    this.tiles.push(newTile);

    this.highlightFirstTile();
  }

  /**
   * Cleans up resources and returns tiles to pool
   */
  destroy() {
    // Return all tiles to pool
    this.tilePool.flat().forEach((tile) => {
      tile.visible = false;
      tile.removeAllListeners();
    });

    this.tiles = [];
    this.container.removeChildren();
    this.container.destroy();
  }
}
