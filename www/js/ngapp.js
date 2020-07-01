var app = angular.module('app', ['ngRoute','ADM-dateTimePicker','oc.lazyLoad']);

// app.run 
app.run(function ($rootScope , $location, $interval, $http) {
    console.log('app.run');
    $rootScope.errors = []; // keep errors in this array 

    /** is there any error in rootSope.errors ? */
    $rootScope.haveError = function(){
        if($rootScope.errors.length == 0 ) {
            return false ; 
        }else{
            return true ; 
        }
    } ;    

    // format numbers 
    $rootScope.commafy = function (number) {
        try {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } catch (ex) {
            return number;
        }
    }; // commafy 

    // handle errors 
    $rootScope.handleError = function(error,ref){
        console.log(ref , error);
        
        if(error.status==401){
            console.log('401 detected ' , error.status)
            // goto login page 
            $location.path('/login');
        }
        // todo handle no-access to page error , forbidden 
    }; // handle error 


});// run 

// app.config 
app.config(['$routeProvider', '$locationProvider', 'ADMdtpProvider', function ($routeProvider, $locationProvider, ADMdtp , $rootScope,$ocLazyLoad) {
    console.log('app.config'); 
    // config date picker 
    ADMdtp.setOptions({
        calType: 'jalali',
        format: 'YYYY/MM/DD - hh:mm',
        default: 'today',
        autoClose : true 
    });
    // to set clean urls , just uncomment the next line
    // $locationProvider.html5Mode(true);

    // setup my app routes
    $routeProvider
        .when('/', {
            redirectTo: '/home'
        })

        .when('/home', {
            templateUrl: 'ngviews/home.html',
            controller: 'homeCtrl',
            resolve : {
                deps : function($ocLazyLoad){
                    return $ocLazyLoad.load("/ngControllers/homeCtrl.js");
                }
            }
        })

        .when('/login', {
            templateUrl: 'ngviews/login.html',
            controller: 'loginCtrl',
            resolve : {
                deps : function($ocLazyLoad){
                    return $ocLazyLoad.load("/ngControllers/loginCtrl.js");
                }
            }
        })

        .when('/logout', {
            templateUrl: 'ngviews/login.html',
            controller: 'logoutCtrl',
            resolve : {
                deps : function($ocLazyLoad){
                    return $ocLazyLoad.load('/ngControllers/logoutCtrl.js');
                }                
            }
        })



        .when('/404', {
            templateUrl: 'ngviews/404.html',
            controller: '404Ctrl'
        })

        .when('/error', { // show app errors
            templateUrl: '/ngviews/error.html',
            controller: 'errorCtrl'
        })

        .otherwise({
            redirectTo: '/404'
        });
}]);// app.config


app.service('svc', ['$rootScope', '$location', '$http', function ($rootScope, $location, $http) {

    // save to local storage 
    this.save = function (modelName, modelData) {
        console.log('save in localstorage :' , modelName)
        localStorage[modelName] = angular.toJson(modelData);
    };

    // load from local storage 
    this.load = function (modelName) {
        console.log('load from localstorage :',modelName);
        return angular.fromJson(localStorage[modelName]);
    };    

    // redirect to an  angulat-route 
    this.redirect = function (url) {
        $location.path(url);
    }; 

    // toast service 

    // Toeast Message functions
    this.toast = {
        success: function (message) {
            toastr.success(message);
        },
        info: function (message) {
            toastr.info(message);
        },
        warning: function (message) {
            toastr.warning(message);
        },
        alert: function (message) {
            toastr.error(message);
        },
        error : function (message) {
            var d = new Date();
            var n = d.toISOString();
            // toastr["error"](message);
            toastr.error(message);
            $rootScope.errors.push('( ' + n + ' ) - ' + message); // put message in rootscope errors array
            $rootScope.haveError = true;
            console.log(message);
        }
    };
    
    this.currentUser = {}; 
    this.refreshUser = function(){
        $rootScope.realname = this.load('realname');
        $rootScope.rolename = this.load('rolename');
    }

    // refresh user status , if neede redirect to login 
    this.refreshUserStatus = function (cb) {
        console.log('--------------------------');        
        console.log('refresh currwent user status');
        console.log($cookies.get('LoginToken'));
        //            /api/auth/status
        var apiUrl = '/api/auth/authapi.aspx?api=GetLoginStatus';
        $http.get(apiUrl)
            .then(function (response) {
                console.log('current user : ' , response.data);
                this.currentUser = response.data; 
                $rootScope.currentUser = response.data; 
                if (this.currentUser.isLogin == true) {
                    cb();
                } else {
                   // this.redirectTo('/login');
                    $location.path('/login');
                }
            })
            .catch(function (error) {
                this.currentUser = {};
                $rootScope.errors.push(error);
                console.log(error);
                // this.redirectTo('/errorlog');
                $location.path('/errorlog');
            });
    };

    function handleError(error){
        if(error.status==401){
            toastr.error("لطفا به سامانه وارد شوید");
            return $location.path('/login');
        }

        console.log(error);
        $rootScope.errors.push(error);
        toastr.error("خطای سیستم");
        $location.path('/error');
    }//handleError
    this.handleError = handleError;


    // check user auth state 
    this.checkAuth = function(cb){
        // call /api/auth via get 
        $http.get('/api/auth')
        .then(function(response){
            cb(response.data.auth);
        })
        .catch(function(error){
            handleError(error);
        });
    } // checkAuth

}]);

