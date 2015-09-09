'use strict';

angular.module('hogemine')
    .controller('projectController',function($scope, $http, $resource ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";
        var projectAry = [];

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;

        // projects.jsonする回数を確認する
        $http.get('http://localhost:8080/'+redmineUrl +'projects.json').success(function(data){
            count =  Math.ceil(data.total_count/data.limit);

            // データを表示する
            for (var i = 1; i <= count; i++) {
                $http.get('http://localhost:8080/'+redmineUrl +'projects.json'+'?page=' + i).success(function(data){
                      for (var j = 0; j < data.projects.length; j++){
                          projectAry.push(data.projects[j])
                      }
                      $scope.projects = projectAry;
                })
            }
        })
        // プロジェクトのトータル数を取得し、ページ数の計算に利用する
        $http.get('http://localhost:8080/'+redmineUrl +'projects.json').success(function(data){

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
    })
