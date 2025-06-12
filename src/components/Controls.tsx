import React from 'react';
import { Algorithm } from '../types';
import { Play, Pause, SkipForward, Trash2, ChevronDown, HelpCircle, BarChart2 } from 'lucide-react';

interface ControlsProps {
  onVisualize: () => void;
  onClearPath: () => void;
  onResetGrid: () => void;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onSpeedChange: (speed: number) => void;
  selectedAlgorithm: Algorithm;
  speed: number;
  isVisualizing: boolean;
  isPathFound: boolean;
  metrics: { time: number; nodesVisited: number } | null;
  onToggleHelp: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onVisualize,
  onClearPath,
  onResetGrid,
  onAlgorithmChange,
  onSpeedChange,
  selectedAlgorithm,
  speed,
  isVisualizing,
  isPathFound,
  metrics,
  onToggleHelp,
}) => {
  return (
    <div className="w-full bg-white shadow-md p-4 rounded-lg mb-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 transition-colors"
              value={selectedAlgorithm}
              onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
              disabled={isVisualizing}
            >
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="astar">A* Algorithm</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="relative">
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500 transition-colors"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              disabled={isVisualizing}
            >
              <option value={10}>Slow</option>
              <option value={20}>Medium</option>
              <option value={40}>Fast</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onVisualize}
            disabled={isVisualizing}
          >
            {isVisualizing ? <Pause size={16} /> : <Play size={16} />}
            {isVisualizing ? 'Visualizing...' : 'Visualize'}
          </button>
          
          <button
            className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClearPath}
            disabled={isVisualizing}
          >
            <SkipForward size={16} />
            Clear Path
          </button>
          
          <button
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onResetGrid}
            disabled={isVisualizing}
          >
            <Trash2 size={16} />
            Reset Grid
          </button>
          
          <button
            className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
            onClick={onToggleHelp}
          >
            <HelpCircle size={16} />
            Help
          </button>
        </div>
      </div>
      
      {isPathFound && metrics && (
        <div className="mt-3 p-3 bg-gray-100 rounded-md flex items-center gap-4">
          <BarChart2 className="text-blue-500" size={20} />
          <div className="flex gap-6">
            <div>
              <span className="font-semibold">Algorithm: </span>
              <span className="text-blue-600">
                {selectedAlgorithm === 'dijkstra' ? "Dijkstra's" : "A*"}
              </span>
            </div>
            <div>
              <span className="font-semibold">Time: </span>
              <span className="text-blue-600">{metrics.time.toFixed(2)} ms</span>
            </div>
            <div>
              <span className="font-semibold">Nodes Visited: </span>
              <span className="text-blue-600">{metrics.nodesVisited}</span>
            </div>
            <div>
              <span className="font-semibold">Path Length: </span>
              <span className="text-blue-600">
                {isPathFound ? (metrics.nodesVisited > 0 ? metrics.nodesVisited - 1 : 'No path') : '-'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;