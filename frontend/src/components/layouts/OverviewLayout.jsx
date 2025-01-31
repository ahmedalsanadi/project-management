import { BarChart2, CheckSquare, PieChartIcon } from 'lucide-react';
import TaskStatusDistributionChart from '../charts/TaskStatusDistributionChart';
import Card from '../common/Card';
import { Header } from '../common/Header';
import StatsCard from '../common/StatsCard';
import TaskStatusCard from '../common/TaskStatusCard';
import MonthlyTaskCompletionChart from '../charts/MonthlyTaskCompletionChart';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B']; // Green, Blue, Yellow

const OverviewLayout = ({
  header,
  subHeader,
  statsCards,
  taskStatusData,
  monthlyTrend,
  taskStatusDistribution,
  totalTasks, 
  gridColumns = 3,
  children,
}) => {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Header header={header} subHeader={subHeader} />
          <div className="flex items-center space-x-4">
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}

        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns} gap-6`}>
          {statsCards.map((stat, index) => (
            <StatsCard key={index} stat={stat} />
          ))}
        </div>

        {/* Task Status Progress */}
        <Card title="Task Status Overview" icon={CheckSquare}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(taskStatusData || {}).map(([status, info]) => (
              <TaskStatusCard
                key={status}
                status={status}
                count={info.count}
                totalTasks={totalTasks}
              />
          
            ))}
          </div>
        </Card>

        


        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Monthly Task Completion" icon={BarChart2}>
            <div className="h-80">
              <MonthlyTaskCompletionChart data={monthlyTrend} />
            </div>
          </Card>

          <Card title="Task Status Distribution" icon={PieChartIcon}>
            <div className="h-80">
              <TaskStatusDistributionChart data={taskStatusDistribution} />
              <div className="flex justify-center gap-4 mt-4">
                {taskStatusDistribution.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Content */}
        {children}
      </div>
    </div>
  );
};

export default OverviewLayout;
