'use strict';

//var app = angular.module('myApp', ['ngResource','ngRoute'])
angular.module('hogemine', ['ngResource','ngRoute','ui.bootstrap','ui.router'])
    .config(['$stateProvider', '$urlRouterProvider',function ($stateProvider, $urlRouterProvider) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');

        if (apiKey == null || redmineUrl == null) {
            $stateProvider
                .state('main', {
                    url:"/",
                    views:{
                        sidebarView:{
                            controller: "projectController",
                            templateUrl: "view/project_sidebar.html"
                        },
                        chatView:{
                            controller: "settingController",
                            templateUrl: "view/setting.html"
                        }
                    }
                })
        } else {
            $stateProvider
                .state('main', {
                    url: "/",
                    views:{
                        sidebarView:{
                            controller: "projectController",
                            templateUrl: "view/project_sidebar.html"
                        }
                    }
                })
        }

        $stateProvider
            .state('project', {
                url:"/project/:projectId",
                views:{
                    sidebarView:{
                        controller: "ticketController",
                        templateUrl: "view/ticket_sidebar.html"
                    }
                }
            })
            .state('project.issue', {
                url:"/issue/:issueId",
                views:{
                    "chatView@":{
                        controller: "detailController",
                        templateUrl: "view/ticket_detail.html"
                    }
                }
            })
    }]);
