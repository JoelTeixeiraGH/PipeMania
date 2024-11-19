export default class WaterFlow {
  constructor({ grid }) {
    this.grid = grid;
    this.intervalTime = 2000; // Time between flow updates (2s)
    this.waterTiles = []; // Initialize waterTiles array
    this.flowInterval = null; // To control the flow
  }

  // Starts the flow and continuously moves the water
  startFlow(startingPoint) {
    startingPoint.fillWithWater();
    this.waterTiles.push(startingPoint); // Start water flow from the starting point
    this.flowInterval = setInterval(() => {
      this.processWaterFlow();
    }, this.intervalTime);
  }

  // Stops the water flow (called when the player wins or loses)
  stopFlow() {
    clearInterval(this.flowInterval);
  }

  // Process the water's movement step by step
  processWaterFlow() {
    if (this.waterTiles.length === 0) {
      this.stopFlow();
      return;
    }

    const currentTile = this.waterTiles[this.waterTiles.length - 1]; // The first tile where water is
    const nextTile = this.getNextTile(currentTile); // Get the next tile to flow to

    if (nextTile) {
      this.waterTiles.push(nextTile); // Move the water to the next tile
      nextTile.fillWithWater(); // Use the `fillWithWater` method on the tile

      // Check if the player has won or lost
      if (this.checkWinCondition(nextTile)) {
        console.log('You win!');
        this.stopFlow();
      } else if (this.checkLoseCondition(nextTile)) {
        console.log('You lose!');
        this.stopFlow();
      }
    } else {
      console.log('No valid path! You lose!');
      this.stopFlow();
    }
  }

  // Get the next valid tile where the water should flow
  getNextTile(currentTile) {
    // For simplicity, just checking the right tile.
    const rightTile = this.grid.getTileAt(currentTile.row, currentTile.col + 1);
    console.log(rightTile);
    return rightTile;
  }

  // TODO
  checkWinCondition(tile) {}

  // TODO
  checkLoseCondition(tile) {}
}