/**
 * user roles and access control 
 * 
 */

// app.controller('octestCtrl',function($scope,$ocLazyLoad){
//     // console.log('try to oc-lazy-load module');
//     // $ocLazyLoad.load('/ngControllers/octestCtrl.js');
// });

app.filter('brakeDash',function($sce){
    return function(input){
        try {
            return $sce.trustAsHtml(input.replace('-','<br>'));                    
        } catch (error) {
            return input ;  
        }
    };
});

// root controller to run at app start
app.controller('rootCtrl',function($scope,$rootScope,svc){
    console.log('rootCtrl');
    // the next code block will run on every route-change
    $scope.$on('$routeChangeStart', function(next, current){
        //...do stuff here...
        console.log('route-change');
        // put realname and rolename in $rootScope
        svc.refreshUser();
    });
});


app.controller('404Ctrl',function(){
    console.log('404-controller');
});

app.controller('errorCtrl',function($rootScope){
    console.log('error-controller');
});//errorCtrl


app.controller('sampleCtrl', function ($scope, $rootScope, $http, svc) {
    console.log('sample-Ctrl');
    svc.refreshUserStatus(function () {
        console.log('refresh and validate user login state');
    });

});


// commafy helper for chart.js 
function commafy (number) {
    try {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (ex) {
        return number;
    }
}; // commafy 



// var chart1;
// function render_chart(divid, charttype, chartdata , caption) {
//     console.log('render chart');
//     if (chart1){
//         chart1.clear().destroy();
//     }
//     Chart.defaults.global.tooltips.callbacks.label = function (obj1, obj2) {
//         return commafy(obj1.yLabel);
//     }
       
//     var ctx = document.getElementById(divid).getContext('2d');
       
//     // var myChart = new Chart(ctx, {}).update( {
//     chart1 = new Chart(ctx,
//         {
//             type: charttype,
//             data: {
//                 labels: chartdata.label,
//                 datasets: [{
//                     label: caption,
//                     data: chartdata.data,
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                         'rgba(255, 159, 64, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgba(255,99,132,1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)',
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(153, 102, 255, 1)',
//                         'rgba(255, 159, 64, 1)'
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 labels: {
//                     // This more specific font property overrides the global property
//                     defaultFontSize: 24,
//                 },
//                 scales: {
//                     yAxes: [{
//                         ticks: {
//                             beginAtZero: true,
//                             callback: function (value) {
//                                 return commafy(value);
//                             }
//                         }
//                     }],
//                     xAxes: [{
//                         ticks: {
//                             autoSkip: false
//                         }
//                     }]
//                 }
//             }

//         });  
// }; // render_chart 

// function update_chart(chart, charttype, chartdata, caption) {
//     console.log('update-chart');
//     // chart.clear().destroy();
//     render_chart('myChart', 'bar', chartdata, caption);

//     return; 

//     chart.update(
//         {
//             type: charttype,
//             data: {
//                 labels: chartdata.label,
//                 datasets: [{
//                     label: caption,
//                     data: chartdata.data,
//                     backgroundColor: [
//                         'rgba(255, 99, 132, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(255, 206, 86, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(153, 102, 255, 0.2)',
//                         'rgba(255, 159, 64, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgba(255,99,132,1)',
//                         'rgba(54, 162, 235, 1)',
//                         'rgba(255, 206, 86, 1)',
//                         'rgba(75, 192, 192, 1)',
//                         'rgba(153, 102, 255, 1)',
//                         'rgba(255, 159, 64, 1)'
//                     ],
//                     borderWidth: 1
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 labels: {
//                     // This more specific font property overrides the global property
//                     defaultFontSize: 24,
//                 },
//                 scales: {
//                     yAxes: [{
//                         ticks: {
//                             beginAtZero: true,
//                             callback: function (value) {
//                                 return commafy(value);
//                             }
//                         }
//                     }],
//                     xAxes: [{
//                         ticks: {
//                             autoSkip: false
//                         }
//                     }]
//                 }
//             }

//         }
//     );
// };
