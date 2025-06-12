import { Node, GridSize, City } from '../types';
import { indianCities } from './cityData';

const findCity = (row: number, col: number) =>
  indianCities.find(c => c.row === row && c.col === col);

const resetNode = (node: Node, city?: City): Node => ({
  ...node,
  type: city ? 'city' : 'empty',
  isVisited: false,
  distance: Infinity,
  previousNode: null,
  cityName: city?.name,
  isLandmark: city?.isLandmark,
  f: undefined,
  g: undefined,
  h: undefined,
});

export const createNode = (row: number, col: number): Node => {
  const city = findCity(row, col);
  return resetNode({ row, col, isWall: false } as Node, city);
};

export const createInitialGrid = ({ rows, cols }: GridSize): Node[][] =>
  Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => createNode(row, col))
  );

export const getNewGridWithWallToggled = (grid: Node[][], row: number, col: number): Node[][] => {
  const node = grid[row][col];
  if (['start', 'end', 'city'].includes(node.type)) return grid;
  const updated = { ...node, isWall: !node.isWall, type: node.isWall ? 'empty' : 'wall' };
  return updateGridNode(grid, updated);
};

const updateSpecialNode = (
  grid: Node[][],
  row: number,
  col: number,
  type: 'start' | 'end',
  previous: { row: number; col: number } | null
): Node[][] => {
  const newGrid = grid.map(r => [...r]);
  if (previous) newGrid[previous.row][previous.col] = resetNode(grid[previous.row][previous.col], findCity(previous.row, previous.col));
  if (grid[row][col].type === (type === 'start' ? 'end' : 'start')) return grid;
  newGrid[row][col] = { ...grid[row][col], type, isWall: false };
  return newGrid;
};

export const getNewGridWithStartNode = (grid: Node[][], row: number, col: number, prev: any) =>
  updateSpecialNode(grid, row, col, 'start', prev);

export const getNewGridWithEndNode = (grid: Node[][], row: number, col: number, prev: any) =>
  updateSpecialNode(grid, row, col, 'end', prev);

export const getGridWithUpdatedNode = (grid: Node[][], updatedNode: Node): Node[][] => {
  const newGrid = grid.map(r => [...r]);
  newGrid[updatedNode.row][updatedNode.col] = updatedNode;
  return newGrid;
};

export const resetGrid = (grid: Node[][]): Node[][] =>
  grid.map((row, rIdx) =>
    row.map((node, cIdx) =>
      ['start', 'end'].includes(node.type)
        ? { ...node, isVisited: false, distance: Infinity, previousNode: null }
        : resetNode(node, findCity(rIdx, cIdx))
    )
  );

export const clearPath = resetGrid;

export function getGridDimensions(): GridSize {
  const nodeSize = 48, padding = 32;
  const cols = Math.floor((window.innerWidth - 2 * padding) / nodeSize);
  const rows = Math.floor((window.innerHeight - 4 * padding) / nodeSize);
  return { rows: Math.min(25, Math.max(25, rows)), cols: Math.min(25, Math.max(25, cols)) };
}
