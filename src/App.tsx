import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Controls from './components/Controls';
import Legend from './components/Legend';
import HelpModal from './components/HelpModal';
import { dijkstra } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { indianCities } from './utils/cityData';
import { 
  Node, 
  Algorithm, 
  GridSize 
} from './types';
import { 
  createInitialGrid,
  getNewGridWithWallToggled,
  getNewGridWithStartNode,
  getNewGridWithEndNode,
  resetGrid,
  clearPath,
  getGridDimensions
} from './utils/gridUtils';
import { Map } from 'lucide-react';

function App() {
  // Grid state
  const [gridSize, setGridSize] = useState<GridSize>(getGridDimensions());
  const [grid, setGrid] = useState<Node[][]>(createInitialGrid(gridSize));
  const [mouseIsPressed, setMouseIsPressed] = useState<boolean>(false);
  const [startNodePos, setStartNodePos] = useState<{row: number, col: number}>(indianCities[0]);
  const [endNodePos, setEndNodePos] = useState<{row: number, col: number}>(indianCities[1]);
  const [isMovingStart, setIsMovingStart] = useState<boolean>(false);
  const [isMovingEnd, setIsMovingEnd] = useState<boolean>(false);
  
  // Algorithm state
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>('dijkstra');
  const [speed, setSpeed] = useState<number>(20);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [isPathFound, setIsPathFound] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<{time: number, nodesVisited: number} | null>(null);
  
  // UI state
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  useEffect(() => {
    initializeGrid();
  }, [gridSize]);

  useEffect(() => {
    const handleResize = () => {
      const newGridSize = getGridDimensions();
      if (newGridSize.rows !== gridSize.rows || newGridSize.cols !== gridSize.cols) {
        setGridSize(newGridSize);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [gridSize]);

  const initializeGrid = useCallback(() => {
    const newGrid = createInitialGrid(gridSize);
    
    const safeStartRow = Math.min(startNodePos.row, gridSize.rows - 1);
    const safeStartCol = Math.min(startNodePos.col, gridSize.cols - 1);
    const startGrid = getNewGridWithStartNode(
      newGrid, 
      safeStartRow, 
      safeStartCol, 
      null
    );
    setStartNodePos({row: safeStartRow, col: safeStartCol});
    
    const safeEndRow = Math.min(endNodePos.row, gridSize.rows - 1);
    const safeEndCol = Math.min(endNodePos.col, gridSize.cols - 1);
    const finalGrid = getNewGridWithEndNode(
      startGrid, 
      safeEndRow, 
      safeEndCol, 
      null
    );
    setEndNodePos({row: safeEndRow, col: safeEndCol});
    
    setGrid(finalGrid);
    setIsPathFound(false);
    setMetrics(null);
  }, [gridSize, startNodePos, endNodePos]);

  const handleMouseDown = (row: number, col: number) => {
    if (row === startNodePos.row && col === startNodePos.col) {
      setIsMovingStart(true);
      setMouseIsPressed(true);
      return;
    }
    
    if (row === endNodePos.row && col === endNodePos.col) {
      setIsMovingEnd(true);
      setMouseIsPressed(true);
      return;
    }
    
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed) return;
    
    if (isMovingStart) {
      const newGrid = getNewGridWithStartNode(grid, row, col, startNodePos);
      setGrid(newGrid);
      setStartNodePos({row, col});
      return;
    }
    
    if (isMovingEnd) {
      const newGrid = getNewGridWithEndNode(grid, row, col, endNodePos);
      setGrid(newGrid);
      setEndNodePos({row, col});
      return;
    }
    
    const newGrid = getNewGridWithWallToggled(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setIsMovingStart(false);
    setIsMovingEnd(false);
  };

  const animateAlgorithm = (
    visitedNodesInOrder: Node[], 
    nodesInShortestPathOrder: Node[],
    algoMetrics: {time: number, nodesVisited: number}
  ) => {
    const frameTime = 1000 / speed;
    
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, frameTime * i);
        return;
      }
      
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (node.row === startNodePos.row && node.col === startNodePos.col) return;
        if (node.row === endNodePos.row && node.col === endNodePos.col) return;
        
        const newGrid = [...grid];
        const newNode = {
          ...node,
          type: 'visited' as const
        };
        newGrid[node.row][node.col] = newNode;
        setGrid(newGrid);
      }, frameTime * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder: Node[]) => {
    const frameTime = 1000 / (speed / 2);
    
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        if (node.row === startNodePos.row && node.col === startNodePos.col) return;
        if (node.row === endNodePos.row && node.col === endNodePos.col) return;
        
        const newGrid = [...grid];
        const newNode = {
          ...node,
          type: 'path' as const
        };
        newGrid[node.row][node.col] = newNode;
        setGrid(newGrid);
        
        if (i === nodesInShortestPathOrder.length - 1) {
          setIsVisualizing(false);
          setIsPathFound(true);
        }
      }, frameTime * i);
    }
    
    if (nodesInShortestPathOrder.length === 0) {
      setIsVisualizing(false);
    }
  };

  const visualizeAlgorithm = () => {
    if (isVisualizing) return;
    
    const clearedGrid = clearPath(grid);
    setGrid(clearedGrid);
    
    setIsVisualizing(true);
    setIsPathFound(false);
    setMetrics(null);
    
    const startNode = clearedGrid[startNodePos.row][startNodePos.col];
    const endNode = clearedGrid[endNodePos.row][endNodePos.col];
    
    let result;
    if (selectedAlgorithm === 'dijkstra') {
      result = dijkstra(clearedGrid, startNode, endNode);
    } else {
      result = astar(clearedGrid, startNode, endNode);
    }
    
    const { visitedNodesInOrder, nodesInShortestPathOrder, metrics: algoMetrics } = result;
    
    setMetrics(algoMetrics);
    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder, algoMetrics);
  };

  const handleClearPath = () => {
    if (isVisualizing) return;
    const newGrid = clearPath(grid);
    setGrid(newGrid);
    setIsPathFound(false);
    setMetrics(null);
  };

  const handleResetGrid = () => {
    if (isVisualizing) return;
    initializeGrid();
  };

  const handleAlgorithmChange = (algorithm: Algorithm) => {
    setSelectedAlgorithm(algorithm);
    if (isPathFound) {
      handleClearPath();
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Map size={28} />
            <h1 className="text-2xl font-bold">PathFinder</h1>
          </div>
          <div className="text-sm md:text-base">Interactive Graph Algorithm Visualizer</div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <Controls
          onVisualize={visualizeAlgorithm}
          onClearPath={handleClearPath}
          onResetGrid={handleResetGrid}
          onAlgorithmChange={handleAlgorithmChange}
          onSpeedChange={handleSpeedChange}
          selectedAlgorithm={selectedAlgorithm}
          speed={speed}
          isVisualizing={isVisualizing}
          isPathFound={isPathFound}
          metrics={metrics}
          onToggleHelp={() => setIsHelpOpen(true)}
        />
        
        <Legend />
        
        <Grid 
          grid={grid}
          mouseIsPressed={mouseIsPressed}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Map Navigation System &mdash; Visualizing graph algorithms in action</p>
        </div>
      </footer>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default App;