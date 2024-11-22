import { Container, Assets } from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';

// Tiles
import Tile from '../tiles/Tile';
import Chain from '../tiles/Chain';
import PathBlocker from '../tiles/PathBlocker';

// Starting points
import StartingPointRight from '../pipes/StartingPointRight';
import StartingPointLeft from '../pipes/StartingPointLeft';
import StartingPointUp from '../pipes/StartingPointUp';
import StartingPointDown from '../pipes/StartingPointDown';

// NewBlocksRow
import NewBlocksRow from './NewBlocksRow';

// Starting points
import { STARTING_POINTS } from './StartingPoints';

export default class Grid {
  /**
   * Creates a new Grid instance
   * @param {Object} params - The initialization parameters
   * @param {PIXI.Application} params.app - The PIXI application instance
   */
  constructor({ app }) {
    this.initializeProperties(app);
    this.setupGridContainer(app);
  }

  /**
   * Initializes all grid properties with default values
   * @param {PIXI.Application} app - The PIXI application instance
   */
  initializeProperties(app) {
    this.app = app;
    this.gridRows = 9;
    this.gridCols = 7;
    this.spriteWidth = 26;
    this.spriteHeight = 26;
    this.spriteScale = 2;
    this.blockedCells = [];
    this.startingPoint = null;
    this.newBlocksRow = null;
    this.tiles = this.createEmptyTilesArray();
    this.gameOver = false;
    this.blockTileChance = 0.05;
  }

  /**
   * Creates a 2D array filled with null values for the grid
   * @returns {Array<Array<null>>} Empty 2D array representing the grid
   */
  createEmptyTilesArray() {
    return Array(this.gridRows)
      .fill()
      .map(() => Array(this.gridCols).fill(null));
  }

  /**
   * Sets up the main container for the grid
   * @param {PIXI.Application} app - The PIXI application instance
   */
  setupGridContainer(app) {
    this.gridContainer = new Container();
    app.stage.addChild(this.gridContainer);
  }

  /**
   * Initializes the grid by placing tiles, starting point, and creating the new blocks row
   */
  async init() {
    this.initializeGridTiles();
    this.startingPoint = this.placeStartingPoint();
    this.gridContainer.addChild(this.startingPoint);
    this.centerGrid();
    this.createNewBlocksRow();
  }

