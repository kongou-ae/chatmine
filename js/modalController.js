angular.module('hogemine')
    .controller('modalController',function($scope, $http, $stateParams,$modalInstance,$state ) {
        var apiKey = window.localStorage.getItem('redmineApi');
        var redmineUrl = window.localStorage.getItem('redmineUrl');
        var userAry = []
        var userObj = {}
        // ここ大事
        $scope.ticket = {}

//        var element = document.getElementById("modal-forcus");
//        element.focus();

        // プルダウンにメンバー一覧を表示する
        $http.defaults.headers.common["X-Redmine-API-Key"] = apiKey;
        // とりえあずメンバーは１００人を超えない想定で。超えたらforで回す
        $http.get('http://localhost:8080/'+redmineUrl +'projects/'+$stateParams.projectId+'/memberships.json?limit=100').success(function(data){

            for (var i = 0; i < data.memberships.length; i++) {
                // 初期化
                userObj ={}
                userObj['userId'] = data.memberships[i].user.id;
                userObj['userName'] = data.memberships[i].user.name;
                userAry.push(userObj);
            }
            $scope.Assigns = userAry;

        })

        // チケット作成ボタンを押したら
        $scope.createTicket = function(){

            var transform = function(data){
                return $.param(data);
            }

            var params = {}
            var issue = {}

            issue.project_id = $stateParams.projectId;
            issue.subject = $scope.ticket.Name
            issue.description = $scope.ticket.Description
            issue.assigned_to_id = $scope.ticket.Assign + ''
            params.issue = issue

            //POSTでissue登録
            $http({
            	method : 'POST',
            	url : 'http://localhost:8080/'+redmineUrl +'issues.json',
            	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            	transformRequest: transform,
            	data: params
            }).success(function(){
                // メッセージを表示
                $scope.createResult  = "Success!!"
                // フォームを初期化
                $scope.ticket.Name = ""
                $scope.ticket.Description = ""
            })

        }

    })
