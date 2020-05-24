angular.module("app").controller('loginCtrl', function ($scope, $rootScope, $http, svc) {
    console.log('login-Ctrl');     
    $scope.data = { username: '', password: '', remember: false }; 

    $scope.login = function () {
        // console.log('try to login winth as : ' , $scope.data);    
        $http.post('/api/login',$scope.data) // post data to api
        .then(function(response){
            // console.log('response.data is : ',response.data);
            if(response.data && response.data.success === true){
                // $rootScope.currentUser = response.data.username ; // put username as currentUser in rootSope;
                // console.log('response.data.username' , response.data.username);
                svc.redirect('/home');// goto home page 
            }
            else{
                // $scope.message = 'نام کاربری یا کلمه عبور اشتباه است' ; // show fail message 
                svc.toast.error('نام کاربری یا کلمه عبور اشتباه است');
            }            
        })
        .catch(function(error){
            svc.handleError(error); // alert and show error page 
        });
    };// login

});
