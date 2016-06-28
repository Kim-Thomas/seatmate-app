var http = require('http');
var fs = require('fs');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('seatmate', 'seatmate', 'nGhTHF7SNCXR8qL9');

var User = sequelize.define('user', {
    mail: Sequelize.STRING,
    pseudo: Sequelize.STRING
});

var users = [];

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    
    var currentUser = {};
    
    console.log('Un client est connecté !');
    socket.emit('message', 'Vous êtes bien connecté !');
    
    /**
     * Request SQL
     * TEST
     */
    User.findAll({ attributes: ['id', 'mail', 'pseudo']}).then(function(users) {
        for (var i=0; i<users.length; i++) {
            console.log(users[i].dataValues);
        }
    });

    // Quand le serveur reçoit un signal de type "message" du client    
    socket.on('message', function (message) {
        console.log('Un client me parle ! Il me dit : ' + message);
    });	
    
    socket.on('searchFlight', function (flight) {
        
        var isFind = false;
        for (var i=0; i<currentUser.flights.length; i++) {
            if (currentUser.flights[i].nbOfFlight == flight.nbOfFlight) {
                isFind = true;
                break;
            }
        }
        if (!isFind) {
            currentUser.flights.push(flight);
            socket.broadcast.emit('newMate', currentUser);
        }
        console.log(currentUser);
    });
    
    socket.on('login', function (user) {
        currentUser = user;
        currentUser.flights = [];
        console.log(currentUser);
        users.push(user);
    });
});

server.listen(1337);
