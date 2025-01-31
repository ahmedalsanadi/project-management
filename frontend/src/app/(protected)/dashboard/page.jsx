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
  Users,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Calendar,
  BarChart2,
  PieChart as PieChartIcon,
  UserPlus,
  CheckSquare,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import StatsCardGrid from '@/components/common/StatsCardGrid';
import ChartCard from '@/components/common/ChartCard';
import Card from '@/components/common/Card';

const Dashboard = () => {
  const { data, isLoading } = useDashboardStatistics();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back! Here's what's happening with your projects today.
            </p>
          </div>
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
        <StatsCardGrid statsCards={statsCards} />

        {/* Task Status Progress */}
        <Card title="Task Status Overview" icon={CheckSquare}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(data?.taskStatus || {}).map(([status, info]) => (
              <div
                key={status}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
                    {status.replace('_', ' ')}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {info.count}
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
                    style={{
                      width: `${(info.count / data.totalTasks) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Task Completion (BarChart) */}
          <Card title="Monthly Task Completion" icon={BarChart2}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data?.monthlyTrend}
                 
                >
                  <CartesianGrid strokeDasharray="1 1" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280' }}
                    
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                    tickFormatter={(month) => {
                      const monthNames = [
                        'Jan',
                        '2',
                        '3',
                        '4',
                        '5',
                        'Jun',
                        '7',
                        '8',
                        '9',
                        '10',
                        '11',
                        'Dec',
                      ];
                      return monthNames[month - 1]; // Convert month number to name
                    }}
                  />
                  <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Task Status Distribution (PieChart) */}
          <Card title="Task Status Distribution" icon={PieChart}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Completed',
                        value: data?.taskStatus?.completed.count || 0,
                      },
                      {
                        name: 'In Progress',
                        value: data?.taskStatus?.in_progress.count || 0,
                      },
                      {
                        name: 'Pending',
                        value: data?.taskStatus?.pending.count || 0,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#3B82F6" />
                    <Cell fill="#F59E0B" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2 "
                    style={{ backgroundColor: '#10B981' }}
                  ></div>
                  <div className="gird grid-cols-2 md:grid-cols-4 text-sm  text-gray-600 dark:text-gray-400">
                    <span>completed</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2 "
                    style={{ backgroundColor: '#3B82F6' }}
                  ></div>
                  <div className="gird grid-cols-2 md:grid-cols-4 text-sm  text-gray-600 dark:text-gray-400">
                    <span>in progress</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2 "
                    style={{ backgroundColor: '#F59E0B' }}
                  ></div>
                  <div className="gird grid-cols-2 md:grid-cols-4 text-sm  text-gray-600 dark:text-gray-400">
                    <span>pending</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          

          {/* Daily Task Completion Timeline */}
          {/* <Card title="Daily Task Completions" icon={Calendar}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(data?.dailyCompletions || {}).map(
                    ([day, data]) => ({
                      day: parseInt(day),
                      count: data.count,
                    })
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card> */}

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
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Roles
                </h3>
                <Users className="w-5 h-5 text-gray-500" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Admins
                  </span>
                  <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                    {data?.usersByRole?.admin || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Members
                  </span>
                  <span className="px-3 py-1 text-sm font-medium bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full">
                    {data?.usersByRole?.member || 0}
                  </span>
                </div>
              </div>
            </div>
        </div>

          {/* User Distribution (Admin Only) */}
          {isAdmin && (
            <Card title="Recent Users" icon={UserPlus}> 
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data?.recentUsers?.map((user) => (
                  <div
                    key={user.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
       
        )}



        {/* Upcoming Tasks */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Deadlines
            </h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.upcomingTasks?.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.project.name}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Projects Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Projects
            </h3>
            <Briefcase className="w-5 h-5 text-gray-500" />
          </div>

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

                  <div className="h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                    <div
                      className={`h-full rounded-full ${
                        project.progress <= 20
                          ? 'bg-red-500'
                          : project.progress <= 40
                            ? 'bg-orange-500'
                            : project.progress <= 60
                              ? 'bg-yellow-500'
                              : project.progress <= 80
                                ? 'bg-green-500'
                                : 'bg-emerald-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
