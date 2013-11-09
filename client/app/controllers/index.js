var nav = require('navigation');
nav.win = $.main;

var initLogin = function(){
	var login = Alloy.createController('login', {}).getView();
	login.open();
};


initLogin();


$.main.open();
