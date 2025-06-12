import React from 'react';
import { Node } from '../types';
import { MapPin } from 'lucide-react';

interface GridNodeProps {
  node: Node;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const GridNode: React.FC<GridNodeProps> = ({ 
  node, 
  onMouseDown, 
  onMouseEnter, 
  onMouseUp 
}) => {
  const { row, col, type, cityName, isLandmark } = node;

  const getNodeClassNames = (): string => {
    const baseClasses = "w-6 h-6 border border-gray-200 transition-all duration-200 ease-in-out flex items-center justify-center relative group";

    switch (type) {
      case 'start':
        return `${baseClasses} bg-green-500 shadow`;
      case 'end':
        return `${baseClasses} bg-red-500 shadow`;
      case 'wall':
        return `${baseClasses} bg-gray-800`;
      case 'visited':
        return `${baseClasses} bg-blue-300 animate-pulse`;
      case 'path':
        return `${baseClasses} bg-yellow-300`;
      case 'city':
        return `${baseClasses} ${isLandmark ? 'bg-purple-100' : 'bg-blue-50'}`;
      default:
        return `${baseClasses} bg-white`;
    }
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={getNodeClassNames()}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      aria-label={`${type} node at row ${row}, column ${col}`}
    >
      {cityName && (
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin 
            size={10}
            className={`${
              type === 'start' || type === 'end'
                ? 'text-white'
                : isLandmark
                  ? 'text-purple-600'
                  : 'text-blue-600'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default GridNode;
