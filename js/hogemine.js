'use strict';

angular.module('hogemine')
    .controller('MainController',function($scope, $http, $resource ) {
        // var apiKey = window.localStorage.getItem('apiKey');
        var apiKey = "5907364a93016593b3fa968881363dbb8263fc77"
        var redmineUrl = "http://redmine20150707.ruby.iijgio.com/"

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;

        var result = $resource( redmineUrl +'issues.json',{},{
            get:{
                method: 'GET'
            }
        });
        
        $scope.issues = result.get();
        
        $scope.currentPage = 0;
        $scope.pageSize = 15;
        $scope.data = [];
        $scope.numberOfPages=function(){
            return Math.ceil($scope.data.length/$scope.pageSize);                
        }
        for (var i=0; i<45; i++) {
            $scope.data.push("Item "+i);
        }
       
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
    .filter('newline', function($sce) {
        return function(text) {
            return $sce.trustAsHtml(text != null ? text.replace(/\n/g, '<br />') : '');
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        };
    });

