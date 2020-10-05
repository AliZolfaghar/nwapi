angular.module("app").controller('manageUsersCtrl', function ($scope, $rootScope, $http, svc, $location) {
    console.log('manageUsersCtrl', $rootScope.currentUser);

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


    $scope.load_list = ()=>{
        $http.get('/api/users')
        .then((response)=>{
            $scope.users = response.data ; 
        })
        .catch((error)=>{
            console.log(error);
            svc.handleError(error);
        });

    };//load list of users
    $scope.load_list();
});