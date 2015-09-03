'use strict';

angular.module('hogemine')

    .controller('ticketController',function($scope, $http, $resource,$routeParams,$modal ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";
        var ticketAry = [];
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;

        // issues.jsonする回数を確認する
        $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $routeParams.projectId).success(function(data){
            count =  Math.ceil(data.total_count/data.limit);

            for (var i = 1; i <= count; i++) {
                $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $routeParams.projectId + '&page=' + i).success(function(data){
                    for(var j=0; j < data.issues.length; j++) {
                        ticketAry.push(data.issues[j]);
                    }
                    $scope.projectId = $routeParams.projectId;

                    ticketAry.sort(
                        function(a,b){
                            if( a.id < b.id ) return 1;
                            if( a.id > b.id ) return -1;
                            return 0;
                        }
                    );
                    $scope.issues = ticketAry;

                });
            }
        })

        // チケットのトータル数を取得し、ページ数の計算に利用する
        $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $routeParams.projectId).success(function(data){

            $scope.currentPage = 0;
            $scope.pageSize = 20;
            $scope.data = [];
            $scope.numberOfPages=function(){
                return Math.ceil(data.total_count/data.limit)
            }

            for (var i=0; i<data.total_count; i++) {
                $scope.data.push("Item "+i);
            }
        });

        // チケット作成ウィンドウを開く
        $scope.openNewticket = function(){
            $scope.newGuest = {};
            $modal.open({
                templateUrl: 'view/modal.html',
                scope: $scope
            });
        }
    })
