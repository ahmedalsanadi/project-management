<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Get a random project
        $project = Project::inRandomOrder()->first();

        // Get users with the role 'member'
        $memberUsers = User::where('role', 'member')->pluck('id');

        // Randomly select a status
        $status = $this->faker->randomElement(['pending', 'in_progress', 'completed']);

        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph,
            'project_id' => $project->id,
            'assigned_to' => $this->faker->randomElement($memberUsers),
            'deadline' => $this->faker->dateTimeBetween('now', '+1 month'),
            'status' => $status,
            'completed_at' => $status === 'completed' ? $this->faker->dateTimeBetween('-12 month', 'now') : null,
        ];
    }
}
