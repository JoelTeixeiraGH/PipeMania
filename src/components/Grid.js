import { Sprite, Assets, Texture, Loader, Container } from 'pixi.js';
import NewBlocksRow from './NewBlocksRow';

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
    // Sprite size
    this.spriteWidth = 26;
    this.spriteHeight = 26;
    // Sprite scale size
    this.spriteScale = 2;

    // Scale values calculation
    const scaleX = window.innerWidth / (this.gridCols * this.spriteWidth);
    const scaleY = window.innerHeight / (this.gridRows * this.spriteHeight);
    this.scaleFactor = Math.min(scaleX, scaleY);

    // Container
    this.gridContainer = new Container();
    app.stage.addChild(this.gridContainer);

    // Blocked cells
    this.blockedCells = [];

    this.newBlocksRow = new NewBlocksRow({ app, grid: this });
  }

  async init() {
    // Textures
    const basicGridTileTexture = await Assets.load(basicTile);
    basicGridTileTexture.source.scaleMode = 'nearest';
    const startingPointTexture = await Assets.load(startingPointRightTile);
    startingPointTexture.source.scaleMode = 'nearest';
    const blockedTileTexture = await Assets.load(blockedTile);
    blockedTileTexture.source.scaleMode = 'nearest';

    // Build the grid
    for (let row = 0; row < this.gridRows; row++) {
      for (let col = 0; col < this.gridCols; col++) {
        const basicTileSprite = new Sprite(basicGridTileTexture);

        // Scale the sprite
        basicTileSprite.scale.set(this.spriteScale);

        // Position the sprite on the screen
        basicTileSprite.x = col * this.spriteWidth * this.spriteScale;
        basicTileSprite.y = row * this.spriteHeight * this.spriteScale;

        // 5% chance to create blocked spots
        if (Math.random() < 0.05) {
          basicTileSprite.texture = blockedTileTexture;
          this.blockedCells.push({ row, col });
        } else {
          basicTileSprite.interactive = true;
          basicTileSprite.buttonMode = true;
        }

        // Add the sprite to the container
        this.gridContainer.addChild(basicTileSprite);

        const explosion5TileTexture = await Assets.load(explosion5Tile);
        explosion5TileTexture.source.scaleMode = 'nearest';

        basicTileSprite.on('pointerdown', (event) => {
          this.onPointerDown(event, explosion5TileTexture);
        });
      }
    }

    this.placeStartingPoint(startingPointTexture);

    // Center gridContainer
    this.gridContainer.x = (this.app.renderer.width - this.gridContainer.width) / 2;
    this.gridContainer.y = (this.app.renderer.height - this.gridContainer.height) / 2;
  }

  // TODO: Pass more than one starting point direction
  placeStartingPoint(startingPointTexture) {
    let validStartPosition = false;
    let startRow, startCol;

    while (!validStartPosition) {
      // Randomly select a row and column (but not the last row)
      startRow = Math.floor(Math.random() * (this.gridRows - 1)); // Don't select the last row
      startCol = Math.floor(Math.random() * (this.gridCols - 1)); // Can remove -1 if i add more sprites

      // Check if the cell below is blocked or if the right cell is blocked or if it's in the last row
      const isBlockedBelow = this.blockedCells.some((cell) => cell.row === startRow + 1 && cell.col === startCol);
      const isBlockedRight = this.blockedCells.some((cell) => cell.row === startRow && cell.col === startCol + 1);

      if (!isBlockedBelow && !isBlockedRight && startCol < this.gridCols - 1) {
        validStartPosition = true;
      }
    }

    const startingTile = this.gridContainer.getChildAt(startRow * this.gridCols + startCol);
    startingTile.texture = startingPointTexture;
    startingTile.interactive = false;
    startingTile.buttonMode = false;
  }

  // Handle the click on the grid tile
  onPointerDown = (event, newTexture) => {
    const sprite = event.currentTarget;
    sprite.texture = this.newBlocksRow.replaceTileInGrid();
    this.newBlocksRow.shiftToLeft();
  };
}
