'use strict';

angular.module('hogemine')
    .controller('detailController',function($scope, $http, $resource, $routeParams ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');

        $scope.redmineUrl = redmineUrl

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        var result = $resource('http://localhost:8080/'+ redmineUrl +'issues/' + $routeParams.issueId + '.json?include=journals',{},{
            get:{
                method: 'GET'
            }
        });

        $scope.issue = result.get();

        $scope.submit = function () {

            var apiKey = window.localStorage.getItem('redmineApi');
            var redmineUrl = window.localStorage.getItem('redmineUrl');
            var data = {};
            var issue = {};

            issue.notes = $scope.journal
            data.issue = issue

            $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
            // 履歴をPUTで更新
            $http.put('http://localhost:8080/'+redmineUrl +'issues/' + $routeParams.issueId + '.json', JSON.stringify(data)).success(function() {
                //更新後、GETで情報を取得し、描画する
                $http.get('http://localhost:8080/'+ redmineUrl +'issues/' + $routeParams.issueId + '.json?include=journals').success(function(data){

                    $scope.issue = data
                });

                $(function() {
                    $('body').animate({
                      scrollTop: $(document).height()
                    },1500);

                });

                // textareaを初期化
                $scope.journal = ""
            })
        }
    })
