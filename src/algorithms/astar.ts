import { Node } from '../types';

export function astar(grid: Node[][], startNode: Node, finishNode: Node): {
  visitedNodesInOrder: Node[],
  nodesInShortestPathOrder: Node[],
  metrics: { time: number, nodesVisited: number }
} {
  const startTime = performance.now();
  const visitedNodesInOrder: Node[] = [];
  
  // Initialize start node
  startNode.distance = 0;
  startNode.g = 0;
  startNode.h = heuristic(startNode, finishNode);
  startNode.f = startNode.g + startNode.h;
  
  const openList: Node[] = [startNode];
  const closedList: Set<string> = new Set();
  
  while (openList.length > 0) {
    // Sort open list by f value (lowest first)
    sortByF(openList);
    
    // Get current node (lowest f value)
    const currentNode = openList.shift();
    
    if (!currentNode) break;
    
    // Add to visited nodes
    visitedNodesInOrder.push(currentNode);
    
    // Add to closed list
    closedList.add(`${currentNode.row}-${currentNode.col}`);
    
    // Check if we reached the finish node
    if (currentNode === finishNode) {
      const endTime = performance.now();
      return {
        visitedNodesInOrder,
        nodesInShortestPathOrder: getNodesInShortestPathOrder(finishNode),
        metrics: {
          time: endTime - startTime,
          nodesVisited: visitedNodesInOrder.length
        }
      };
    }
    
    // Get all neighbors
    const neighbors = getNeighbors(currentNode, grid);
    
    for (const neighbor of neighbors) {
      // Skip if in closed list or is a wall
      if (closedList.has(`${neighbor.row}-${neighbor.col}`) || neighbor.isWall) {
        continue;
      }
      
      // Calculate g score (distance from start)
      const tentativeG = (currentNode.g || 0) + 1;
      
      // Skip if we already have a better path
      if (neighbor.g !== undefined && tentativeG >= neighbor.g) {
        continue;
      }
      
      // Update neighbor
      neighbor.previousNode = currentNode;
      neighbor.g = tentativeG;
      neighbor.h = heuristic(neighbor, finishNode);
      neighbor.f = neighbor.g + neighbor.h;
      
      // Add to open list if not already there
      if (!openList.includes(neighbor)) {
        openList.push(neighbor);
      }
    }
  }
  
  // No path found
  const endTime = performance.now();
  return {
    visitedNodesInOrder,
    nodesInShortestPathOrder: [],
    metrics: {
      time: endTime - startTime,
      nodesVisited: visitedNodesInOrder.length
    }
  };
}

// Manhattan distance heuristic
function heuristic(node: Node, finishNode: Node): number {
  return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}

function sortByF(nodes: Node[]): void {
  nodes.sort((a, b) => {
    // Use f value as primary sort, then h as tie-breaker
    const fDiff = (a.f || Infinity) - (b.f || Infinity);
    if (fDiff !== 0) return fDiff;
    return (a.h || 0) - (b.h || 0);
  });
}

function getNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  
  // Get all 4 neighbors (up, down, left, right)
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors;
}

// Same as in dijkstra.ts
function getNodesInShortestPathOrder(finishNode: Node): Node[] {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}