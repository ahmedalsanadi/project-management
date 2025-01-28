<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{

    public function index()
    {
        $projects = Project::all();

        return response()->json([
            'status' => 'success',
            'message' => 'Projects retrieved successfully',
            'data' => $projects,
        ], 200);
    }

    public function store(Request $request)
    {

        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ];


        $validator = Validator::make($request->all(), $rules);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }


        $project = Project::create([
            'name' => $validator->validated()['name'],
            'description' => $validator->validated()['description'],
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);
    }


    public function show($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Project retrieved successfully',
            'data' => $project,
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
            ], 404);
        }


        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ];


        $validator = Validator::make($request->all(), $rules);


        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }


        $project->update($validator->validated());

        return response()->json([
            'status' => 'success',
            'message' => 'Project updated successfully',
            'data' => $project,
        ], 200);
    }


    public function destroy($id)
    {

        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
            ], 404);
        }


        $project->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Project deleted successfully',
        ], 200);
    }
}
