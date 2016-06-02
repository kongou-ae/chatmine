var login = {}

// model
login.model = function(){
    this.redmineUrl = m.prop("");
    this.redmineApiKey = m.prop("");
}
    
login.model.saveUrl = function(url){
    localStorage.setItem('redmineUrl', url )        
}
     
login.model.saveApiKey = function(apiKey){
    localStorage.setItem('redmineApiKey', apiKey )        
}

login.model.loadCredential = function(){
    var credential = {}
    credential.url = localStorage.getItem('redmineUrl')
    credential.key = localStorage.getItem('redmineApiKey')
    return credential
}


login.vm = {
    init: function(){       
        
        //todo:認証情報が保存されているときのログインフローを直す 
        
        var credential = login.model.loadCredential()

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
        
        login.vm.credentialError = m.prop("");
        
        login.vm.submit = function(){
            login.vm.credentialError("")
            login.model.saveUrl(login.vm.redmineUrl())  
            login.model.saveApiKey(login.vm.redmineApiKey())
            
            // 入力された認証情報のチェックを実施
            var credential = login.model.loadCredential()
            var redmineApiKey = function(xhr) {
                xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
            };
            
            m.request({
                method: "GET", 
                url: "http://localhost:8080/" + credential.url + "/projects.json",
                config: redmineApiKey,
                unwrapSuccess: function(a,b) {
                    m.route("/project")
                },
                unwrapError: function(a,b) {
                    // Viewにエラーの何かを出す。todo：意図した動きにする
                    login.vm.credentialError("1")
                }
            })                     
        }
    }
}

login.controller = function(){
    var credential = login.model.loadCredential()
    if (credential.url){
        if (credential.key){
            var redmineApiKey = function(xhr) {
                xhr.setRequestHeader("X-Redmine-API-Key", credential.key);
            };
                    
            m.request({
                method: "GET", 
                url: "http://localhost:8080/" + credential.url + "/projects.json",
                config: redmineApiKey,
                unwrapSuccess: function(a,b) {
                    m.route("/project")
                },
                unwrapError: function(a,b) {
                    console.log("error")
                    login.vm.init()
                }
            })             
        }      
    }
    login.vm.init()
}

login.view = function() {
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
                    m("form",[
                        m("div.form-group",[
                            m("div.form-inline",[,
                                m("label","Redmine URL"),
                                m("input",{
                                    oninput:m.withAttr("value", login.vm.redmineUrl),
                                    value:login.vm.redmineUrl()
                                })
                            ]),
                            m("div.form-inline",[
                                m("label","Redmine API Key"),
                                m("input",{
                                    oninput:m.withAttr("value", login.vm.redmineApiKey),
                                    value:login.vm.redmineApiKey()                              
                                })
                            ]),
                            m("div.form-inline",[
                                m("button",{
                                    //type:'submit',
                                    // bind(this)がないと、クリック前に保存が発動する
                                    onclick: login.vm.submit.bind(this)
                                },"Start!")
                            ])
                        ])
                    ]),
                    credential.view()
                ])

            ])
           ]
};