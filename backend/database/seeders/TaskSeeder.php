<?php

namespace Database\Seeders;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all projects
        $projects = Project::all();

        // For each project, create 10 tasks
        $projects->each(function ($project) {
            Task::factory()->count(10)->create([
                'project_id' => $project->id,
            ]);
        });
    }
}
