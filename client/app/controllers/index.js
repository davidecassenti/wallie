var nav = require("navigation");
nav.win = $.index;

//initialise menu

var menu = Alloy.createController('menu',{}).getView();
//menu.open();

var initLogin = function() {
	var login = Alloy.createWidget("com.appcelerator.acslogin");
	var loginView = login.getView();
	loginView.zIndex = 0;

	var loginCallback = function(e) {
		var couponList = Alloy.createController('couponsList',{}).getView();
		nav.addView(couponList);
	};

	login.init({
		loginCallback : loginCallback
	});
	
	nav.addView(loginView);
};


initLogin();

$.index.open();