  /**
   * Creates and places initial tiles for the entire grid
   */
  initializeGridTiles() {
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        this.createAndPlaceTile(row, col);
      }
    }
  }

  /**
   * Creates and places a single tile at the specified position
   * @param {number} row - The row index
   * @param {number} col - The column index
   */
  createAndPlaceTile(row, col) {
    const tile = this.createTile(row, col);
    this.positionTile(tile, row, col);
    this.gridContainer.addChild(tile);
    this.tiles[row][col] = tile;
  }

  /**
   * Creates either a PathBlocker or Chain tile based on random chance
   * @param {number} row - The row index
   * @param {number} col - The column index
   * @returns {PathBlocker|Chain} The created tile
   */
  createTile(row, col) {
    let tile;
    if (Math.random() < this.blockTileChance) {
      tile = new PathBlocker(row, col);
      this.blockedCells.push({ row, col });
    } else {
      tile = new Chain(row, col);
      tile.on('tile:clicked', (clickedTile) => this.handleTileReplacement(clickedTile));
    }
    return tile;
  }

  /**
   * Positions a tile at the specified grid coordinates
   * @param {Tile} tile - The tile to position
   * @param {number} row - The row index
   * @param {number} col - The column index
   */
  positionTile(tile, row, col) {
    tile.scale.set(this.spriteScale);
    tile.x = col * this.spriteWidth * this.spriteScale;
    tile.y = row * this.spriteHeight * this.spriteScale;
  }

  /**
   * Centers the grid container in the application window
   */
  centerGrid() {
    this.gridContainer.x = (this.app.renderer.width - this.gridContainer.width) / 2;
    this.gridContainer.y = (this.app.renderer.height - this.gridContainer.height) / 2;
  }

  /**
   * Creates the row of new blocks at the bottom of the grid
   */
  createNewBlocksRow() {
    this.newBlocksRow = new NewBlocksRow({
      app: this.app,
      grid: this,
    });
  }

  /**
   * Places a starting point at a random valid position on the grid
   * @returns {StartingPoint} The created starting point
   */
  placeStartingPoint() {
    let validStartPosition = false;
    let startRow, startCol, selectedStartingPoint;

    while (!validStartPosition) {
      // Random position
      startRow = Math.floor(Math.random() * this.gridRows);
      startCol = Math.floor(Math.random() * this.gridCols);

      // Get random starting points
      const availableStartingPoints = STARTING_POINTS.filter(
        (sp) =>
          sp.validPosition(startRow, startCol, this.gridRows, this.gridCols) &&
          !sp.checkBlocked(startRow, startCol, this.blockedCells)
      );

      if (availableStartingPoints.length > 0) {
        selectedStartingPoint = availableStartingPoints[Math.floor(Math.random() * availableStartingPoints.length)];
        validStartPosition = true;
      }
    }

    // Find and remove the existing tile at the starting position
    const existingTile = this.gridContainer.children.find((tile) => tile.row === startRow && tile.col === startCol);
    if (existingTile) {
      this.gridContainer.removeChild(existingTile);
    }

    // Create the selected starting point
    const startingPoint = new selectedStartingPoint.type(startRow, startCol);

    // Scale and position the starting point
    startingPoint.scale.set(this.spriteScale);
    startingPoint.x = startCol * this.spriteWidth * this.spriteScale;
    startingPoint.y = startRow * this.spriteHeight * this.spriteScale;

    return startingPoint;
  }

  /**
   * Gets the tile at the specified position
   * @param {number} row - The row index
   * @param {number} col - The column index
   * @returns {Tile|null} The tile at the position or null if out of bounds
   */
  getTileAt(row, col) {
    if (row < 0 || row >= this.gridRows || col < 0 || col >= this.gridCols) {
      return null; // Return null if out of bounds
    }
    return this.tiles[row][col];
  }

  /**
   * Handles the replacement of a clicked tile
   * @param {Tile} clickedTile - The tile that was clicked
   */
  handleTileReplacement(clickedTile) {
    if (this.isReplacementInvalid(clickedTile)) return;

    const replacementTile = this.newBlocksRow.tiles[0];
    if (!replacementTile) return;

    this.performTileReplacement(clickedTile, replacementTile);
  }

  /**
   * Checks if a tile replacement is invalid
   * @param {Tile} clickedTile - The tile to check
   * @returns {boolean} True if replacement is invalid
   */
  isReplacementInvalid(clickedTile) {
    return this.gameOver || clickedTile instanceof PathBlocker || clickedTile instanceof StartingPointRight;
  }

  /**
   * Performs the tile replacement animation sequence
   * @param {Tile} oldTile - The tile being replaced
   * @param {Tile} replacementTile - The new tile
   */
  performTileReplacement(oldTile, replacementTile) {
    const row = oldTile.row;
    const col = oldTile.col;

    this.animateOldTileRemoval(oldTile, row, col, () => {
      this.placeNewTileWithAnimation(replacementTile, row, col);
    });

    this.newBlocksRow.shiftTilesUp();
  }

  /**
   * Animates the removal of an old tile
   * @param {Tile} tile - The tile to remove
   * @param {number} row - The row index
   * @param {number} col - The column index
   * @param {Function} onComplete - Callback function after animation
   */
  animateOldTileRemoval(tile, row, col, onComplete) {
    const animate = () => {
      const speed = 0.08;
      tile.alpha -= speed;

      if (tile.alpha > 0.5) {
        tile.scale.x += speed;
        tile.scale.y += speed;
      } else {
        tile.scale.x -= speed * 1.5;
        tile.scale.y -= speed * 1.5;
      }

      if (tile.alpha <= 0) {
        this.gridContainer.removeChild(tile);
        this.tiles[row][col] = null;
        onComplete();
      } else {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Places a new tile with animation
   * @param {Tile} replacementTile - The tile to place
   * @param {number} row - The row index
   * @param {number} col - The column index
   */
  placeNewTileWithAnimation(replacementTile, row, col) {
    const newTile = this.createNewTile(replacementTile, row, col);
    this.setupNewTile(newTile, row, col);
    this.animateNewTilePlacement(newTile);
  }

  /**
   * Creates a new tile instance based on a source tile
   * @param {Tile} sourceTile - The tile to copy from
   * @param {number} row - The row index
   * @param {number} col - The column index
   * @returns {Tile} The new tile instance
   */
  createNewTile(sourceTile, row, col) {
    // Create a new instance of the same type as the source tile
    const NewTileClass = sourceTile.constructor;
    const newTile = new NewTileClass(row, col);

    // Copy relevant properties
    newTile.rotation = sourceTile.rotation;
    newTile.texture = sourceTile.texture;

    return newTile;
  }

  /**
   * Sets up a new tile with proper position and event listeners
   * @param {Tile} newTile - The tile to setup
   * @param {number} row - The row index
   * @param {number} col - The column index
   */
  setupNewTile(newTile, row, col) {
    newTile.scale.set(this.spriteScale);
    newTile.x = col * this.spriteWidth * this.spriteScale;
    newTile.y = row * this.spriteHeight * this.spriteScale;
    newTile.alpha = 1;

    // Add click handler
    newTile.on('tile:clicked', (clickedTile) => this.handleTileReplacement(clickedTile));

    // Add to grid container and update tiles array
    this.gridContainer.addChild(newTile);
    this.tiles[row][col] = newTile;
  }

  /**
   * Animates the placement of a new tile
   * @param {Tile} newTile - The tile to animate
   */
  animateNewTilePlacement(newTile) {
    // Optional: Add placement animation
    newTile.alpha = 0;

    const animate = () => {
      const speed = 0.1;
      newTile.alpha += speed;

      if (newTile.alpha < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  /**
   * Cleans up the grid and releases resources
   */
  destroy() {
    this.removeEventListeners();
    this.cleanupGridContainer();
    this.clearReferences();
  }

  /**
   * Removes all event listeners from tiles
   */
  removeEventListeners() {
    // Remove all event listeners from tiles
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const tile = this.tiles[row][col];
        if (tile) {
          tile.removeAllListeners(); // Remove all event listeners
        }
      }
    }
  }

  /**
   * Cleans up the grid container and its children
   */
  cleanupGridContainer() {
    // Remove and destroy the grid container
    if (this.gridContainer) {
      this.gridContainer.destroy({ children: true });
    }
  }

  /**
   * Clears all references to prevent memory leaks
   */
  clearReferences() {
    // Clear references
    this.startingPoint = null;
    this.gameOver = false;
    this.tiles = null;
    this.gridContainer = null;
  }
}
