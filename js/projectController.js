'use strict';

angular.module('hogemine')
    .controller('projectController',function($scope, $http, $resource ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;

        // projects.jsonする回数を確認する
        $http.get('http://localhost:8080/'+redmineUrl +'projects.json').success(function(data){
            count =  Math.ceil(data.total_count/data.limit);

            if (count = 1) {
                $http.get('http://localhost:8080/'+redmineUrl +'projects.json').success(function(data){
                    $scope.projects = data;

                    $scope.currentPage = 0;
                    $scope.pageSize = 20;
                    $scope.data = [];
                    $scope.numberOfPages=function(){
                        return Math.ceil($scope.data.length/$scope.pageSize);
                    };

                    for (var i=0; i<data.total_count; i++) {
                        $scope.data.push("Item "+i);
                    }
                })
            } else {
                for (var i = 1; i <= count; i++) {
                    $http.get('http://localhost:8080/'+redmineUrl +'projects.json'+'&page=' + i).success(function(data){
                        $scope.projects = data;

                        $scope.currentPage = 0;
                        $scope.pageSize = 20;
                        $scope.data = [];
                        $scope.numberOfPages=function(){
                            return Math.ceil($scope.data.length/$scope.pageSize);
                        };

                        for (var i=0; i<data.total_count; i++) {
                            $scope.data.push("Item "+i);
                        }
                    })
                }
            }
        })
    })
