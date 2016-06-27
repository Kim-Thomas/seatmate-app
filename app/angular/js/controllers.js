myApp.controller('RootCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $rootScope.loading = false;
}])

.controller('IndexCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
    $scope.formSearch = {
        nbOfFlight: '',
        nbOfSeat: '',
        date: ''
    };
    
    $scope.searchFlight = function (form) {
        $scope.loading = true;
        
        /**
         * Appel au service / API / Simulation $timeout
         */
        $timeout(function () {
            $scope.loading = false;
            $scope.message = "Flight not found.";
            console.log(form);
            $timeout(function () {
                delete $scope.message;
            }, 1500);
        }, 1500);
    };
}])
.controller('SignInCtrl', ['$scope', '$rootScope', '$http', '$cookies', '$state', '$timeout', 'UserService', function ($scope, $rootScope, $http, $cookies, $state, $timeout, UserService) {
    $scope.formConnexion = {
        mail: 'test@test.com',
        password: 'azerty'
    };
    
    $scope.doLogin = function (form) {
        $scope.loading = true;
      
        UserService.login(form.mail, form.password).then(function (data) {
            $rootScope.user = data; 
            $scope.message = 'Connexion avec succès, redirection dans 3s...';
            $scope.isLogged = true;
            $timeout(function () {
                $state.go('index');
            }, 3000);
        }, function () {
            $scope.message = 'Erreur de login';
        }).finally(function () {
            $scope.loading = false;
        });
    };
}]);

myApp.factory('UserService', ['$http', '$q', '$cookies', function ($http, $q, $cookies) {
    return {
        getProfile: function () {
            $http.get(API_URL + '/v1/secure/signin')
        },
        login: function (mail, password) {
            defered = $q.defer();
            $http.post(API_URL + '/v1/secure/signin', 
                {mail: mail, password: password}
            ).success(function (data) { 
                $cookies.token = data.token;
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
                defered.resolve(user);
            }).error(function () {
                defered.reject();    
            });
            return defered.promise;
        }
    };
}]);