var login = {}

// model
login.model = function(){
    this.redmineUrl = m.prop("");
    this.redmineApiKey = m.prop("");
    this.userName = m.prop("");
}

login.model.saveUrl = function(url){
    localStorage.setItem('redmineUrl', url )
}

login.model.saveApiKey = function(apiKey){
    localStorage.setItem('redmineApiKey', apiKey )
}

login.model.saveUsername = function(Username){
    localStorage.setItem('redmineUsername', Username )
}

login.model.saveCloseid = function(closeId){
    localStorage.setItem('redmeineCloseid', closeId )
}

login.model.loadCredential = function(){
    var credential = {}
    credential.url = localStorage.getItem('redmineUrl')
    credential.key = localStorage.getItem('redmineApiKey')
    credential.userName = localStorage.getItem('redmineUsername')
    credential.closeId = localStorage.getItem('redmeineCloseid')
    return credential
}


login.vm = {
    init: function(){

        //todo:認証情報が保存されているときのログインフローを直す
        var credential = login.model.loadCredential();

        login.vm.loginPhase = m.prop("0");
        login.vm.closeId = m.prop("");
        login.vm.issuesStatus = m.prop([]);

        if (credential.url){
            login.vm.redmineUrl = m.prop(credential.url);
        } else {
            login.vm.redmineUrl = m.prop("");
        }

        if (credential.key){
            login.vm.redmineApiKey = m.prop(credential.key);
        } else {
            login.vm.redmineApiKey = m.prop("");
        }

        login.vm.buildCloseidarray = function(a){
            var tmp = []
            a.map(function(status,idx){
                if ((status.is_closed !== undefined ) && (status.is_closed == true)){
                    tmp.push(status)
                }
            })
            return tmp
        }

        login.vm.submit = function(){
            login.model.saveUrl(login.vm.redmineUrl())
            login.model.saveApiKey(login.vm.redmineApiKey())

            // 入力された認証情報のチェックを実施
            var credential = login.model.loadCredential()
            var redmineApiKey = function(xhr) {
                xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
            };

            m.request({
                method: "GET",
                url: "http://localhost:8080/" + credential.url + "/users/current.json",
                config: redmineApiKey,
                unwrapSuccess: function(a,b) {
                    // ユーザ情報を格納
                    login.model.saveUsername(a.user.login)                    
                    m.request({
                        method: "GET",
                        url:"http://localhost:8080/" + credential.url + "/issue_statuses.json",
                        config: redmineApiKey,
                        unwrapSuccess: function(a,b) {
                            // ステータスIDを保存
                            login.vm.issuesStatus(login.vm.buildCloseidarray(a.issue_statuses))
                            login.vm.loginPhase = m.prop("1");                 
                        }
                    }) 
               }
            })
        }

        login.vm.submit2 = function(){
            if ( login.vm.closeId() !== undefined ){
                login.model.saveCloseid(login.vm.closeId())
                m.route("/project")            
            }
        }
    }
}

login.controller = function(){
    var credential =  login.model.loadCredential()
    var redmineApiKey = function(xhr) {
        xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
    };
    if (credential.url && credential.key.length === 40 && credential.closeId ){
        m.request({
            method: "GET",
            url: "http://localhost:8080/" + credential.url + "/users/current.json",
            config: redmineApiKey,
            unwrapSuccess: function(a,b) {
                m.route("/project")                          
            }
        })
    }
    login.vm.init()
}

login.view = function() {
    
    login.view.selectCloseid = function(){

        if (login.vm.loginPhase() == "1" ){
            return [
                m("div.settingFrom",[
                    m("div.form-horizontal",[
                        m("div.form-group",[
                            m("label","the close code"),
                            m("select.form-control",{
                                onchange:m.withAttr("value",login.vm.closeId)
                            },[
                                m("option",{value:""},"select close code"),
                                login.vm.issuesStatus().map(function(status,idx){
                                    return m("option",{value:status.id},status.name )                                    
                                })
                            ]),
                        ]),
                        m("button.btn btn-default",{
                            //type:'submit',
                            // bind(this)がないと、クリック前に保存が発動する
                            onclick: login.vm.submit2.bind(this)
                        },"Start!!")
                    ])
                ])
            ]
        }
    }
    
    return [
            m("div.sidebar-fixed",[
                m("h1",[
                    m("a",{href:'/',config:m.route},"Chatmine")
                ]),
                m("div.sidebar-list")
            ]),
            m("div.chatSpace",[
                m("h2","Setting"),
                m("div.settingFrom",[
                    //m("form",{method:'POST',enctype:'multipart/form-data',acceptCharset:'UTF-8'},[
                    m("div.form-horizontal",[
                        m("div.form-group",[
                                m("label","Redmine URL"),
                                m("input.form-control",{
                                    oninput:m.withAttr("value", login.vm.redmineUrl),
                                    value:login.vm.redmineUrl()
                                })
                        ]),
                        m("div.form-group",[
                                m("label","Redmine API Key"),
                                m("input.form-control",{
                                    oninput:m.withAttr("value", login.vm.redmineApiKey),
                                    value:login.vm.redmineApiKey()
                                }),
                        ]),                     
                        m("button.btn btn-default",{
                            //type:'submit',
                            // bind(this)がないと、クリック前に保存が発動する
                            onclick: login.vm.submit.bind(this)
                        },"Check the credential!")
                    ]),
                ]),
                login.view.selectCloseid(),
            ])
           ]
};
