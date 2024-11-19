import { Sprite, Assets, Container } from 'pixi.js';
// Tiles
import pipeHorizontalTile from '../assets/pipe_horizontal.png';
import pipeVerticalTile from '../assets/pipe_vertical.png';
import pipeTJunctionTile from '../assets/pipe_tjunction.png';
import pipeCircleDownLeftTile from '../assets/pipe_circle_downleft.png';
import pipeCircleDownRightTile from '../assets/pipe_circle_downright.png';
import pipeCircleTopLeftTile from '../assets/pipe_circle_topleft.png';
import pipeCircleTopRightTile from '../assets/pipe_circle_topright.png';

export default class NewBlocksRow {
  constructor({ app, grid }) {
    this.app = app;
    this.grid = grid;
    this.container = new Container();
    app.stage.addChild(this.container);

    this.tiles = []; // Stores the 5 tiles
    this.tileTextures = []; // Array to store textures for the new tiles

    // Load the textures for the new blocks row
    this.loadTextures();
  }

  async loadTextures() {
    try {
      // Load textures for the blocks
      const pipeHorizontalTexture = await Assets.load(pipeHorizontalTile);
      pipeHorizontalTexture.source.scaleMode = 'nearest';
      const pipeVerticalTexture = await Assets.load(pipeVerticalTile);
      pipeVerticalTexture.source.scaleMode = 'nearest';
      const pipeTJunctionTexture = await Assets.load(pipeTJunctionTile);
      pipeTJunctionTexture.source.scaleMode = 'nearest';
      const pipeCircleDownLeftTexture = await Assets.load(pipeCircleDownLeftTile);
      pipeCircleDownLeftTexture.source.scaleMode = 'nearest';
      const pipeCircleDownRightTexture = await Assets.load(pipeCircleDownRightTile);
      pipeCircleDownRightTexture.source.scaleMode = 'nearest';
      const pipeCircleTopLeftTexture = await Assets.load(pipeCircleTopLeftTile);
      pipeCircleTopLeftTexture.source.scaleMode = 'nearest';
      const pipeCircleTopRightTexture = await Assets.load(pipeCircleTopRightTile);
      pipeCircleTopRightTexture.source.scaleMode = 'nearest';

      // Store textures
      this.tileTextures = [
        pipeHorizontalTexture,
        pipeVerticalTexture,
        pipeTJunctionTexture,
        pipeCircleDownLeftTexture,
        pipeCircleDownRightTexture,
        pipeCircleTopLeftTexture,
        pipeCircleTopRightTexture,
      ];
      this.createTiles();
    } catch (error) {
      console.error('Failed to load textures:', error);
    }
  }

  createTiles() {
    // Create 5 tiles in the new blocks row
    for (let i = 0; i < 5; i++) {
      const tileSprite = new Sprite(this.tileTextures[Math.floor(Math.random() * this.tileTextures.length)]); // Cycle textures
      tileSprite.scale.set(this.grid.spriteScale); // Scale the sprite to match grid size

      // Position the tiles vertically like a stack
      tileSprite.x = 0; // Keep all tiles in the same column (x = 0)
      tileSprite.y = (4 - i) * this.grid.spriteHeight * this.grid.spriteScale; // Stack upwards, tile 0 at the bottom

      // Add the tile to the container
      this.container.addChild(tileSprite);

      // Store the tile sprite in the tiles array
      this.tiles.push(tileSprite);
    }

    // Highlight the first tile (selected)
    this.highlightSelectedTile();
  }

  // Update the selected tile
  highlightSelectedTile() {
    // Highlight the selected tile
    this.tiles[0].tint = 0xffff00; // Yellow highlight
  }

  // Replace the tile in the grid and shift tiles
  replaceTileInGrid() {
    return this.tiles[0].texture;
  }

  shiftToLeft() {
    for (let i = 0; i < 4; i++) {
      this.tiles[i].texture = this.tiles[i + 1].texture; // Move texture to the left
    }

    // Set a new tile at the rightmost position (index 4) on the copy
    const newTileTexture = this.tileTextures[Math.floor(Math.random() * this.tileTextures.length)];
    this.tiles[4].texture = newTileTexture; // Add a new tile at the right end

    // Update the selected tile index to the new rightmost tile
    this.highlightSelectedTile();
  }
}
