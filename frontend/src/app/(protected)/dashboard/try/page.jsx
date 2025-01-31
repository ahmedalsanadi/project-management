'use client';
import React from 'react';
import { useDashboardStatistics } from '@/hooks/useDashboardStatistics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Briefcase,
  CheckCircle2,
  Activity,
  Calendar,
  BarChart2,
  PieChart as PieChartIcon,
  CheckSquare,
  ClipboardList,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import Card from '@/components/common/Card';
import { Spinner } from '@/components/common/Spinner';
import { Header } from '@/components/common/Header';
import TaskStatusCard from '@/components/common/TaskStatusCard';
import ProgressBar from '@/components/common/ProgressBar';
import StatsCard from '@/components/common/StatsCard';
import TaskStatusDistributionChart from '@/components/charts/TaskStatusDistributionChart';
import MonthlyTaskCompletionChart from '@/components/charts/MonthlyTaskCompletionChart';
import OverviewLayout from '@/components/layouts/OverviewLayout';

const MemberHomePage = () => {
  const { data, isLoading } = useDashboardStatistics();
  if (isLoading) {
    return <Spinner />;
  }

  // Stats Cards
  const statsCards = [
    {
      title: 'Assigned Tasks',
      value: data?.totalTasks || 0,
      icon: ClipboardList,
      change: '+12%',
      positive: true,
      bgColor: 'bg-white dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'In Progress Tasks',
      value: data?.taskStatus?.in_progress?.count || 0,
      icon: Activity,
      change: '+5%',
      positive: true,
      bgColor: 'bg-white dark:bg-indigo-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Completed Tasks',
      value: data?.taskStatus?.completed?.count || 0,
      icon: CheckCircle2,
      change: '+18%',
      positive: true,
      bgColor: 'bg-white dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  // Task Status Distribution for Pie Chart
  const taskStatusDistribution = [
    { name: 'Completed', value: data?.taskStatus?.completed?.count || 0 },
    { name: 'In Progress', value: data?.taskStatus?.in_progress?.count || 0 },
    { name: 'Pending', value: data?.taskStatus?.pending?.count || 0 },
  ];

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B']; // Green, Blue, Yellow

  return (
    <OverviewLayout
      header="My Tasks Overview"
      subHeader="Welcome back! Here's an update on your assigned tasks and progress."
      statsCards={statsCards}
      taskStatusData={data?.taskStatus}
      monthlyTrend={data?.monthlyTrend}
      taskStatusDistribution={taskStatusDistribution}
      totalTasks={data?.totalTasks}
      gridColumns={3} // 3 columns for Member
    >
      {/* Member-specific content */}

      {/* Upcoming Tasks */}
      <Card title="Upcoming Tasks" icon={Calendar}>
        <div className="space-y-4">
          {data?.upcomingTasks?.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {task.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {task.description.split(' ').slice(0, 10).join(' ')}...
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Due: {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </OverviewLayout>
  );
};

export default MemberHomePage;