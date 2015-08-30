'use strict';

//var app = angular.module('myApp', ['ngResource','ngRoute'])
angular.module('hogemine', ['ngResource','ngRoute'])
    .config(
        function ($routeProvider){
            var apiKey = window.localStorage.getItem('redmineApi');
            var redmineUrl = window.localStorage.getItem('redmineUrl');

            $routeProvider
                .when('/setting', {
                    templateUrl: 'view/setting.html',
                    controller: 'settingController'
                })
                .when('/project/:projectId', {
                    templateUrl: 'view/ticket.html',
                    controller: 'ticketController'
                })
                .when('/project/:projectId/issue/:issueId', {
                    templateUrl: 'view/ticket_detail.html',
                    controller: 'ticketController'
                });
            
            if (apiKey == null || redmineUrl == null) {
                 $routeProvider
                    .when('/', {
                        templateUrl: 'view/setting.html',
                        controller: 'settingController'
                    })
                    .when('#/', {
                        templateUrl: 'view/setting.html',
                        controller: 'settingController'
                    });
            } else {
                $routeProvider
                    .when('/', {
                        templateUrl: 'view/project.html',
                        controller: 'projectController'
                    })
                    .when('#/', {
                        templateUrl: 'view/project.html',
                        controller: 'projectController'
                    });
            }
            //.otherwise({
            //    redirectTo: 'login'
            //});
        }
        
    );