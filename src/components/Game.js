import Grid from './Grid';
import WaterFlow from './WaterFlow';

export async function initGame(app) {
  // Create and initialize grid
  const grid = new Grid({ app });
  await grid.init();

  // Initialize water flow after grid is ready
  const waterFlow = new WaterFlow({ grid });

  return {
    destroy: () => {
      waterFlow.destroy();
      grid.destroy();
    },
  };
}
