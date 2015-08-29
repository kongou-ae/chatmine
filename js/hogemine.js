'use strict';

angular.module('hogemine')
    .controller('projectController',function($scope, $http, $resource ) {
        var apiKey = "5907364a93016593b3fa968881363dbb8263fc77";
        var redmineUrl = "http://redmine20150707.ruby.iijgio.com/";

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
    
    .controller('ticketController',function($scope, $http, $resource,$routeParams ) {
        // var apiKey = window.localStorage.getItem('apiKey');
        var apiKey = "5907364a93016593b3fa968881363dbb8263fc77";
        var redmineUrl = "http://redmine20150707.ruby.iijgio.com/";
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

       
    })
    .controller('detailController',function($scope, $http, $resource, $routeParams ) {
        var apiKey = "5907364a93016593b3fa968881363dbb8263fc77"
        var redmineUrl = "http://redmine20150707.ruby.iijgio.com/"
        
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        var result = $resource( redmineUrl +'issues/' + $routeParams.issueId + '.json?include=journals',{},{
            get:{
                method: 'GET'
            }
        });
        
        $scope.issue = result.get();
    
        $scope.submit = function () {
            
            var apiKey = "5907364a93016593b3fa968881363dbb8263fc77"
            var redmineUrl = "http://redmine20150707.ruby.iijgio.com/"
            var data = {};
            var issue = {};
            
            issue.notes = $scope.journal
            data.issue = issue

            $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
            $http.put(redmineUrl +'issues/' + $routeParams.issueId + '.json', JSON.stringify(data)).success(function() {
            
                $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
                var result = $resource( redmineUrl +'issues/' + $routeParams.issueId + '.json?include=journals',{},{
                    get:{
                        method: 'GET'
                    }
                });
                
                $scope.issue = result.get();
                
                $(function() {
                    $('body').animate({
                      scrollTop: $(document).height()
                    },1500);
                /*
                    //animationする必要がなければ
                    setTimeout(function() {
                        window.scroll(0,$(document).height());
                    },0);
                */
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
    // paginationのフィルタ　※コピペ。slideがエラーになるの要確認
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };
    });

