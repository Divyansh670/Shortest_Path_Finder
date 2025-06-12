export type NodeType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path' | 'city';

export interface Node {
  row: number;
  col: number;
  type: NodeType;
  isVisited: boolean;
  distance: number;
  previousNode: Node | null;
  isWall: boolean;
  f?: number;
  g?: number;
  h?: number;
  cityName?: string;
  isLandmark?: boolean;
}

export interface GridSize {
  rows: number;
  cols: number;
}

export interface City {
  name: string;
  row: number;
  col: number;
  isLandmark?: boolean;
}

export type Algorithm = 'dijkstra' | 'astar';