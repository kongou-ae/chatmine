var createTicketModal = {}

createTicketModal.vm = {
	init: function(){

		var credential = login.model.loadCredential()
        var redmineUrl = credential.url
        var redmineApiKey = function(xhr) {
            xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
        };

		createTicketModal.vm.title = m.prop("")
		createTicketModal.vm.Description =  m.prop("")
		createTicketModal.vm.visible = m.prop(false)
		createTicketModal.vm.membershipAry = m.prop([])
		createTicketModal.vm.selectMember = m.prop()
		createTicketModal.vm.result = m.prop()

		// 作成ボタンを押したときの処理
		createTicketModal.vm.show = function(){
			createTicketModal.vm.visible(true)

			// 前回値を初期化
			createTicketModal.vm.membershipAry([])
			createTicketModal.vm.selectMember("")
			createTicketModal.vm.result("")
			// 担当者一覧を取得するト
            m.request({
                method: "GET",
                url: "http://localhost:8081/" + redmineUrl + "/projects/" + m.route.param("projectId") + "/memberships.json?limit=100",
                config: redmineApiKey,
            }).then(function(responce){
				for (var j = 0; j < responce.memberships.length; j++){

					var userObj ={}
	                userObj['userId'] = responce.memberships[j].user.id;
    	            userObj['userName'] = responce.memberships[j].user.name;
					createTicketModal.vm.membershipAry().push(userObj)
				}
			})

		}.bind(this)

		// ×ボタンを押したときの処理
		createTicketModal.vm.hide = function(){
			createTicketModal.vm.visible(false)
			createTicketModal.vm.title("")
			createTicketModal.vm.Description("")
		}.bind(this)

		// Createボタンを押したときの処理
		createTicketModal.vm.create = function(){
            var data = {};
            var issue = {};
            issue.project_id = m.route.param("projectId")
            issue.subject = createTicketModal.vm.title()
            issue.description = createTicketModal.vm.Description()
			issue.assigned_to_id = createTicketModal.vm.selectMember()
			data.issue = issue

            m.request({
                method: "POST",
                url: "http://localhost:8081/" + redmineUrl + "/issues.json",
                config: redmineApiKey,
                data: data }
            ).then(function(responce){
				// bootstrapのアラートメッセージに変更する
				createTicketModal.vm.result("Create ticket is success.")
				createTicketModal.vm.title("")
				createTicketModal.vm.Description("")
			})
		}.bind(this)
	}
}

createTicketModal.view = function(){
	if (createTicketModal.vm.visible()){
		return m("div.modal-back",[
				m("div.modal",[
					m("div.modal-header",[
						m("button.close",{
							onclick:createTicketModal.vm.hide
						},'×'),
						m("h3","Create New Ticket")
					]),
					m("div.modal-body",[
						m("form",[
							m("div.form-group",[
								m("label","TITLE"),
								m("input.form-control",{
									oninput:m.withAttr("value", createTicketModal.vm.title),
									value:createTicketModal.vm.title()
								})
							]),
							m("div.form-group",[
								m("label","Description"),
								m("input.form-control",{
									oninput:m.withAttr("value", createTicketModal.vm.Description),
									value:createTicketModal.vm.Description()
								})
							]),
							m("div.form-group",[
								m("label","Assing to"),
								m("select.form-control",{
									onchange:m.withAttr("value",createTicketModal.vm.selectMember)},[
									m("option",{value:""},"Select the person in charge"),
									createTicketModal.vm.membershipAry().map(function(member,idx){
										return m("option",{value:member.userId},member.userName)
									})
								]),
							])
						])
					]),
					m("div.modal-footer",[
						m("p.result",createTicketModal.vm.result()),
						m("button.btn.btn-success",{
							onclick:createTicketModal.vm.create
						},'Create'),
					])
				])
			])
	} else {
		return m("div")
	}
}

createTicketModal.controller = function(){
	createTicketModal.vm.init()
}

var modal = {}

modal.vm = {
    init: function(){

	}
}

modal.controller = function(){
	modal.vm.init()
}

modal.view = function() {
	return [
		m("div.create",[
			m("button.btn.btn-default.btn-xs",{
				onclick:createTicketModal.vm.show
			},[
				m("span.glyphicon.glyphicon-pencil")
			])
		]),
	]
}
