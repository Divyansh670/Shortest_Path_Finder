import { Node } from '../types';

export function dijkstra(grid: Node[][], startNode: Node, finishNode: Node): {
  visitedNodesInOrder: Node[],
  nodesInShortestPathOrder: Node[],
  metrics: { time: number, nodesVisited: number }
} {
  const startTime = performance.now();
  const visitedNodesInOrder: Node[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  
  while (unvisitedNodes.length) {
    // Sort unvisited nodes by distance
    sortNodesByDistance(unvisitedNodes);
    
    // Get the closest node
    const closestNode = unvisitedNodes.shift();
    
    // If we encounter a wall, skip it
    if (closestNode && closestNode.isWall) continue;
    
    // If the closest node has a distance of infinity, we're trapped
    if (closestNode && closestNode.distance === Infinity) break;
    
    // Mark the node as visited
    if (closestNode) {
      closestNode.isVisited = true;
      visitedNodesInOrder.push(closestNode);
      
      // If we've reached the finish node, we're done
      if (closestNode === finishNode) {
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
      
      // Update all neighbors
      if (closestNode) {
        updateUnvisitedNeighbors(closestNode, grid);
      }
    }
  }
  
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

function sortNodesByDistance(unvisitedNodes: Node[]): void {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node: Node, grid: Node[][]): void {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node: Node, grid: Node[][]): Node[] {
  const neighbors: Node[] = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid: Node[][]): Node[] {
  const nodes: Node[] = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

export function getNodesInShortestPathOrder(finishNode: Node): Node[] {
  const nodesInShortestPathOrder: Node[] = [];
  let currentNode: Node | null = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}