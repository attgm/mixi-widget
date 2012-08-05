function findGenericPassword (account) {
	if(window.KeychainPlugin){
		var password = KeychainPlugin.findGenericPassword(account, 'mixi widget');
		if(password[0] == 0 && typeof password[1] != 'undefined'){
			return password[1];
		}
	}
	if(widget){
		changedPassword = true;
		return widget.preferenceForKey('password') || '';
	}
	return '';
}


function setGenericPassword (account, password) {
	if(window.KeychainPlugin){
		status = window.KeychainPlugin.addAndModifyGenericPassword(password, account, 'mixi widget');
		if(status[0] == 0){
			if(widget){
				widget.setPreferenceForKey(null, 'password');
			}
			return;
		}
		
	}
	
	if(widget){
		widget.setPreferenceForKey(password, 'password');
	}
}


function removeGenericPassword(account) {
	if(window.KeychainPlugin){
		var status = window.KeychainPlugin.removeGenericPassword(account, 'mixi widget');
	}
}