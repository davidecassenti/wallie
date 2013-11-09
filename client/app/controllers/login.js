var loginCallback = function(e) {
	$.login.close();
};

$.acslogin.init({
	loginCallback : loginCallback
}); 