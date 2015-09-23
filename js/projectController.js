'use strict';

angular.module('hogemine')
    .controller('projectController',function($scope, $http, $resource,$q ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";
        var projectAry = [];

        // !!!わかりにくい!!!
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        var promise = $http.get('http://localhost:8080/'+redmineUrl +'projects.json')
        promise
            .then(function(result){
                count =  Math.ceil(result.data.total_count/result.data.limit);

                var urlAry = []
                for (var i = 1; i <= count; i++) {
                    urlAry.push('http://localhost:8080/'+redmineUrl +'projects.json'+'?page=' + i)
                }

                var getProjectAry = function(urlAry){
                    return $q.all(urlAry.map(function(url){
                        return $http.get(url).success(function(data){
                            })
                        }))
                }
                return getProjectAry(urlAry)
            })
            // 複数かいの$httpの結果を$q.allでまとめて受け取ってる？？
            .then(function(result){
                result.map(function(data){
                    for (var j = 0; j < data.data.projects.length; j++){
                        projectAry.push(data.data.projects[j])
                    }
                })

                projectAry.sort(function(obj1,obj2){
                    return obj1.id - obj2.id;
                })

                $scope.projects = projectAry;
            });

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
