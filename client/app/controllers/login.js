
var loginCallback = function(e) {
    var list = Alloy.createController('couponList', {title: "My Wallie"}).getView();
    Alloy.Globals.nav = list;
	$.login.close();
};

$.acslogin.init({
	loginCallback : loginCallback
}); 

$.login.open();
