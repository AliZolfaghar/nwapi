angular.module("app").controller('logoutCtrl', function ($scope, $rootScope, $http, svc, $cookies) {
    console.log('logout-Ctrl');
    $http.delete('/api/auth')
    .then(function(response){
        svc.redirectTo('/login');
    })
    .catch(function(error){
        svc.handleError(error); // alert and show error page 
    });    
});
