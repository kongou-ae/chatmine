var credential = {}
credential.view = function() {
    if (login.vm.credentialError() == "1" ){
        return m("p","Your credential is invalid.")
    }
}