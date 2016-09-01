var issueDetail = {};

issueDetail.vm = {
    init: function(){
        var credential = login.model.loadCredential()
        var redmineUrl = credential.url
        var redmineApiKey = function(xhr) {
            xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
        };
        issueDetail.vm.issuesAry = m.prop([]);
        issueDetail.vm.redmineUrl = m.prop(redmineUrl)
        m.request({
            method: "GET",
            url: "http://localhost:8080/" + redmineUrl + "/issues.json?limit=100&project_id=" + m.route.param("projectId"),
            config: redmineApiKey }
        ).then(function(responce){
            for (var j = 0; j < responce.issues.length; j++){
                issueDetail.vm.issuesAry().push(responce.issues[j])
            }
        });

        issueDetail.vm.issueDetailAry = m.prop();
        m.request({
            method: "GET",
            url: "http://localhost:8080/" + redmineUrl + "/issues/" + m.route.param("issueId") + ".json?include=journals",
            config: redmineApiKey }
        ).then(function(responce){
            console.log(responce.issue.journals)
            responce.issue.journals.sort(function(a,b){
                if(a.id < b.id ) return -1;
                if(a.id > b.id ) return 1;
                return 0
            })

            if ("assigned_to" in responce.issue) {
                issueDetail.vm.issueDetailAry(responce.issue)
            } else {
                responce.issue.assigned_to = {name:"None"}
                issueDetail.vm.issueDetailAry(responce.issue)
            }


        });

        // todo:なんか汚い。もう少しいい感じにしたい
        issueDetail.vm.textarea = m.prop("");
        issueDetail.vm.update = function(){
            var data = {};
            var issue = {};
            issue.notes = issueDetail.vm.textarea()
            data.issue = issue

            if (/:close/.test(issue.notes)){
                data.issue.status_id = credential.closeId
            }

            m.request({
                method: "PUT",
                url: "http://localhost:8080/" + redmineUrl + "/issues/" + m.route.param("issueId") + ".json",
                config: redmineApiKey,
                data: data }
            ).then(function(responce){
                m.request({
                    method: "GET",
                    url: "http://localhost:8080/" + redmineUrl + "/issues/" + m.route.param("issueId") + ".json?include=journals",
                    config: redmineApiKey }
                ).then(function(responce){
                    responce.issue.journals.sort(function(a,b){
                        if(a.id < b.id ) return -1;
                        if(a.id > b.id ) return 1;
                        return 0
                    })
                    if ("assigned_to" in responce.issue) {
                        issueDetail.vm.issueDetailAry(responce.issue)
                        issueDetail.vm.textarea("")
                        scrollToButtom()
                    } else {
                        responce.issue.assigned_to = {name:"None"}
                        issueDetail.vm.issueDetailAry(responce.issue)
                        issueDetail.vm.textarea("")
                        scrollToButtom()
                    }
                });

            });

        }.bind(this)
    }
}

issueDetail.controller = function(){
    issueDetail.vm.init()
    modal.controller()
    createTicketModal.controller()
    issueDetail.vm.mpaginate = new mpaginate.controller(issueView.vm.issuesAry, {
        "rowsPerPage" : "20"
    });

}

function scrollToButtom() {
	$('body').animate({
    	scrollTop: $(document).height()
    },500);
};

issueDetail.view = function() {
    return [
            m("div.sidebar-fixed",[
                m("h1",[
                    m("a",{href:'/project',config:m.route},"Chatmine")
                ]),
                m("h4",projectView.vm.redmineUsername()),
                m("h3","TICKET"),
                modal.view(),
                m("div.sidebar-list",[
                   mpaginate.view(issueView.vm.mpaginate),
                   m("ul",{style:{"padding-left": "0px"}},[
                        issueView.vm.mpaginate.paginated().map(function(item) {
                            return m("li",[
                                m("a",{href:"/project/" + m.route.param("projectId") + "/issue/"+ item.id,config:m.route },[
                                    m("p.issue", "#" + item.id + " " + item.subject)
                                ])
                            ])
                        })
                    ])
                ])
            ]),
            m("div.chatSpace",[
                m("div.ticketSummary",[
                    m("h2",[
                        // todo:target=_blankしたい
                        m("a",{href:issueDetail.vm.redmineUrl()},"#" + issueDetail.vm.issueDetailAry().id + " " + issueDetail.vm.issueDetailAry().subject)
                    ]),
                    m("table",{class:"table table-bordered table-hover"},[
                        m("tbody",[
                            m("tr",[
                                m("th","ステータス"),m("td",issueDetail.vm.issueDetailAry().status.name),
                                m("th","開始日"),m("td",issueDetail.vm.issueDetailAry().start_date)
                            ]),
                            m("tr",[
                                m("th","優先度"),m("td",issueDetail.vm.issueDetailAry().priority.name),
                                m("th","期日"),m("td",issueDetail.vm.issueDetailAry().due_date)
                            ]),
                            m("tr",[
                                m("th","担当者"),m("td",issueDetail.vm.issueDetailAry().assigned_to.name),
                                m("th","進捗"),m("td",issueDetail.vm.issueDetailAry().done_ratio )
                            ])
                        ])
                    ]),
                ]),
                m("div.commentList",[
                    issueDetail.vm.issueDetailAry().journals.map(function(journal){
                        return m("div.comment",[
                            m("p",[
                                m("span.username",journal.user.name + " "),
                                m("span.created_on",journal.created_on)
                            ]),
                            m("p.notes",journal.notes)
                        ])
                    })
                ]),
                m("div.commentEnd"),
                m("div.updateForm",[
                    m("div.form-group",[
                        m("div.form-inline",[
                            m("textarea.form-control",{
                                rows:"3",
                                oninput:m.withAttr("value", issueDetail.vm.textarea),
                                value:issueDetail.vm.textarea(),
                                name:"journal_update",placeholder:""}),
                            m("button.btn.btn-default",{
                                onclick:issueDetail.vm.update
                                },"Update")
                        ])
                    ])

                ])
            ]),
            createTicketModal.view()
        ]
};
