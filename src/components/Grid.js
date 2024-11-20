import { Container, Assets } from 'pixi.js';
import Tile from './Tile'; // Import the Tile class
import Chain from './Chain';
import PathBlocker from './PathBlocker';

import NewBlocksRow from './NewBlocksRow';
import PipeVertical from './pipes/PipeVertical';
import StartingPointRight from './pipes/StartingPointRight';

// Tiles
import basicTile from '../assets/bg_basic_tile.png';
import explosion5Tile from '../assets/bg_explosion_5.png';
import startingPointRightTile from '../assets/starting_point_right.png';
import blockedTile from '../assets/blocked_tile.png';

export default class Grid {
  constructor({ app }) {
    this.app = app;
    // Grid size
    this.gridRows = 9;
    this.gridCols = 7;
    // Tile size
    this.spriteWidth = 26;
    this.spriteHeight = 26;
    this.spriteScale = 2;

    // Calculate scale for responsive grid
    const scaleX = window.innerWidth / (this.gridCols * this.spriteWidth);
    const scaleY = window.innerHeight / (this.gridRows * this.spriteHeight);
    this.scaleFactor = Math.min(scaleX, scaleY);

    // Grid container
    this.gridContainer = new Container();
    app.stage.addChild(this.gridContainer);

    // Other properties
    this.blockedCells = [];
    this.startingPoint = null;
    this.newBlocksRow = null;
    this.tiles = Array(this.gridRows)
      .fill()
      .map(() => Array(this.gridCols).fill(null));
  }

  async init() {
    // Initialize grid first
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        let tile;
        // Randomly decide if the tile should be a PathBlocker
        if (Math.random() < 0.05) {
          tile = new PathBlocker(row, col); // Create a PathBlocker object
          this.blockedCells.push({ row, col }); // Track blocked cells
        } else {
          tile = new Chain(row, col);
          // Add click listener for replaceable tiles
          tile.on('tile:clicked', (clickedTile) => this.handleTileReplacement(clickedTile));
        }

        // Scale and position the tile
        tile.scale.set(this.spriteScale);
        tile.x = col * this.spriteWidth * this.spriteScale;
        tile.y = row * this.spriteHeight * this.spriteScale;

        this.gridContainer.addChild(tile);
        this.tiles[row][col] = tile;
      }
    }

    this.startingPoint = this.placeStartingPoint();
    this.gridContainer.addChild(this.startingPoint);

    // Center the grid
    this.gridContainer.x = (this.app.renderer.width - this.gridContainer.width) / 2;
    this.gridContainer.y = (this.app.renderer.height - this.gridContainer.height) / 2;

    // Create NewBlocksRow after grid is positioned
    this.newBlocksRow = new NewBlocksRow({
      app: this.app,
      grid: this,
    });
  }

  placeStartingPoint() {
    let validStartPosition = false;
    let startRow, startCol;

    while (!validStartPosition) {
      startRow = Math.floor(Math.random() * (this.gridRows - 1)); // Exclude the last row
      startCol = Math.floor(Math.random() * (this.gridCols - 1)); // Exclude the last column

      // Check if the below and right cells are blocked
      const isBlockedBelow = this.blockedCells.some((cell) => cell.row === startRow + 1 && cell.col === startCol);
      const isBlockedRight = this.blockedCells.some((cell) => cell.row === startRow && cell.col === startCol + 1);

      if (!isBlockedBelow && !isBlockedRight) {
        validStartPosition = true;
      }
    }

    // Find and remove the existing tile at the starting position
    const existingTile = this.gridContainer.children.find((tile) => tile.row === startRow && tile.col === startCol);
    if (existingTile) {
      this.gridContainer.removeChild(existingTile);
    }

    // Create an instance of StartingPoint
    const startingPoint = new StartingPointRight(startRow, startCol);

    // Scale and position the starting point
    startingPoint.scale.set(this.spriteScale);
    startingPoint.x = startCol * this.spriteWidth * this.spriteScale;
    startingPoint.y = startRow * this.spriteHeight * this.spriteScale;

    return startingPoint;
  }

  getTileAt(row, col) {
    if (row < 0 || row >= this.gridRows || col < 0 || col >= this.gridCols) {
      return null; // Return null if out of bounds
    }
    return this.tiles[row][col];
  }

  handleTileReplacement(clickedTile) {
    if (clickedTile instanceof PathBlocker || clickedTile instanceof StartingPointRight) {
      return;
    }

    const replacementTile = this.newBlocksRow.tiles[0];
    if (!replacementTile) return;

    const row = clickedTile.row;
    const col = clickedTile.col;

    // Remove old tile
    this.gridContainer.removeChild(clickedTile);
    this.tiles[row][col] = null;

    // Create new pipe with correct row and col
    const NewPipeClass = replacementTile.constructor;
    const newTile = new NewPipeClass({
      row: row, // Make sure these are passed correctly
      col: col,
      label: replacementTile.label,
    });

    // Store row and col directly on the tile instance
    newTile.row = row;
    newTile.col = col;

    // Setup new tile
    newTile.scale.set(this.spriteScale);
    newTile.x = col * this.spriteWidth * this.spriteScale;
    newTile.y = row * this.spriteHeight * this.spriteScale;

    // Add click listener for the new pipe
    newTile.on('tile:clicked', (tile) => this.handleTileReplacement(tile));

    // Add to grid
    this.gridContainer.addChild(newTile);
    this.tiles[row][col] = newTile;

    // Update NewBlocksRow
    this.newBlocksRow.shiftTilesUp();
  }
}
