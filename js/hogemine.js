'use strict';

angular.module('hogemine')
    .controller('settingController',function($scope,$location) {

    $scope.submit = function () {
        
        window.localStorage.setItem('redmineUrl', $scope.redmineUrl );
        window.localStorage.setItem('redmineApi', $scope.redmineApi );
        
        location.reload()
    }
        
    })
    .controller('projectController',function($scope, $http, $resource ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        $http.get(redmineUrl +'projects.json').success(function(data){
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
    
    .controller('ticketController',function($scope, $http, $resource,$routeParams,$modal ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var count = "";
        var ticketAry = [];
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;

        // issues.jsonする回数を確認する
        $http.get(redmineUrl +'issues.json?project_id='+ $routeParams.projectId).success(function(data){
            count =  Math.ceil(data.total_count/data.limit);

            for (var i = 1; i <= count; i++) {
                $http.get(redmineUrl +'issues.json?project_id='+ $routeParams.projectId + '&page=' + i).success(function(data){
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
        $http.get(redmineUrl +'issues.json?project_id='+ $routeParams.projectId).success(function(data){
            
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
    .controller('createController',function($scope, $http, $resource, $routeParams ) {
        

    })
    .controller('detailController',function($scope, $http, $resource, $routeParams ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        var result = $resource( redmineUrl +'issues/' + $routeParams.issueId + '.json?include=journals',{},{
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
            $http.put(redmineUrl +'issues/' + $routeParams.issueId + '.json', JSON.stringify(data)).success(function() {
                //更新後、GETで情報を取得し、描画する
                $http.get( redmineUrl +'issues/' + $routeParams.issueId + '.json?include=journals').success(function(data){
                    
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

    // 改行を反映させるためのフィルタ
    .filter('newline', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text != null ? text.replace(/\n/g, '<br />') : '');
        };
    })
    // 時刻表示を綺麗に出力するフィルタ
    .filter('timeChange', function($sce) {
        return function(text) {
            var m = moment(text)
            var formatDate = m.format('YYYY/MM/DD HH:mm');
            return formatDate
        };
    })
    // paginationのフィルタ
    .filter('startFrom', function() {
        return function(input, start) {
            if (!input || !input.length) { return; }
            start = +start; //parse to int
            return input.slice(start);
        };
    });

