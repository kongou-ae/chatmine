'use strict';

angular.module('hogemine')
    .controller('settingDetailController',function($http,$scope,$location,$state) {

            var apiKey = window.localStorage.getItem('redmineApi');
            var redmineUrl = window.localStorage.getItem('redmineUrl');
            var issue_statusesAry = []
            var issue_statusesObj = {}

            // is_closed:がTrueなものだけ抽出する
            $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
            $http.get('http://localhost:8080/'+redmineUrl +'issue_statuses.json').success(function(data){
                for(var i =0;i< data.issue_statuses.length; i++){
                    // is_closedがtrueのものだけを抽出
                    if(data.issue_statuses[i].is_closed){
                        issue_statusesObj = {}
                        issue_statusesObj['id'] = data.issue_statuses[i].id
                        issue_statusesObj['name'] = data.issue_statuses[i].name
                        issue_statusesAry.push(issue_statusesObj)
                    }
                }
                $scope.issue_statuses = issue_statusesAry
                console.log($scope.issue_statuses);
            });
                //詳細ページを開く
                //location.replace('file://' + __dirname + '/index.html')
        })
