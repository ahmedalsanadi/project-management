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

      <Card title="Projects Overview" icon={Briefcase}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.projects?.map((project) => (
            <div
              key={project.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </h4>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                  {project.tasks_count} Tasks
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {project.description.split(' ').slice(0, 6).join(' ')}...
              </p>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {project.progress}%
                  </span>
                </div>

                <ProgressBar
                  progress={project.progress}
                  color={
                    project.progress <= 20
                      ? 'bg-red-500'
                      : project.progress <= 40
                        ? 'bg-orange-500'
                        : project.progress <= 60
                          ? 'bg-yellow-500'
                          : project.progress <= 80
                            ? 'bg-green-500'
                            : 'bg-emerald-500'
                  }
                />

                <div className="pt-3">
                  <a
                    href={`/dashboard/projects/${project.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </OverviewLayout>
  );
};

export default Dashboard;
