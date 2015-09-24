'use strict';

angular.module('hogemine')

    .controller('ticketController',function($scope, $http, $resource,$stateParams,$modal,$q,$state ) {

        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";
        var ticketAry = [];

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        $scope.projectId = $stateParams.projectId;

        var promise = $http.get('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $stateParams.projectId)
        promise
            .then(function(result){
                count =  Math.ceil(result.data.total_count/result.data.limit);

                var urlAry =[]
                for (var i = 1; i <= count; i++) {
                    urlAry.push('http://localhost:8080/'+redmineUrl +'issues.json?project_id='+ $stateParams.projectId + '&page=' + i)
                }

                var getTicketAry = function(urlAry){
                    return $q.all(urlAry.map(function(url){
                        return $http.get(url).success(function(data){
                            })
                        }))
                }
                return getTicketAry(urlAry)

            })
            .then(function(result){
                result.map(function(data){
                    for (var j = 0; j < data.data.issues.length; j++){
                        ticketAry.push(data.data.issues[j])
                    }
                })

                ticketAry.sort(function(obj1,obj2){
                    return obj2.id - obj1.id;
                })

                $scope.issues = ticketAry;
            });

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
