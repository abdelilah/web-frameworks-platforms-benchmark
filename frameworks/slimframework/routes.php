<?php

declare(strict_types=1);

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;

$servername = "host.docker.internal";
$username = getenv('MYSQL_USER');
$password = getenv('MYSQL_ROOT_PASSWORD');
$database = getenv('MYSQL_DATABASE');
$port = getenv('MYSQL_PORT');

$pdo = null;

try {
    $pdo = new PDO("mysql:host=$servername;port=$port;dbname=$database", $username, $password);

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$uri = $_SERVER['REQUEST_URI'];

return function (App $app) {
    $app->options('/{routes:.*}', function (Request $request, Response $response) {
        // CORS Pre-Flight OPTIONS Request Handler
        return $response;
    });

    $app->get('/', function (Request $request, Response $response) {
        $response->getBody()->write('Ready');
        return $response;
    });

    $app->get('/db', function (Request $request, Response $response) {
        global $pdo;

        $customers = $pdo->query('SELECT * FROM customers')->fetchAll();
        $response->getBody()->write(json_encode($customers));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->get('/info', function (Request $request, Response $response) {
        $response->getBody()->write(json_encode([
            'version' => Slim\App::VERSION,
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });
};
