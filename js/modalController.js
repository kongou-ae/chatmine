angular.module('hogemine')
    .controller('modalController',function($scope, $http, $resource, $routeParams ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var userAry = []
        var userObj = {}

        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        // とりえあずメンバーは１００人を超えない想定で
        $http.get('http://localhost:8080/'+redmineUrl +'projects/'+$routeParams.projectId+'/memberships.json?limit=100').success(function(data){

            for (var i = 0; i < data.memberships.length; i++) {
                // 初期化
                userObj ={}
                userObj['userId'] = data.memberships[i].user.id;
                userObj['userName'] = data.memberships[i].user.name;
                userAry.push(userObj);
            }
            $scope.Assigns = userAry;
            // 初期選択を明記するエラーになる
            $scope.ticket.Assign = "hoge"
        })

        $scope.createTicket = function(){

            var transform = function(data){
                    return $.param(data);
            }

            var params = {}
            params.project_id = $routeParams.projectId;
            params.subject = $scope.ticket.Name
            params.description = $scope.ticket.description
            //jsonの値に””がつかない
            params.assigned_to_id = $scope.ticket.Assign

            console.log(params)
            $http({
            	method : 'POST',
            	url : 'http://localhost:8080/'+redmineUrl +'issues.json',
            	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            	transformRequest: transform,
            	data: params
            }).success(function(data){
                console.log(data)
            })

        }

    })
