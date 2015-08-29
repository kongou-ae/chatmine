'use strict';

//var app = angular.module('myApp', ['ngResource','ngRoute'])
angular.module('hogemine', ['ngResource','ngRoute'])
    .config(
        function ($routeProvider){
        $routeProvider
            .when('/', {
                templateUrl: 'view/project.html',
                controller: 'projectController'
            })
            .when('#/', {
                templateUrl: 'view/project.html',
                controller: 'projectController'
            })
            .when('/project/:projectId', {
                templateUrl: 'view/ticket.html',
                controller: 'ticketController'
            })
            .when('/project/:projectId/issue/:issueId', {
                templateUrl: 'view/ticket_detail.html',
                controller: 'ticketController'
            });
            //.otherwise({
            //    redirectTo: 'login'
            //});
        }
        
    );