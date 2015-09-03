'use strict';

angular.module('hogemine')
    .controller('settingController',function($scope,$location) {

        $scope.submit = function () {

            window.localStorage.setItem('redmineUrl', $scope.redmineUrl );
            window.localStorage.setItem('redmineApi', $scope.redmineApi );

            location.reload()
        }

    })
