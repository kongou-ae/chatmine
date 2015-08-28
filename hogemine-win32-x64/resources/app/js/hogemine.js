'use strict';


angular.module('hogemine')
    .controller('MainController',function($scope, $http, $resource ) {
        // var apiKey = window.localStorage.getItem('apiKey');
        var apiKey = "5907364a93016593b3fa968881363dbb8263fc77"
        var redmineUrl = "http://redmine20150707.ruby.iijgio.com/"

        //$http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        //$http.defaults.headers.common['Content-Type'] = 'application/json';

        var result = $resource( redmineUrl +'issues.json',{},{
            get:{
                method: 'GET'
            }
        });
        
        $scope.issues = result.get();
    })
    .controller('detailController',function($scope, $http, $resource, $routeParams ) {
        var apiKey = "5907364a93016593b3fa968881363dbb8263fc77"
        var redmineUrl = "http://redmine20150707.ruby.iijgio.com/"
        
        console.log($routeParams.issueId)
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        var result = $resource( redmineUrl +'issues/' + $routeParams.issueId + '.json',{},{
            get:{
                method: 'GET'
            }
        });
        
        $scope.issue = result.get();
        
    })
    ;