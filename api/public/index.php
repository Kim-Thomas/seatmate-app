<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../vendor/autoload.php';

//
// Functions 
//
// Autoload classes
spl_autoload_register(function ($classname) {
    require ("../classes/" . $classname . ".php");
});

//
// Config 
//

// Config base
//$config['displayErrorDetails'] = true;

// Config Database
$config['db']['host']   = "localhost";
$config['db']['user']   = "seatmate";
$config['db']['pass']   = "nGhTHF7SNCXR8qL9";
$config['db']['dbname'] = "seatmate";

$config['token']['secret'] = "teaezarfdlsjfkl21413DSQ14fezr231413Rfzr1343";

// Instantiate the App object
$app = new \Slim\App(["settings" => $config]);

// Def $container
$container = $app->getContainer();

// Init log
$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler("../logs/app.log");
    $logger->pushHandler($file_handler);
    return $logger;
};

// Init connexion SQL
$container['db'] = function ($c) {
    $db = $c['settings']['db'];
    $pdo = new PDO("mysql:host=" . $db['host'] . ";dbname=" . $db['dbname'],
        $db['user'], $db['pass']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    return $pdo;
};

// Check login
$tokenCheck = function ($request, $response, $next) {
    $mapper = new UserMapper($this->db);
    $header = $request->getHeaderLine("HTTP_AUTHORIZATION");
    $token = split(" ", $header)[1];
    $user = $mapper->findUserByToken($token);
    if (!$user) {
        return $response->withStatus(401)->write("bad access token");
    }
    else {
        $this->user = $user;
        $response = $next($request, $response);
        return $response;
    }
};

// Add route callbacks
$app->get('/routes', function ($request, $response, $args) {
    $routes = array("routes"=>[array("/"=>"hello"), array("/hello/{name}"=>"première route")]);
    return $response->withStatus(200)->write(var_export($routes, true));
});

// Add route callbacks
$app->get('/api', function ($request, $response, $args) {
    return $response->withStatus(200)->write('Bienvenue sur l\'api seatmate 0.0.1');
});

// Add route callbacks
$app->get('/api/users/{id}', function (Request $request, Response $response) {
    $route = $request->getAttribute('route');
    $mapper = new UserMapper($this->db);
    $user = $mapper->findUserById($route->getArgument('id'));
    return $response->withStatus(200)->withJson($user);
})->add($tokenCheck);


// Add route callbacks
$app->get('/api/users', function (Request $request, Response $response) {
    $mapper = new UserMapper($this->db);
    $users = $mapper->getUsers();
    return $response->withStatus(200)->withJson($users);
})->add($tokenCheck);

$app->post('/api/secure/signin', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user_data = [];
    $user_data['mail'] = $data['mail'];
    $user_data['password'] = sha1($data['password']);
    $user = new User($user_data);
    $mapper = new UserMapper($this->db);
    $user = $mapper->findUser($user);
   
    // Generate token
    $token = hash('sha256', $config['token']['secret'].$user->getMail().$user->getPassword().time().rand());
    
    // Save token
    $user->setToken($token);
    $user->setTokenDate(time());
    $mapper->save($user);
    
    return $response->withStatus(200)->withJson($token);
});

$app->post('/api/secure/signup', function (Request $request, Response $response) {
    $data = $request->getParsedBody();
    $user_data = [];
    $user_data['mail'] = $data['mail'];
    $user_data['password'] = sha1($data['password']);
    $user_data['pseudo'] = $data['pseudo'];
    $user_data['facebook_id'] = $data['facebook_id'];
    $user = new User($user_data);
    $mapper = new UserMapper($this->db);
    $mapper->createUser($user);
    return $response->withStatus(200)->withJson($user);
});

// Run application
$app->run();