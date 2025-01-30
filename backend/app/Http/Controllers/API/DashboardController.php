<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStatistics()
    {
        $user = auth()->user();
        $isAdmin = $user->role === 'admin';

        // Base statistics
        $statistics = [
            'totalProjects' => Project::when(!$isAdmin, fn($q) => $q->where('user_id', $user->id))->count(),
            'totalTasks' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))->count(),

            // Task status breakdown
            'taskStatus' => [
                'pending' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                    ->where('status', 'pending')->count(),
                'in_progress' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                    ->where('status', 'in_progress')->count(),
                'completed' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                    ->where('status', 'completed')->count(),
            ],

            // Tasks due this week
            'upcomingTasks' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                ->whereBetween('deadline', [Carbon::now(), Carbon::now()->addWeek()])
                ->with(['project:id,name'])
                ->get(),

            // Monthly task completion trend
            'monthlyTrend' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                ->where('status', 'completed')
                ->whereYear('updated_at', Carbon::now()->year)
                ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
                ->groupBy('month')
                ->get(),

            // Completed tasks this month
            'completedTasksThisMonth' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                ->whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->count(),

            // Daily completions
            'dailyCompletions' => Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
                ->whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->selectRaw('DATE(completed_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->get(),
        ];

        // Admin-only statistics
        if ($isAdmin) {
            $statistics['adminStats'] = [
                'totalUsers' => User::count(),
                'usersByRole' => [
                    'admin' => User::where('role', 'admin')->count(),
                    'member' => User::where('role', 'member')->count(),
                ],
                'recentUsers' => User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
                'projectProgress' => Project::withCount([
                    'tasks',
                    'tasks as completed_tasks' => fn($q) => $q->where('status', 'completed')
                ])->get()->map(fn($project) => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'progress' => $project->tasks_count ?
                        round(($project->completed_tasks / $project->tasks_count) * 100) : 0
                ]),
            ];
        }

        return response()->json($statistics);
    }
}
