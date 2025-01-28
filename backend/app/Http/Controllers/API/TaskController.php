<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks (Admin sees all tasks, Member sees their assigned tasks).
     */
    public function index(Request $request)
    {
        if ($request->user()->role === 'admin') {
            $tasks = Task::with(['project', 'assignedUser'])->get();
        } else {
            $tasks = Task::with('project')->where('assigned_to', $request->user()->id)->get();
        }

        return response()->json([
            'message' => 'Tasks retrieved successfully',
            'data' => $tasks,
        ], 200);
    }

    /**
     * Store a newly created task (Only Admins can create tasks).
     */
    public function store(Request $request)
    {

        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'deadline' => 'nullable|date',
        ];

        // Validate request
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),

            ], 422);
        }



        // Create Task
        $task = Task::create($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Task created successfully',
            'data' => $task,
        ], 201);
    }

    /**
     * Display a specific task.
     */
    public function show(string $id, Request $request)
    {
        $task = Task::with(['project', 'assignedUser'])->find($id);

        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        if ($request->user()->role !== 'admin' && $task->assigned_to !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'message' => 'Task retrieved successfully',
            'data' => $task,
        ], 200);
    }

    /**
     * Update a task (Only Admins can update tasks).
     */
    public function update(Request $request, string $id)
    {

        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found',
            ], 404);
        }


        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'assigned_to' => 'required|exists:users,id',
            'deadline' => 'nullable|date',
            'status' => 'required|string|in:pending,in_progress,completed',
        ];

        // validate the request
        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }


        $task->update($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Task updated successfully',
            'data' => $task,
        ], 200);
    }

    /**
     * Remove a task (Only Admins can delete tasks).
     */
    public function destroy(string $id)
    {
        // Find the task by ID
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                'status' => 'error',
                'message' => 'Task not found',
            ], 404);
        }

        // Delete task
        $task->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Task deleted successfully',
        ], 200);
    }

}
