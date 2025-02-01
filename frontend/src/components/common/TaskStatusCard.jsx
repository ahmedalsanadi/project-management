import ProgressBar from "./ProgressBar";

const TaskStatusCard = ({ status, count, totalTasks }) => {
    const progress = (count / totalTasks) * 100;
  
    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
            {status.replace('_', ' ')}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {count}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
          <div
            className={`h-full rounded-full ${
              status === 'completed'
                ? 'bg-green-500'
                : status === 'in_progress'
                ? 'bg-blue-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

export default TaskStatusCard;
