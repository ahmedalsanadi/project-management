// frontend/src/app/dashboard/page.jsx
"use client";
import React from 'react';
import { useDashboardStatistics } from '@/hooks/useDashboardStatistics';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Briefcase, CheckCircle2, AlertCircle,
  Clock, ChevronUp, ChevronDown, Activity,
  Calendar, BarChart2, PieChart as PieChartIcon
} from 'lucide-react';

const Dashboard = () => {
  const { data, isLoading } = useDashboardStatistics();

  const gradientOffset = () => {
    if (!data?.monthlyTrend) return 0;
    const dataMax = Math.max(...data.monthlyTrend.map(item => item.count));
    const dataMin = Math.min(...data.monthlyTrend.map(item => item.count));
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    return dataMax / (dataMax - dataMin);
  };

  const statsCards = [
    {
      title: 'Total Projects',
      value: data?.totalProjects || 0,
      icon: Briefcase,
      change: '+12%',
      positive: true,
      bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'Active Tasks',
      value: data?.taskStatus?.in_progress || 0,
      icon: Activity,
      change: '-5%',
      positive: false,
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Completed Tasks',
      value: data?.taskStatus?.completed || 0,
      icon: CheckCircle2,
      change: '+18%',
      positive: true,
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Pending Tasks',
      value: data?.taskStatus?.pending || 0,
      icon: Clock,
      change: '-3%',
      positive: false,
      bgColor: 'bg-amber-50 dark:bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
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
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl ${stat.bgColor} p-6 transition-all duration-200 hover:shadow-lg`}
            >
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-lg ${stat.iconColor} bg-white/80 dark:bg-gray-800`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.positive ? (
                    <ChevronUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
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
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Completion Trend */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Task Completion Trend
              </h3>
              <BarChart2 className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.monthlyTrend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Task Status Distribution
              </h3>
              <PieChartIcon className="w-5 h-5 text-gray-500" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: data?.taskStatus?.completed || 0 },
                      { name: 'In Progress', value: data?.taskStatus?.in_progress || 0 },
                      { name: 'Pending', value: data?.taskStatus?.pending || 0 }
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Deadlines
            </h3>
            <Calendar className="w-5 h-5 text-gray-500" />
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.upcomingTasks?.slice(0, 5).map((task) => (
              <div key={task.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {task.project.name}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(task.deadline).toLocaleDateString()}
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