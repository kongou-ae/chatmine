'use strict';

angular.module('hogemine')
    .controller('settingController',function($http,$scope,$location,$state) {

        $scope.next = function () {

            // パラメータをローカルストレージに保存
            var errorFlag = 0

            if (typeof($scope.redmineUrl) != "undefined" ){
                window.localStorage.setItem('redmineUrl', $scope.redmineUrl );
                errorFlag += 1
            }
            if (typeof($scope.redmineApi) != "undefined"){
                window.localStorage.setItem('redmineApi', $scope.redmineApi );
                errorFlag += 1
            }

            // 入力せずに「Next」を押した場合はエラーメッセージ
            if (errorFlag != 2){
                $scope.settingResult = "Please input parameters"
            } else {
                $scope.settingResult = ""
                $state.go('main.settingDetail')
            }
        }
    })
