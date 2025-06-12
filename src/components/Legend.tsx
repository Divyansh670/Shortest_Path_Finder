import React from 'react';
import { MapPin } from 'lucide-react';

const Legend: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-4 mt-2">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-green-500 border border-gray-300 flex items-center justify-center">
          <MapPin size={12} className="text-white" />
        </div>
        <span>Start City</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-red-500 border border-gray-300 flex items-center justify-center">
          <MapPin size={12} className="text-white" />
        </div>
        <span>Destination City</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-purple-100 border border-gray-300 flex items-center justify-center">
          <MapPin size={12} className="text-purple-600" />
        </div>
        <span>Major City</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-blue-50 border border-gray-300 flex items-center justify-center">
          <MapPin size={12} className="text-blue-600" />
        </div>
        <span>City</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-800 border border-gray-300"></div>
        <span>Blocked Route</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-blue-300 border border-gray-300"></div>
        <span>Explored Route</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-yellow-300 border border-gray-300"></div>
        <span>Shortest Route</span>
      </div>
    </div>
  );
};

export default Legend;