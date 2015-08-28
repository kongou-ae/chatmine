'use strict';

//var app = angular.module('myApp', ['ngResource','ngRoute'])
angular.module('hogemine', ['ngResource','ngRoute'])
// 以下を削除すると普通に動く
    .config(
        function ($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'view/issue.html',
                controller: 'MainController'
            })
            .when('#/', {
                templateUrl: 'view/issue.html',
                controller: 'MainController'
            })
            .when('/issue/:issueId', {
                templateUrl: 'view/issue-detail.html',
                controller: 'MainController'
            });
            //.otherwise({
            //    redirectTo: 'login'
            //});
        }
        
    );