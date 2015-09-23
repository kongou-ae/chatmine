'use strict';

angular.module('hogemine')

    .controller('ticketController',function($scope, $http, $resource,$stateParams,$modal,$q,$state ) {

        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";
        var ticketAry = [];

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        $scope.projectId = $stateParams.projectId;

        var async_1 = function(){
            $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $stateParams.projectId)
                .success(function(data){
                    var d = $q.defer();
                    count =  Math.ceil(data.total_count/data.limit);

                    for (var i = 1; i <= count; i++) {
                        $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $stateParams.projectId + '&page=' + i)
                            .success(function(data){
                                for(var j=0; j < data.issues.length; j++) {
                                    ticketAry.push(data.issues[j]);
                                }
                            })
                    }
                    return d.promise;
                })
            }

        var async_2 = function(){
                var d = $q.defer();
                ticketAry.sort(function(a,b){
                    if( a.id < b.id ) return 1;
                    if( a.id > b.id ) return -1;
                    return 0;
                })
                return d.promise;
            }

        $q.when()
        .then(function(){
            async_1();
        })
        .then(function(){
            async_2();
        })
        .then(function(){
            $scope.issues = ticketAry;
        })

        // チケットのトータル数を取得し、ページ数の計算に利用する
        $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $stateParams.projectId).success(function(data){

            $scope.currentPage = 0;
            $scope.pageSize = 20;
            $scope.data = [];

            $scope.numberOfPages=function(){
                return Math.ceil(data.total_count/data.limit) + 1
            }

            for (var i=0; i<data.total_count; i++) {
                $scope.data.push("Item "+i);
            }
        });

        // チケット作成ウィンドウを開く
        $scope.openNewticket = function(){
            $modal.open({
                templateUrl: 'view/modal.html',
                controller:'modalController',
                scope: $scope
            });
        };
        // リロード処理
        $scope.refresh = function(){
            $state.reload()
        };
    });
