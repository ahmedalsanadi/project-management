<?php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'logout', 'user'], // Allow API routes
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'], // your Next.js URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
