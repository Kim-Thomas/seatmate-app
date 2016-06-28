myApp.controller('RootCtrl', ['$rootScope', '$scope', '$cookies', 'AuthService', function ($rootScope, $scope, $cookies, AuthService) {
    $rootScope.loading = false;
    
    $rootScope.auth = AuthService;
    
    socket.on('newMate', function (user) {
        console.log(user);
    });
    
    socket.on('loginSuccess', function () {
        console.log('chat_online'); 
        $rootScope.$apply(function() {
            $rootScope.auth.isOnline = true;
        });
    });
    
    socket.on('logout', function () {
        console.log('chat_offline');
        if (typeof $cookies.token != 'undefined') {
            socket.emit('login', $cookies.token); 
        }
    });
    
    socket.on('disconnect', function () {
        console.log('chat_disconnect'); 
        $rootScope.$apply(function() {
            $rootScope.auth.isOnline = false; 
        });
    });
}])

.controller('IndexCtrl', ['$scope', '$timeout', '$rootScope', '$state', '$cookies', function ($scope, $timeout, $rootScope, $state, $cookies) {
    $scope.formSearch = {
        nbOfFlight: '',
        nbOfSeat: '',
        date: ''
    };
    
    $scope.searchFlight = function (form) {
        // Init message
        $scope.message = '';
        
        if (form.nbOfFlight.length>1
        && form.nbOfSeat.length>1
        && form.date.length==5) {
        
            $scope.loading = true;
            
            // Envoi de l'info de la recherche
            socket.emit('searchFlight', form);
            
            $timeout(function () {
                $scope.loading = false;
                $rootScope.formSearch = form;
                $cookies.nbOfFlight = form.nbOfFlight;
                $cookies.nbOfSeat = form.nbOfSeat;
                $cookies.date = form.date;
                $state.go('step1');
                /*$scope.message = "Flight not found.";
                console.log(form);
                $timeout(function () {
                    delete $scope.message;
                }, 1500);*/
            }, 700);
        } 
        else {
            $scope.message = "Remplissez correctement le formulaire";
        }
    };
}])
.controller('SignInCtrl', ['$scope', '$rootScope', '$http', '$cookies', '$state', '$timeout', 'UserService', 'AuthService', function ($scope, $rootScope, $http, $cookies, $state, $timeout, UserService, AuthService) {
    $scope.formConnexion = {
        mail: 'test@test.com',
        password: 'azerty'
    };
    
    $scope.doLogin = function (form) {
        $scope.loading = true;
        
        UserService.login(form.mail, form.password).then(function (user) {
            $rootScope.user = user; 
            $scope.message = 'Connexion avec succès, redirection dans 3s...';
            AuthService.isLogged = true;
            socket.emit('login', $cookies.token);
            $timeout(function () {
                $state.go('index');
            }, 3000);
        }, function () {
            $scope.message = 'Erreur de login';
        }).finally(function () {
            $scope.loading = false;
        });
    };
}])
.controller('Step1Ctrl', ['$scope', '$rootScope', '$state', '$cookies', function ($scope, $rootScope, $state, $cookies) {
    
    /**
     * Je récupère les data de recherche
     */
    if (typeof $rootScope.formSearch != 'undefined') {
        $scope.formSearch = $rootScope.formSearch;
    }
    else if (typeof $cookies.nbOfFlight != 'undefined' &&
    typeof $cookies.nbOfSeat != 'undefined' &&
    typeof $cookies.date != 'undefined') {
        $scope.formSearch = $rootScope.formSearch;
        $scope.formSearch = {
            nbOfFlight: $cookies.nbOfFlight,
            nbOfSeat: $cookies.nbOfSeat,
            date: $cookies.date
        };
    }
    else {
        $state.go('index');
    }
}]);

myApp.factory('AuthService', [function () {
    return {
        'isLogged': false,
        'isOnline': false
    }
}])
    .factory('UserService', ['$http', '$q', '$cookies', 'AuthService', function ($http, $q, $cookies, AuthService) {
        
    return {
        getProfile: function () {
            //$http.get(API_URL + '/v1/secure/signin');
        },
        login: function (mail, password) {
            defered = $q.defer();
            $http.post(API_URL + '/v1/secure/signin', 
                {mail: mail, password: password}
            ).success(function (data) { 
                $cookies.token = data.token;
                AuthService.isLogged = true;
                defered.resolve(data.user);
            }).error(function () {
                defered.reject();    
            });
            return defered.promise;
        },
        checkToken: function (token) {
            defered = $q.defer();
            $http.post(API_URL + '/v1/secure/token/check', 
                {token: token}
            ).success(function (user) {
                AuthService.isLogged = true; 
                defered.resolve(user);
            }).error(function () {
                AuthService.isLogged = false;
                defered.reject();    
            });
            return defered.promise;
        }
    };
}]);