<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'role' => 'admin',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),

            ],
            [
                'name' => 'Member',
                'email' => 'member@example.com',
                'role' => 'member',
                'password' => Hash::make('123456'),
                'email_verified_at' => now(),

            ],
        ];

        foreach ($users as $user) {
            User::factory()->create($user);
        }

        User::factory(10)->create([
            'role' => 'member',
        ]);

    }
}
