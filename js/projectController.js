'use strict';

angular.module('hogemine')
    .controller('projectController',function($scope, $http, $resource ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
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
        });

    })
