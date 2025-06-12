import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">How to Use the Map Navigation System</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Map Interaction</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Click on an empty node to create a wall</li>
                <li>Click on a wall to remove it</li>
                <li>Click and drag to create multiple walls quickly</li>
                <li>The green node is your starting point</li>
                <li>The red node is your destination</li>
                <li>You can drag and drop the start and end nodes to new positions</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Algorithms</h3>
              
              <div className="mb-4">
                <h4 className="text-lg font-medium text-gray-800">Dijkstra's Algorithm</h4>
                <p className="text-gray-700 mt-1">
                  Dijkstra's algorithm guarantees the shortest path by exploring nodes in order of their distance from the start. It expands in all directions uniformly, making it slower but ensuring an optimal solution.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-800">A* Algorithm</h4>
                <p className="text-gray-700 mt-1">
                  A* uses a heuristic (in this case, Manhattan distance) to guide its search toward the destination. It's generally faster than Dijkstra's but still guarantees the shortest path in grid-based maps like this one.
                </p>
              </div>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Controls</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium">Visualize</span>: Start the pathfinding visualization</li>
                <li><span className="font-medium">Clear Path</span>: Remove the visualized path but keep walls and start/end nodes</li>
                <li><span className="font-medium">Reset Grid</span>: Clear everything and start fresh</li>
                <li><span className="font-medium">Speed</span>: Adjust how quickly the algorithm visualization runs</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Understanding the Visualization</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><span className="font-medium text-blue-300">Blue nodes</span> represent areas the algorithm has explored</li>
                <li><span className="font-medium text-yellow-300">Yellow nodes</span> show the final shortest path</li>
                <li>The metrics panel shows performance data after completion</li>
                <li>Compare algorithms to see how they perform differently on the same map</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-xl font-semibold text-blue-600 mb-2">About Graph Algorithms</h3>
              <p className="text-gray-700">
                Pathfinding algorithms work by treating the map as a graph, where each node (cell) connects to its neighbors. These algorithms use various strategies to efficiently find paths through this graph structure. The visualization demonstrates how these algorithms explore the graph to find the optimal solution.
              </p>
            </section>
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;