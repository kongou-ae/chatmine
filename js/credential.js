var credential = {}
credential.view = function() {
    if (login.vm.loginPhase() == "1" ){
        return [
            m("div.settingFrom",[
                m("div.form-group",[
				    m("label","the close code"),
				    m("select.form-control",{
					    onchange:m.withAttr("value",login.vm.closeId)
                    },[
                    login.vm.closeId.map(function(member,idx){
						if (idx == 0){
							return m("option",{selected:"selected",value:member.userId},member.userName + idx + "selected")
						} else {
							return m("option",{value:member.userId},member.userName + idx )
						}
					})
				])
			])	
*/
    }
}
