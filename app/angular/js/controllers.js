myApp.controller('RootCtrl', ['$rootScope', '$scope', '$cookies', 'AuthService', function ($rootScope, $scope, $cookies, AuthService) {
    $rootScope.loading = false;
    $rootScope.login = false;
    $rootScope.auth = AuthService;
    
    $rootScope.showLogin = function () {
        $rootScope.login = true;
    };
        
    $rootScope.hideLogin = function () {
        $rootScope.login = false;  
    };
    
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
    
    $scope.step = 1;
    
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
                $scope.step++;
            }, 700);
        } 
        else {
            $scope.message = "Remplissez correctement le formulaire";
        }
    };
    
    $scope.validInfo = function () {
        if ($rootScope.auth.isLogged) {
            $scope.step = 5;
        }
        else {
            $scope.step = 3;
        }
    };
    
    $scope.hasAccount = function (account) {
        $scope.account = account;
        $scope.step++;
        
        $scope.$on('USER_LOGGED', function () {
            $scope.step++;
        });
    };
}])
.controller('ChatCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'ChatService', 'UserService', function ($scope, $rootScope, $stateParams, $state, ChatService, UserService) {
    
        
    /**
     * Init var
     */
    $scope.messages = [];
    $scope.userDest;
    
    $scope.init = function () {
        
        if ($stateParams.id == $rootScope.user.id) $state.go('index');
        
        UserService.getProfile($stateParams.id).then(function (user) {
            
            $scope.userDest = user;
            
            ChatService.getMessages($stateParams.id).then(function (messages) {
                
                /**
                 * Save convers
                 */
                $scope.messages = messages;
            }, function (err) {
                console.log(err);
            });
            
            $scope.sendMessage = function (form) {
                if (form.content.length > 0) {
                    form.date_created = new Date();
                    socket.emit('message', form);
                    $scope.initForm();
                }
            };
            
            $scope.initForm = function () {
                $scope.formChat = {
                    content: '',
                    user_id_s: $rootScope.user.id,
                    user_id_d: $scope.userDest.id
                };
            };
            
            socket.on('message', function (message) {
                if (message.user_id_s == $stateParams.id
                || message.user_id_d == $stateParams.id) {
                    $scope.$apply(function () {
                        $scope.messages.push(message);
                    });
                }
            });
            
            $scope.initForm();
        }, function () {
            $state.go('index'); 
        });
        
    };
    
    if (typeof $rootScope.user != 'undefined') {
        $scope.init();
    }
    else {
        $scope.$on('USER_LOGGED', function () {
            $scope.init();
        });
    }
}]);

myApp.factory('AuthService', [function () {
    return {
        'isLogged': false,
        'isOnline': false
    }
}])
.factory('ChatService', ['$http', '$q', function ($http, $q) {
    return {
        getMessages: function (user_id) {
            var defered = $q.defer();
            $http.get(API_URL + '/v1/messages/' + user_id)
            .success(function (messages) {
                defered.resolve(messages);
            }).error(function (err) {
                defered.reject(err);
            });
            return defered.promise;
        }    
    };
}])
.factory('UserService', ['$http', '$q', '$cookies', 'AuthService', function ($http, $q, $cookies, AuthService) {
        
    return {
        getProfile: function (userId) {
            defered = $q.defer();
            $http.get(API_URL + '/v1/users/' + userId)
            .success(function (user) { 
                defered.resolve(user);
            }).error(function () {
                defered.reject();    
            });
            return defered.promise;
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
        register: function (mail, pseudo) {
            defered = $q.defer();
            $http.post(API_URL + '/v1/secure/signup', 
                {mail: mail, pseudo: pseudo, facebook_id: 0}
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
}])
.factory('TokenInterceptor', ['$q', '$cookies', 'AuthService', function ($q, $cookies, AuthService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if ($cookies.token) {
                    config.headers.Authorization = 'Bearer ' + $cookies.token;
                }
                return config;
            },

            requestError: function(rejection) {
                return $q.reject(rejection);
            },

            /* Set Authentication.isAuthenticated to true if 200 received */
            response: function (response) {
                if (response != null && response.status == 200 && $cookies.token && !AuthService.isLogged) {
                    AuthService.isLogged = true;
                }
                return response || $q.when(response);
            },

            /* Revoke client authentication if 401 is received */
            responseError: function(rejection) {
                if (rejection != null && rejection.status === 401 && ($cookies.token || AuthService.isLogged)) {
                    delete $cookies.token;
                    AuthService.isLogged = false;
                }

                return $q.reject(rejection);
            }
        };
    }])
.directive('signIn', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/sign-in.tpl.html',
    controller: ['$scope', '$rootScope', '$cookies', '$timeout', '$state', 'AuthService', 'UserService',
        function ($scope, $rootScope, $cookies, $timeout, $state, AuthService, UserService) {
        
        $scope.formConnexion = {
            mail: 'test@test.com',
            password: 'azerty'
        };
        
        $scope.doLogin = function (form) {
            // Loading
            $scope.loading = true;
            
            // Login api
            UserService.login(form.mail, form.password).then(function (user) {
                // Register user
                $rootScope.user = user; 
                // Init
                $scope.message = '';
                
                // doLogin
                AuthService.isLogged = true;
                socket.emit('login', $cookies.token);
                
                // Hide login
                $rootScope.login = false;
                
                $rootScope.$broadcast('USER_LOGGED');
            }, function () {
                $scope.message = 'Erreur de login';
            }).finally(function () {
                $scope.loading = false;
            });
        };
    }]
  }
})
.directive('signUp', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/directives/sign-up.tpl.html',
    controller: ['$scope', '$rootScope', '$cookies', '$timeout', '$state', 'AuthService', 'UserService',
        function ($scope, $rootScope, $cookies, $timeout, $state, AuthService, UserService) {
        
        $scope.formRegister = {
            mail: 'azerty@test.com',
            pseudo: 'azerty'
        };
        
        $scope.doRegister = function (form) {
            // Loading
            $scope.loading = true;
            
            // Login api
            UserService.register(form.mail, form.pseudo).then(function (user) {
                // Register user
                $rootScope.user = user; 
                // Init
                $scope.message = '';
                
                // doLogin
                AuthService.isLogged = true;
                socket.emit('login', $cookies.token);
                
                $rootScope.$broadcast('USER_LOGGED');
            }, function () {
                $scope.message = 'Erreur de register';
            }).finally(function () {
                $scope.loading = false;
            });
        };
    }]
  }
});