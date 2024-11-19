import { Container, Assets } from 'pixi.js';
import Tile from './Tile'; // Import the Tile class

// Tile assets
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

    this.tiles = []; // Stores the 5 Tile instances
    this.tileTextures = {}; // Stores textures for the new tiles

    // Load textures for tiles
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
      this.tileTextures = {
        pipeHorizontal: pipeHorizontalTexture,
        pipeVertical: pipeVerticalTexture,
        pipeTJunction: pipeTJunctionTexture,
        pipeCircleDownLeft: pipeCircleDownLeftTexture,
        pipeCircleDownRight: pipeCircleDownRightTexture,
        pipeCircleTopLeft: pipeCircleTopLeftTexture,
        pipeCircleTopRight: pipeCircleTopRightTexture,
      };

      // Create Tile objects
      this.createTiles();
    } catch (error) {
      console.error('Failed to load textures:', error);
    }
  }

  createTiles() {
    // Create 5 Tile instances for the row
    for (let i = 0; i < 5; i++) {
      const textureKey = Object.keys(this.tileTextures)[
        Math.floor(Math.random() * Object.keys(this.tileTextures).length)
      ];
      const texture = this.tileTextures[textureKey];

      // Create a Tile instance
      const tile = new Tile({
        texture,
        row: 0, // Row is irrelevant for new blocks row
        col: i, // Track column index for organizational purposes
        label: textureKey,
      });

      // Scale and position the tile
      tile.scale.set(this.grid.spriteScale);
      tile.x = 0; // Stack in the same vertical column
      tile.y = (4 - i) * this.grid.spriteHeight * this.grid.spriteScale;

      // Add the tile to the container
      this.container.addChild(tile);

      // Store the Tile instance
      this.tiles.push(tile);
    }

    // Highlight the first tile
    this.highlightSelectedTile();
  }

  highlightSelectedTile() {
    // Reset tints for all tiles
    this.tiles.forEach((tile) => (tile.tint = 0xffffff));

    // Highlight the first tile
    if (this.tiles[0]) {
      this.tiles[0].tint = 0xffff00; // Yellow highlight
    }
  }

  replaceTileInGrid() {
    // Return the first tile (selected) in the new blocks row
    return this.tiles[0];
  }

  shiftToLeft() {
    // Shift textures left in the tiles array
    for (let i = 0; i < 4; i++) {
      this.tiles[i].texture = this.tiles[i + 1].texture;
      this.tiles[i].label = this.tiles[i + 1].label;
    }

    // Generate a new random tile for the rightmost position
    const textureKeys = Object.keys(this.tileTextures);
    const randomTextureKey = textureKeys[Math.floor(Math.random() * textureKeys.length)];
    const newTexture = this.tileTextures[randomTextureKey];

    this.tiles[4].texture = newTexture;
    this.tiles[4].label = randomTextureKey;

    // Update highlight
    this.highlightSelectedTile();
  }
}
