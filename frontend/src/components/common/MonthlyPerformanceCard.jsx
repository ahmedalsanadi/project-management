import React from 'react';
import Card from '@/components/common/Card';
import { Activity } from 'lucide-react';

const MonthlyPerformanceCard = ({ completedTasksThisMonth, totalTasks }) => {
  const progress = Math.min(
    ((completedTasksThisMonth || 0) / (totalTasks || 1)) * 100,
    100
  );

  return (
    <Card title="Monthly Performance" icon={Activity}>
      <div className="space-y-6">
        {/* This Month's Completion */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              Tasks Completed This Month
            </span>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {completedTasksThisMonth || 0}
            </span>
          </div>
          <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded-full">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MonthlyPerformanceCard;
