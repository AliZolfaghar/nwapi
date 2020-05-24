angular.module("app").controller('homeCtrl', function ($scope, $rootScope, $http, svc, $location) {
    console.log('home-Ctrl', $rootScope.currentUser);

    // save last selected action in localStorage 
    $scope.rememberLastChoise = function(o){
        // console.log('save action to localstorage' , o);
        svc.save('lastCategory' , o.action.category);
        svc.save('lastAction' , o.action.actionid);
        
        // set the title if empty 
        if($scope.work.title=='' && o.action.caption){            
            $scope.work.title = o.action.caption;
        }
    };


});