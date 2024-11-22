import { Container, Assets } from 'pixi.js';
import { GlowFilter } from '@pixi/filter-glow';
import Tile from './Tile';
import Chain from './Chain';
import PathBlocker from './PathBlocker';

import NewBlocksRow from './NewBlocksRow';
import PipeVertical from './pipes/PipeVertical';
import StartingPointRight from './pipes/StartingPointRight';

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
    this.gameOver = false;

    this.blockTileChance = 0.05;
  }

  destroy() {
    // Remove all event listeners from tiles
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const tile = this.tiles[row][col];
        if (tile) {
          tile.removeAllListeners(); // Remove all event listeners
        }
      }
    }

    // Unload textures properly
    const textureKeys = [
      'straight',
      'corner',
      'cross',
      'start',
      // Add any other texture keys you're using
    ];

    // Unload all textures
    textureKeys.forEach((key) => {
      if (Assets.cache.has(key)) {
        Assets.unload(key);
      }
    });

    // Clear tiles array
    this.tiles = [];

    // Remove and destroy the grid container
    if (this.gridContainer) {
      this.gridContainer.destroy({ children: true });
    }

    // Clear references
    this.startingPoint = null;
    this.gameOver = false;
    this.tiles = null;
    this.gridContainer = null;
  }

  async init() {
    // Initialize grid first
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        let tile;
        // Randomly decide if the tile should be a PathBlocker
        if (Math.random() < this.blockTileChance) {
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
    // Check if game is over first
    if (this.gameOver) {
      return;
    }

    if (clickedTile instanceof PathBlocker || clickedTile instanceof StartingPointRight) {
      return;
    }

    const replacementTile = this.newBlocksRow.tiles[0];
    if (!replacementTile) return;

    const row = clickedTile.row;
    const col = clickedTile.col;

    // Remove old tile with fade out
    const fadeOutOldTile = () => {
      const speed = 0.08;
      clickedTile.alpha -= speed;

      // First grow quickly, then shrink
      if (clickedTile.alpha > 0.5) {
        clickedTile.scale.x += speed;
        clickedTile.scale.y += speed;
      } else {
        clickedTile.scale.x -= speed * 1.5;
        clickedTile.scale.y -= speed * 1.5;
      }

      if (clickedTile.alpha <= 0) {
        this.gridContainer.removeChild(clickedTile);
        this.tiles[row][col] = null;
        placeNewTile();
      } else {
        requestAnimationFrame(fadeOutOldTile);
      }
    };

    // Place new tile with animation
    const placeNewTile = () => {
      const NewPipeClass = replacementTile.constructor;
      const newTile = new NewPipeClass({
        row: row,
        col: col,
        label: replacementTile.label,
      });

      // Setup new tile
      newTile.row = row;
      newTile.col = col;
      newTile.scale.set(0); // Start with scale 0 for pop effect
      newTile.x = col * this.spriteWidth * this.spriteScale + (this.spriteWidth * this.spriteScale) / 2;
      newTile.y = row * this.spriteHeight * this.spriteScale + (this.spriteHeight * this.spriteScale) / 2;
      newTile.anchor.set(0.5); // Set anchor to center for better scaling
      newTile.alpha = 0.8; // Start slightly transparent

      // Add glow filter
      const glowFilter = new GlowFilter({
        distance: 15,
        outerStrength: 2,
        innerStrength: 1,
        color: 0x00ffff,
        quality: 0.5,
      });
      newTile.filters = [glowFilter];

      newTile.on('tile:clicked', (tile) => this.handleTileReplacement(tile));

      this.gridContainer.addChild(newTile);
      this.tiles[row][col] = newTile;

      // Pop in animation
      let scale = 0;
      const animatePlace = () => {
        scale += 0.15;
        const currentScale = Math.min(this.spriteScale, this.spriteScale * (1 + Math.sin(scale) * 0.3));
        newTile.scale.set(currentScale);
        newTile.alpha = Math.min(1, newTile.alpha + 0.1);

        if (scale <= Math.PI) {
          requestAnimationFrame(animatePlace);
        } else {
          // Reset scale and position
          newTile.scale.set(this.spriteScale);
          newTile.x = col * this.spriteWidth * this.spriteScale;
          newTile.y = row * this.spriteHeight * this.spriteScale;
          newTile.anchor.set(0);

          // Fade out glow
          const fadeOutGlow = () => {
            glowFilter.outerStrength -= 0.1;
            if (glowFilter.outerStrength <= 0) {
              newTile.filters = null;
            } else {
              requestAnimationFrame(fadeOutGlow);
            }
          };
          setTimeout(fadeOutGlow, 200);
        }
      };

      animatePlace();
    };

    // Start the animation sequence
    fadeOutOldTile();

    // Update NewBlocksRow
    this.newBlocksRow.shiftTilesUp();
  }
}
