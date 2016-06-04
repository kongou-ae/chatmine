var issueView = {};

issueView.vm = {
    init: function(){
        var credential = login.model.loadCredential()
        var redmineUrl = credential.url
        var redmineApiKey = function(xhr) {
            xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
        };   

        // todo:100件以上表示できるようにする
        issueView.vm.issuesAry = m.prop([]);  
        m.request({
            method: "GET", 
            url: "http://localhost:8080/" + redmineUrl + "/issues.json?limit=100&project_id=" + m.route.param("projectId"),
            config: redmineApiKey }
        ).then(function(responce){
            for (var j = 0; j < responce.issues.length; j++){
                issueView.vm.issuesAry().push(responce.issues[j])
            }
        });           
    }
}

issueView.controller = function(){
    issueView.vm.init()
    modal.controller()
    createTicketModal.controller()
    issueView.vm.mpaginate = new mpaginate.controller(issueView.vm.issuesAry, {
        "rowsPerPage" : "20"
    });
       
}

issueView.view = function() {
    return [
            m("div.sidebar-fixed",[
                m("h1",[
                    m("a",{href:'/project',config:m.route},"Chatmine")
                ]),
                m("h3","TICKET"),
                //todo:更新ボタンをつけるか、チケットを作ったら自動リロードされるようにする
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
                ]),

            ]),
            createTicketModal.view()
    ] 
};