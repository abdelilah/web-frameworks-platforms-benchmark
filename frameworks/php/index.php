<?php

$servername = "host.docker.internal";
$username = getenv('MYSQL_USER');
$password = getenv('MYSQL_ROOT_PASSWORD');
$database = getenv('MYSQL_DATABASE');
$port = getenv('MYSQL_PORT');

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$database", $username, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$uri = $_SERVER['REQUEST_URI'];

if ($uri === '/') {
    echo 'Ready';
} elseif ($uri === '/info') {
    header('Content-Type: application/json');

    echo json_encode([
        'version' => phpversion(),
    ]);
} elseif ($uri === '/db') {
    header('Content-Type: application/json');

    $customers = $pdo->query('SELECT * FROM customers')->fetchAll();
    echo json_encode($customers);
} else {
    http_response_code(404);
    echo 'Not Found';
}
