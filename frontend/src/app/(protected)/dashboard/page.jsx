'use client';
import { useDashboardStatistics } from '@/hooks/useDashboardStatistics';
import { Spinner } from '@/components/common/Spinner';
import OverviewLayout from '@/components/layouts/OverviewLayout';
import {
  Users,
  Briefcase,
  CheckCircle2,
  Activity,
  UserPlus,

} from 'lucide-react';
import Card from '@/components/common/Card';
import { UserRoleCard } from '@/components/common/UserRoleCard';
import RecentUserCard from '@/components/common/RecentUserCard';
import ProgressBar from '@/components/common/ProgressBar';
import ProjectsOverview from '@/components/common/ProjectsOverview';

const Dashboard = () => {
  const { data, isLoading } = useDashboardStatistics();

  if (isLoading) {
    return <Spinner />;
  }

  // Stats Cards
  const statsCards = [
    {
      title: 'Total Projects',
      value: data?.totalProjects || 0,
      icon: Briefcase,
      change: '+12%',
      positive: true,
      bgColor: 'bg-white dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Tasks',
      value: data?.totalTasks || 0,
      icon: Activity,
      change: '+12%',
      positive: true,
      bgColor: 'bg-white dark:bg-indigo-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'In progress Tasks',
      value: data?.taskStatus?.in_progress?.count || 0,
      icon: Activity,
      change: '-5%',
      positive: false,
      bgColor: 'bg-white dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Completed Tasks',
      value: data?.taskStatus?.completed?.count || 0,
      icon: CheckCircle2,
      change: '+18%',
      positive: true,
      bgColor: 'bg-white dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  //   // Task Status Distribution for Pie Chart
  //   const taskStatusDistribution = [
  //     { name: 'Completed', value: data?.taskStatus?.completed?.count || 0 },
  //     { name: 'In Progress', value: data?.taskStatus?.in_progress?.count || 0 },
  //     { name: 'Pending', value: data?.taskStatus?.pending?.count || 0 },
  //   ];

  return (
    <OverviewLayout
      header="Dashboard Overview"
      subHeader="Welcome back! Here's what's happening with your projects today."
      statsCards={statsCards}
      taskStatusData={data?.taskStatus}
      monthlyTrend={data?.monthlyTrend}
      taskStatusDistribution={[
        { name: 'Completed', value: data?.taskStatus?.completed?.count || 0 },
        {
          name: 'In Progress',
          value: data?.taskStatus?.in_progress?.count || 0,
        },
        { name: 'Pending', value: data?.taskStatus?.pending?.count || 0 },
      ]}
      totalTasks={data?.totalTasks}
      gridColumns={4}
    >
      {/* Admin-specific content */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Overview */}
        <Card title="Monthly Performance" icon={Activity}>
          <div className="space-y-6">
            {/* This Month's Completion */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-700 dark:text-purple-300">
                  Tasks Completed This Month
                </span>
                <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {data?.completedTasksThisMonth || 0}
                </span>
              </div>
              <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded-full">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${Math.min(((data?.completedTasksThisMonth || 0) / (data?.totalTasks || 1)) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Role Distribution */}
        <Card title="User Roles" icon={Users}>
          <div className="space-y-4">
            <UserRoleCard role="Admins" count={data?.usersByRole?.admin || 0} />
            <UserRoleCard
              role="Members"
              count={data?.usersByRole?.member || 0}
            />
          </div>
        </Card>
      </div>

      <Card title="Recent Users" icon={UserPlus}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {data?.recentUsers?.map((user) => (
            <RecentUserCard key={user.id} user={user} />
          ))}
        </div>
      </Card>

      {/* Projects Overview */}
      <ProjectsOverview projects={data?.projects} />

    </OverviewLayout>
  );
};

export default Dashboard;
