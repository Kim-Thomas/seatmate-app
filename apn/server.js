var http = require('http');
var fs = require('fs');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('seatmate', 'seatmate', 'nGhTHF7SNCXR8qL9');

var User = sequelize.define('user', {
    mail: Sequelize.STRING,
    pseudo: Sequelize.STRING
});

var Message = sequelize.define('message', {
    content: Sequelize.STRING,
    date_created: Sequelize.DATE,
    user_id_s: Sequelize.INTEGER,
    user_id_d: Sequelize.INTEGER
}, {
    timestamps: false
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
    
    var currentUser = null;
    var currentSearchFlight = null;
    
    console.log('Un client est connecté !');
    socket.emit('message', 'Vous êtes bien connecté !');
    
    /**
     * Request SQL
     * TEST
     *
    User.findAll({ attributes: ['id', 'mail', 'pseudo']}).then(function(users) {
        for (var i=0; i<users.length; i++) {
            console.log(users[i].dataValues);
        }
    });*/

    // Quand le serveur reçoit un signal de type "message" du client    
    socket.on('message', function (message) {
        if (currentUser == null) { socket.emit('logout'); console.log('error: log necessary'); return; }
        console.log('Un client me parle ! Il me dit : ');
        Message.create({content: message.content, user_id_d: message.user_id_d, user_id_s: message.user_id_s}).then(function (message_created) {
            console.log(message_created.dataValues);
            socket.emit('message', message_created.dataValues);
            for (var i=0; i<users.length; i++) {
                if (users[i].id == message.user_id_d) {
                    console.log("Trouvé!");
                    users[i].socket.emit('message', message_created.dataValues);
                    break;
                }
            }
        });
    });	
    
    socket.on('searchFlight', function (flight) {
        if (currentUser == null) { socket.emit('logout'); console.log('error: log necessary'); return; }
        var isFind = false;
        currentSearchFlight = flight;
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
    
    socket.on('formSearchFlight', function () {
        if (currentUser == null) { socket.emit('logout'); console.log('error: log necessary'); return; }
        socket.emit('formSearchFlight', currentSearchFlight);
    });
    
    socket.on('login', function (token) {
        User.findOne({ attributes: ['id', 'mail', 'pseudo'], where: {'token': token}}).then(function(user) {
            currentUser = user.dataValues;
            currentUser.flights = [];
            currentUser.socket = socket;
            users.push(currentUser);
            socket.emit('loginSuccess');
        }, function(err) {
            console.log(err);
        });
    });
    
    socket.on('logout', function () {
        delete users[users.indexOf(currentUser)];
        delete currentUser; 
    });
});

server.listen(1337);
