'use strict';

angular.module('hogemine')
    .controller('detailController',function($scope, $http, $resource, $stateParams ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var journalAry = [];

        $scope.redmineUrl = redmineUrl

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        $http.get('http://localhost:8080/'+ redmineUrl +'issues/' + $stateParams.issueId + '.json?include=journals').success(function(data){
            // チケット情報を表示するために、$scopeに結果を格納
            $scope.issue = data

            // チケットを古い順にソートするために、取得結果を別の配列に格納
            for (var i = 0 ; i < data.issue.journals.length; i++){
                journalAry.push(data.issue.journals[i])
            }
            // 配列をソートし、$scopeに格納
            journalAry.sort(
                function(a,b){
                    if( a.id > b.id ) return 1;
                    if( a.id < b.id ) return -1;
                    return 0;
                }
            );
            $scope.journals = journalAry

        })

        $scope.submit = function () {

            var apiKey = window.localStorage.getItem('redmineApi');
            var redmineUrl = window.localStorage.getItem('redmineUrl');
            var data = {};
            var issue = {};
            journalAry = []

            issue.notes = $scope.journal
            data.issue = issue

            $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
            // 履歴をPUTで更新
            $http.put('http://localhost:8080/'+redmineUrl +'issues/' + $stateParams.issueId + '.json', JSON.stringify(data)).success(function() {
                //更新後、GETで情報を取得し、描画する
                $http.get('http://localhost:8080/'+ redmineUrl +'issues/' + $stateParams.issueId + '.json?include=journals').success(function(data){

                    $scope.issue = data

                    // チケットを古い順にソートするために、取得結果を別の配列に格納
                    for (var i = 0 ; i < data.issue.journals.length; i++){
                        journalAry.push(data.issue.journals[i])
                    }
                    // 配列をソートし、$scopeに格納
                    journalAry.sort(
                        function(a,b){
                            if( a.id > b.id ) return 1;
                            if( a.id < b.id ) return -1;
                            return 0;
                        }
                    );
                    $scope.journals = journalAry
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
