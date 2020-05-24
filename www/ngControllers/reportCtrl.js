//              app  .controller('reportCtrl', function ($scope, $rootScope, $http, svc) {
angular.module("app").controller('reportCtrl', function ($scope, $rootScope, $http, svc, $location) {

    console.log('report-Ctrl');
    $rootScope.setCurrentUser();

    $scope.mode = 'chart';
    $scope.order = 'enddate';
    $scope.reverse = true;

    $scope.chartOptions = {};
    $scope.chartOptions.priceType = 'line';
    $scope.chartOptions.countType = 'bar';
    $scope.chartOptions.timeType = 'line';

    $scope.catChartOptions = {};
    $scope.catChartOptions.priceType = 'pie';
    $scope.catChartOptions.countType = 'line';
    $scope.catChartOptions.timeType = 'pie';

    $scope.showEmployees = false;
    $scope.employees = [];
    $scope.arrCats = []; // store current selected emploeey categories

    $scope.getEmployees = function () {
        console.log('get employees');
        // get data from db 
        $http.get('/api/getMyEmployees')
            .then(function (response) {
                // console.log(response.data);
                for (var i in response.data) {
                    if (response.data[i].username) {
                        // $scope.employees.push(response.data[i].username) ; 
                        $scope.employees.push({
                            username: response.data[i].username,
                            realname: response.data[i].realname
                        });
                    }
                }

                if (!$scope.selectedUser) {
                    $scope.selectedUser = $scope.employees[0].username; // set selectedt user to first one 
                }

                if ($scope.employees.length > 1) {
                    // add all user
                    // $scope.employees.push('همه');
                    $scope.employees.push({
                        username: 'همه',
                        realname: 'همه'
                    });
                }

                $scope.getWorks();

            })
            .catch(function (error) {
                $rootScope.handleError(error, 'reportCtrl , 47');
            });
    };

    $scope.empName = function (username) {
        var realname = username;
        $scope.employees.forEach(function (item) {
            if (item.username == username) {
                realname = item.realname
            }
        });
        return realname;
    }; // return empolee name instead of username 

    $scope.getWorks = function () {
        console.log('get work list ')
        var apiUrl = '/api/report/works/' + $scope.selectedUser + '/';

        if ($scope.year && $scope.month) {
            apiUrl += $scope.year + '/' + $scope.month + '/';
        }

        $http.get(apiUrl)
            .then(function (response) {
                console.log('works : ',response.data)
                $scope.data = response.data;
                // calc totalSum 
                $scope.totalSum = 0;

                $scope.arrCats = ['همه'];
                for (var i in $scope.data) {
                    if ($scope.data[i].totalprice) {
                        $scope.totalSum = $scope.totalSum + parseInt($scope.data[i].totalprice);
                        // console.log($scope.data[i]) ; 
                        if (!$scope.arrCats.includes($scope.data[i].category)) {
                            $scope.arrCats.push($scope.data[i].category);
                        }
                    }
                }

                // console.log($scope.arrCats);
                $scope.getWorkCount();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    $scope.filterSum = 0;
    $scope.calcSum = function (index, value) {
        //     console.log(index,value) ; 
        if (index == 0) {
            $scope.filterSum = 0;
        }
        $scope.filterSum += parseInt(value);
    }; //calcSum

    $scope.calcTimeElapsed = function (m) {
        return parseInt(m / 60) + ':' + m % 60
    }; //calcTimeElapsed

    $scope.day = '00';
    // $scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31] ; 
    $scope.filteByDay = function () {
        if ($scope.day == '00') {
            $scope.searchValue = '';
        } else {
            $scope.searchValue = $scope.year + '/' + $scope.month + '/' + $scope.day;
        }
    }; //filteByDay

    $scope.filterByDate = function (d) {
        $scope.searchValue = d.substr(0, 10);
    }; //filterByDate

    $scope.saveReject = function (text, w) {
        console.log('saveing reject', text, w);
        // reject a work with given text 
        $http.post('/api/rejectWork', {
                workid: w.workid,
                reason: text
            })
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }; //saveReject

    $scope.showClipboard = function () {
        console.log('show clipboard items');
    }; //showClipboard


    $scope.rejectComments = [];
    $scope.rejectComment = '';

    $scope.rejectThis = function (w) {
        $scope.rejectingWork = w;

        try {
            $scope.rejectComments = JSON.parse(svc.load('rejectComments'));
        } catch (error) {
            console.log(error);
        }

        console.log($scope.rejectComments);

        $('#rejectModal').modal('show');
    }; // reject this work log 


    $scope.remove_c = function(c){
        console.log(c);
        for(var i in $scope.rejectComments){
            if($scope.rejectComments[i]==c){
                $scope.rejectComments.splice(i,1);
            }
        }
        svc.save('rejectComments', JSON.stringify($scope.rejectComments));
    };// 

    $scope.select_c = function(c){
        $scope.rejectComment = c ; 
    }

    $scope.save_comment = false ; 
    $scope.toogle_save_comment = function(){
        $scope.save_comment = !$scope.save_comment ; 
    };

    $scope.finishReject = function () {
        // add reject comment to rejecting work 
        // $scope.rejectingWork.detail += '\r\n' + $scope.rejectComment ; 

        console.log('finish reject',$scope.rejectingWork);
        // console.log('arr : ', $scope.rejectComment, $scope.rejectComments);
        // console.log('index : ', $scope.rejectComments.indexOf($scope.rejectComment));

        // update reject comments in local storage 
        if ($scope.rejectComment && $scope.rejectComment.length > 0 && $scope.save_comment===true) {
            // save comment in local storage 
            if ($scope.rejectComments.indexOf($scope.rejectComment) < 0) {
                $scope.rejectComments.push($scope.rejectComment);
                $scope.rejectComments.sort();
            }
            svc.save('rejectComments', JSON.stringify($scope.rejectComments));
        }

        // reject the selected doc 
        $http.post('/api/rejectWork', {
            workid: $scope.rejectingWork.workid,
            reason: $scope.rejectComment
        }).then((response) => { console.log(response.data); }).catch((error) => { console.log(error); });

        // refresh list 
        $scope.getWorks() ; 
        $('#rejectModal').modal('hide');
        $scope.save_comment = false ; 

    }; // finish reject


    $scope.reject = function (w) {
        // console.log(w) ; 
        Swal.fire({
            icon: 'warning',
            // title:'عدم پذیرش کار' , 
            html: `
            <div class="md-form" style="display:flex">
                <i class="fa fa-2x fa-clipboard-list prefix hand text-success" ng-click="showClipboard()"></i>
                <input type="text" name="rejectReason" id="rejectReason" class="form-control rtl text-right" ng-model="rejectReason" placeholder="علت عدم پذیرش">
            <div>
            `,
            // input:'text' , 
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'ثبت',
            cancelButtonText: 'انصراف',
            preConfirm: () => {
                // $scope.rejectReason = $('#rejectReason').val();
                // $scope.$apply();
                $scope.saveReject($('#rejectReason').val(), w);
            }
        });
    }; // reject


    // get my works count 
    $scope.getWorkCount = function () {
        console.log('get work count');
        var apiUrl = '/api/report/WorkCount/' + $scope.selectedUser + "/";
        if ($scope.year && $scope.month) {
            apiUrl += $scope.year + '/' + $scope.month + '/';
        }

        $http.get(apiUrl)
            .then(function (response) {
                $scope.chartData = response.data.data;
                // set the $scope.month and $scope.year 
                $scope.year = response.data.date.split('/')[0];
                $scope.month = response.data.date.split('/')[1];
                // console.log('chartData is : ' , $scope.chartData)

                $scope.chartOptions.labels = [];

                $scope.chartOptions.priceData = [];
                $scope.chartOptions.countData = [];
                $scope.chartOptions.timeData = [];
                // var priceTotalSum = 0 ; 
                $scope.totalCount = 0;

                for (var i in $scope.chartData) {
                    if ($scope.chartData[i].owner) {

                        $scope.chartOptions.labels.push($scope.chartData[i].workdate);

                        $scope.chartOptions.priceData.push($scope.chartData[i].totalprice);
                        $scope.chartOptions.countData.push($scope.chartData[i].cntr);
                        $scope.chartOptions.timeData.push((parseInt($scope.chartData[i].totalminutes) / 60).toFixed(1));
                        // console.log($scope.chartData[i].totalminutes);
                        // priceTotalSum += parseInt($scope.chartData[i].totalprice) ;
                        $scope.totalCount += parseInt($scope.chartData[i].cntr);
                    }
                }
                // $scope.chartOptions.priceLable = ' ' ; 
                // $scope.chartOptions.countLable = ' ' ; 

                $scope.getCatCount();
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    $scope.getCatCount = function () {
        console.log('get catCount');

        var apiUrl = '/api/report/catCount/' + $scope.selectedUser + "/";
        if ($scope.year && $scope.month) {
            apiUrl += $scope.year + '/' + $scope.month + '/';
        }

        $http.get(apiUrl).then(function (response) {
                // console.log(response.data);
                var data = response.data;

                $scope.catChartOptions.labels = [];

                $scope.catChartOptions.priceData = [];
                $scope.catChartOptions.countData = [];
                $scope.catChartOptions.timeData = [];

                for (var i in data) {
                    // console.log(data[i]);
                    if (data[i].category) {
                        $scope.catChartOptions.labels.push(data[i].category);
                        $scope.catChartOptions.priceData.push(data[i].totalprice);
                        $scope.catChartOptions.countData.push(data[i].cntr);
                        $scope.catChartOptions.timeData.push((parseInt(data[i].totalminutes) / 60).toFixed(2));
                    }
                }
                // console.log('label :' , $scope.catChartOptions.labels);
                $scope.renderChart();
            })
            .catch(function (error) {
                console.log(error);
            });


    };

    // $scope.showSearchInput = true ; 
    $scope.filterCat = function (cat) {
        // console.log(cat);
        if (cat == 'همه') {
            // $scope.showSearchInput = true ; 
            $scope.selectedCat = undefined;
            $scope.searchValue = '';
        } else {
            // $scope.showSearchInput = false ; 
            $scope.selectedCat = cat;
            $scope.searchValue = {
                category: cat
            };
        }
    }; // filterCat

    // $scope.getWorks();

    if ($scope.employees.length == 0) {
        $scope.getEmployees();
    }

    $scope.toggleZoom = function (id) {
        var charts = ['ph_1', 'ph_2', 'ph_3', 'ph_4', 'ph_5', 'ph_6'];
        // hide all other placeholders , excep current one 
        $.each(charts, function (index, _id) {
            // console.log(index , _id);
            if (_id == id) {
                // dont touch // toggle col-width                
            } else {
                $('#' + _id).toggle();
            }
        })

        $('#' + id).toggleClass('col-12');
        // console.log(id);
    };

    $scope.renderChart = function () {
        console.log('render chart : ');

        // set chart global options 
        // console.log('Chart.options : ' , Chart.defaults);
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.defaultFontFamily = 'iransans';
        Chart.defaults.scale.ticks.beginAtZero = true;
        Chart.defaults.global.title.display = true;
        Chart.defaults.global.tooltips.callbacks.label = function (t, e) {
            return commafy(t.value) + ' '; // csv number            
        }

        // Chart.defaults.scale.ticks.callback = function(t,a,b){
        //     console.log(t,a,b);
        // } ; 

        // Chart.defaults.global.defaultFontColor = 'red'

        if ($scope.priceChart) {
            console.log('update chart');
            // console.log('$scope.chartOptions' , $scope.chartOptions);

            $scope.priceChart.config.type = $scope.chartOptions.priceType;
            $scope.priceChart.data.labels = $scope.chartOptions.labels;
            $scope.priceChart.data.datasets[0].data = $scope.chartOptions.priceData;
            $scope.priceChart.update();

            $scope.countChart.config.type = $scope.chartOptions.countType;
            $scope.countChart.data.labels = $scope.chartOptions.labels;
            $scope.countChart.data.datasets[0].data = $scope.chartOptions.countData;
            $scope.countChart.update();

            $scope.timeChart.config.type = $scope.chartOptions.timeType;
            $scope.timeChart.data.labels = $scope.chartOptions.labels;
            $scope.timeChart.data.datasets[0].data = $scope.chartOptions.timeData;
            $scope.timeChart.update();

            $scope.catPriceChart.config.type = $scope.catChartOptions.priceType;
            $scope.catPriceChart.data.labels = $scope.catChartOptions.labels;
            $scope.catPriceChart.data.datasets[0].data = $scope.catChartOptions.priceData;
            $scope.catPriceChart.update();

            $scope.catCountChart.config.type = $scope.catChartOptions.countType;
            $scope.catCountChart.data.labels = $scope.catChartOptions.labels;
            $scope.catCountChart.data.datasets[0].data = $scope.catChartOptions.countData;
            $scope.catCountChart.update();

            $scope.catTimeChart.config.type = $scope.catChartOptions.timeType;
            $scope.catTimeChart.data.labels = $scope.catChartOptions.labels;
            $scope.catTimeChart.data.datasets[0].data = $scope.catChartOptions.timeData;
            $scope.catTimeChart.update();


        } else {

            console.log('create chart');
            // let chartCanvas = document.getElementById('chartCanvas').getContext('2d');
            let priceChartCanvas = document.getElementById('priceChartCanvas').getContext('2d');
            let countChartCanvas = document.getElementById('countChartCanvas').getContext('2d');
            let timeChartCanvas = document.getElementById('timeChartCanvas').getContext('2d');

            let catPriceChartCanvas = document.getElementById('catPriceChartCanvas').getContext('2d');
            let catCountChartCanvas = document.getElementById('catCountChartCanvas').getContext('2d');
            let catTimeChartCanvas = document.getElementById('catTimeChartCanvas').getContext('2d');


            $scope.priceChart = new Chart(priceChartCanvas, {
                type: $scope.chartOptions.priceType, // bar , line , pie , 
                data: {
                    labels: $scope.chartOptions.labels, //['label-1','label-2','label3'] , 
                    datasets: [{
                        label: 'ارزش کار انجام شده', // $scope.chartOptions.priceLable , // 'population' , 
                        data: $scope.chartOptions.priceData, //[500,150,300] ,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "ارزش کار در ماه",
                        fontSize: 23
                    },

                }
            }); // chart 

            $scope.countChart = new Chart(countChartCanvas, {
                type: $scope.chartOptions.countType, // bar , line , pie , 
                data: {
                    labels: $scope.chartOptions.labels, //['label-1','label-2','label3'] , 
                    datasets: [{
                        label: 'تعداد کار انجام شده', // $scope.chartOptions.countLable , // 'population' , 
                        data: $scope.chartOptions.countData, //[500,150,300] ,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "تعداد کار در ماه",
                        fontSize: 23
                    }
                }
            }); // chart 

            // console.log($scope.chartOptions.timeData);

            $scope.timeChart = new Chart(timeChartCanvas, {
                type: $scope.chartOptions.timeType, // bar , line , pie , 
                data: {
                    labels: $scope.chartOptions.labels, //['label-1','label-2','label3'] , 
                    datasets: [{
                        label: $scope.chartOptions.timeLable, // 'population' , 
                        data: $scope.chartOptions.timeData, //[500,150,300] ,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "نفر ساعت کار در ماه",
                        fontSize: 23
                    },
                    legend: {
                        display: false,
                        position: 'left'
                    }
                }
            }); // chart 


            $scope.catPriceChart = new Chart(catPriceChartCanvas, {
                type: $scope.catChartOptions.priceType, // bar , line , pie , 
                data: {
                    labels: $scope.catChartOptions.labels, //['label-1','label-2','label3'] , 
                    datasets: [{
                        // label : $scope.chartOptions.timeLable , // 'population' , 
                        data: $scope.catChartOptions.priceData, //[500,150,300] ,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "ارزش کار انجام شده",
                        fontSize: 23
                    }
                }
            }); // chart 


            $scope.catCountChart = new Chart(catCountChartCanvas, {
                type: $scope.catChartOptions.countType, // bar , line , pie , 
                data: {
                    labels: $scope.catChartOptions.labels, //['label-1','label-2','label3'] , 
                    datasets: [{
                        // label : $scope.chartOptions.timeLable , // 'population' , 
                        data: $scope.catChartOptions.countData, //[500,150,300] ,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "تعداد کار انجام شده",
                        fontSize: 23
                    }
                }
            }); // chart 

            $scope.catTimeChart = new Chart(catTimeChartCanvas, {
                type: $scope.catChartOptions.timeType, // bar , line , pie , 
                data: {
                    labels: $scope.catChartOptions.labels, //['label-1','label-2','label3'] , 
                    datasets: [{
                        // label : $scope.chartOptions.timeLable , // 'population' , 
                        data: $scope.catChartOptions.timeData, //[500,150,300] ,
                        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "نفر ساعت کار",
                        fontSize: 23
                    }
                }
            }); // chart 


        }
    };


    return;


    $scope.users = []

    $scope.getWorks = function () {
        console.log('get works list');
        var apiUrl = '/apps/WorkTracker/api/WorkTrackerAPI.aspx?api=AllWorks&Owner=' + $scope.user;
        $http.get(apiUrl).then(function (response) {
            $scope.data = response.data;
        });
    }; //get all works 

    $scope.getOwners = function () {
        var apiUrl = '/apps/WorkTracker/api/WorkTrackerAPI.aspx?api=Owners';
        $http.get(apiUrl).then(function (response) {
            $scope.users = [];
            for (var i in response.data) {
                console.log(i);
                if (!isNaN(i)) {
                    $scope.users.push(response.data[i].OWNER);
                }

                $scope.user = $scope.users[0];
            }

            $scope.getWorks();
            //$scope.users = response.data;
        });
    };

    svc.refreshUserStatus(function () {
        console.log('refresh and validate user login state');
        $scope.getWorks();
        $scope.getOwners();
    });

});