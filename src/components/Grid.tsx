import React from 'react';
import GridNode from './GridNode';
import { Node } from '../types';

interface GridProps {
  grid: Node[][];
  mouseIsPressed: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Grid: React.FC<GridProps> = ({
  grid,
  mouseIsPressed,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  return (
    <div className="max-w-full overflow-auto p-4 flex justify-center items-center">
      <div
        className="grid gap-1 border-2 border-gray-200 bg-white p-4 rounded-lg shadow"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
        }}
      >
        {grid.map((row, rowIdx) => (
          <React.Fragment key={rowIdx}>
            {row.map((node, nodeIdx) => (
              <GridNode
                key={`${rowIdx}-${nodeIdx}`}
                node={node}
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseUp={onMouseUp}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Grid;
