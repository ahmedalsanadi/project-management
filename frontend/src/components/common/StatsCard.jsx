import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const StatsCard = ({ stat }) => {
  return (
    <div
      className={`rounded-2xl ${stat.bgColor} p-6 transition-all duration-200 hover:shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`p-2 rounded-lg ${stat.iconColor} bg-white/80 dark:bg-gray-800`}
        >
          <stat.icon className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-1">
          {stat.positive ? (
            <ChevronUp className="w-4 h-4 text-green-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}
          >
            {stat.change}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {stat.title}
        </h3>
        <p className={`text-3xl font-bold ${stat.valueColor} mt-2`}>
          {stat.value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;
