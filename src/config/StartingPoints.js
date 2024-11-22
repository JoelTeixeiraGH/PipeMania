import StartingPointRight from '../components/pipes/StartingPointRight';
import StartingPointLeft from '../components/pipes/StartingPointLeft';
import StartingPointUp from '../components/pipes/StartingPointUp';
import StartingPointDown from '../components/pipes/StartingPointDown';

// Common validation functions
const commonValidations = {
  // Check if position is valid for all starting points
  isValidPosition: (row, gridRows) => row < gridRows - 1,

  // Check if there's a blocked cell below
  hasBlockedBelow: (row, col, blockedCells) => blockedCells.some((cell) => cell.row === row + 1 && cell.col === col),
};

// Direction-specific validation functions
const directionValidations = {
  right: {
    isValidPosition: (col, gridCols) => col < gridCols - 1,
    hasBlockedInDirection: (row, col, blockedCells) =>
      blockedCells.some((cell) => cell.row === row && cell.col === col + 1),
  },
  left: {
    isValidPosition: (col) => col > 0,
    hasBlockedInDirection: (row, col, blockedCells) =>
      blockedCells.some((cell) => cell.row === row && cell.col === col - 1),
  },
  up: {
    isValidPosition: (row) => row > 0,
    hasBlockedInDirection: (row, col, blockedCells) =>
      blockedCells.some((cell) => cell.row === row - 1 && cell.col === col),
  },
  down: {
    isValidPosition: () => true, // Always valid as it's covered by common validation
    hasBlockedInDirection: (row, col, blockedCells) => commonValidations.hasBlockedBelow(row, col, blockedCells),
  },
};

export const STARTING_POINTS = [
  {
    type: StartingPointRight,
    checkBlocked: (row, col, blockedCells) =>
      commonValidations.hasBlockedBelow(row, col, blockedCells) ||
      directionValidations.right.hasBlockedInDirection(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) =>
      commonValidations.isValidPosition(row, gridRows) && directionValidations.right.isValidPosition(col, gridCols),
  },
  {
    type: StartingPointLeft,
    checkBlocked: (row, col, blockedCells) =>
      commonValidations.hasBlockedBelow(row, col, blockedCells) ||
      directionValidations.left.hasBlockedInDirection(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) =>
      commonValidations.isValidPosition(row, gridRows) && directionValidations.left.isValidPosition(col),
  },
  {
    type: StartingPointUp,
    checkBlocked: (row, col, blockedCells) =>
      commonValidations.hasBlockedBelow(row, col, blockedCells) ||
      directionValidations.up.hasBlockedInDirection(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) =>
      commonValidations.isValidPosition(row, gridRows) && directionValidations.up.isValidPosition(row),
  },
  {
    type: StartingPointDown,
    checkBlocked: (row, col, blockedCells) => commonValidations.hasBlockedBelow(row, col, blockedCells),
    validPosition: (row, col, gridRows, gridCols) => commonValidations.isValidPosition(row, gridRows),
  },
];
