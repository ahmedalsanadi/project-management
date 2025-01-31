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
            'totalTasks' => $this->getTaskCount($isAdmin, $user),
            'taskStatus' => $this->getTaskStatusCounts($isAdmin, $user),
            'upcomingTasks' => $this->getUpcomingTasks($isAdmin, $user),
            'monthlyTrend' => $this->getMonthlyTrend($isAdmin, $user),
            'completedTasksThisMonth' => $this->getCompletedTasksThisMonth($isAdmin, $user),
            'dailyCompletions' => $this->getDailyCompletions($isAdmin, $user),
        ];

        // Include totalProjects only for admins
        if ($isAdmin) {
            $statistics['totalProjects'] = $this->getProjectCount($isAdmin, $user);
        }

        // Admin-only statistics (directly included in the main response)
        if ($isAdmin) {
            $statistics = array_merge($statistics, $this->getAdminStatistics());
        }

        return response()->json($statistics);
    }

    private function getProjectCount($isAdmin, $user)
    {
        return Project::count(); // Only admins can access this, so no need for additional checks
    }

    private function getTaskCount($isAdmin, $user)
    {
        if ($isAdmin) {
            return Task::count();
        } else {
            return Task::where('assigned_to', $user->id)->count();
        }
    }

    private function getTaskStatusCounts($isAdmin, $user)
    {
        if ($isAdmin) {
            return Task::select('status', \DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get()
                ->keyBy('status');
        } else {
            return Task::where('assigned_to', $user->id)
                ->select('status', \DB::raw('COUNT(*) as count'))
                ->groupBy('status')
                ->get()
                ->keyBy('status');
        }
    }

    private function getUpcomingTasks($isAdmin, $user)
    {
        return Task::when(!$isAdmin, fn($q) => $q->where('assigned_to', $user->id))
            ->whereBetween('deadline', [Carbon::now(), Carbon::now()->addWeek()])
            ->with(['project:id,name'])
            ->get();
    }

    private function getMonthlyTrend($isAdmin, $user)
    {
        if ($isAdmin) {
            $completedTasks = Task::where('status', 'completed')
                ->whereYear('updated_at', Carbon::now()->year)
                ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
                ->groupBy('month')
                ->get()
                ->keyBy('month');
        } else {
            $completedTasks = Task::where('assigned_to', $user->id)
                ->where('status', 'completed')
                ->whereYear('updated_at', Carbon::now()->year)
                ->selectRaw('MONTH(updated_at) as month, COUNT(*) as count')
                ->groupBy('month')
                ->get()
                ->keyBy('month');
        }

        // Generate data for all 12 months
        $monthlyTrend = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthlyTrend[] = [
                'month' => $month,
                'count' => $completedTasks->has($month) ? $completedTasks[$month]->count : 0,
            ];
        }

        return $monthlyTrend;
    }

    private function getCompletedTasksThisMonth($isAdmin, $user)
    {
        if ($isAdmin) {
            return Task::whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->count();
        } else {
            return Task::where('assigned_to', $user->id)
                ->whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->count();
        }
    }

    private function getDailyCompletions($isAdmin, $user)
    {
        if ($isAdmin) {
            return Task::whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->selectRaw('DAY(completed_at) as day, COUNT(*) as count')
                ->groupBy('day')
                ->get()
                ->keyBy('day');
        } else {
            return Task::where('assigned_to', $user->id)
                ->whereMonth('completed_at', now()->month)
                ->whereYear('completed_at', now()->year)
                ->selectRaw('DAY(completed_at) as day, COUNT(*) as count')
                ->groupBy('day')
                ->get()
                ->keyBy('day');
        }
    }

    private function getAdminStatistics()
    {
        return [
            'totalUsers' => User::count(),
            'usersByRole' => [
                'admin' => User::where('role', 'admin')->count(),
                'member' => User::where('role', 'member')->count(),
            ],
            'recentUsers' => User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
            'projects' => Project::withCount([
                'tasks',
                'tasks as completed_tasks' => fn($q) => $q->where('status', 'completed')
            ])->get()->map(fn($project) => [
                'id' => $project->id,
                'name' => $project->name,
                'tasks_count' => $project->tasks_count,
                'description' => $project->description,
                'progress' => $project->tasks_count ?
                    round(($project->completed_tasks / $project->tasks_count) * 100) : 0
            ])->take(6),
        ];
    }
}
