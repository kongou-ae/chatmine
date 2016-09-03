var projectView = {};

projectView.vm = {
    init: function(){
        var credential = login.model.loadCredential()
        var redmineUrl = credential.url
        projectView.vm.redmineUsername = m.prop(credential.userName)

        var redmineApiKey = function(xhr) {
            xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
        };

        //todo:100件以上取得できるようにする
        projectView.vm.projectAry = m.prop([]);
        m.request({
            method: "GET",
            url: "http://localhost:8081/" + redmineUrl + "/projects.json?limit=100",
            config: redmineApiKey }
        ).then(function(responce){
            var page = Math.ceil(responce.total_count / 100)
            // これは同期処理になってるのか？？
            for (var i = 0; i < page; i++ ){
                m.request({
                    method: "GET",
                    url: "http://localhost:8081/" + redmineUrl + "/projects.json?limit=100" + "&page=" + (i + 1),
                    config: redmineApiKey }
                ).then(function(responce){
                    for (var j = 0; j < responce.projects.length; j++){
                        projectView.vm.projectAry().push(responce.projects[j])
                    }
                    // ソートする
                    projectView.vm.projectAry().sort(function(a,b){
                        if(a.id < b.id ) return -1;
                        if(a.id > b.id ) return 1;
                        return 0
                    })
                })
            }
        });
    }
}

projectView.controller = function(){
    projectView.vm.init()
    projectView.vm.mpaginate = new mpaginate.controller(projectView.vm.projectAry, {
        "rowsPerPage" : "20"
    });
}

projectView.view = function() {
    return [
            m("div.sidebar-fixed",[
                m("h1",[
                    m("a",{href:'/',config:m.route},"Chatmine")
                ]),
                m("h4",projectView.vm.redmineUsername()),
                m("h3","PROJECT"),
                m("div.sidebar-list",[
                    mpaginate.view(projectView.vm.mpaginate),
                    m("ul",{style:{"padding-left": "0px"}},[
                        projectView.vm.mpaginate.paginated().map(function(item) {
                            return m("li",[
                                m("a",{href:"/project/"+ item.id,config:m.route },[
                                    m("p.project", "#" + item.id + " " + item.name)
                                ])
                            ])
                        })
                    ])
                ])
            ])
    ]
};
