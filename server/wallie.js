var ACS = require('acs').ACS;

var CONFIG = require('nconf');

CONFIG.use('file', {
	file: __dirname + '/config.json'
});
CONFIG.load();

ACS.init(CONFIG.get("acs:key"), CONFIG.get("acs:secret"));

function createUser (req, res, user, pass, fields) {
	ACS.Users.create({
		username: user,
		password: pass,
		password_confirmation: pass,
		custom_fields: fields
	}, function(e) {
		if (e.success) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "User created!"
			}));
		} else {
			console.log("login#signup error: " + JSON.stringify(e));
			res.writeHead(401, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Signup failed, check username and/or password!"
			}));
		}
	});
}

function checkLogin (req, res, callback) {
	ACS.Users.showMe(function(data) {
        if (data.success) {
        	var user = data.users && data.users[0];

        	callback(user);
        } else {
        	res.writeHead(401, {
        	    'Content-Type' : 'application/json'
        	});
        	res.end("{message: 'You better login, dude!'}");
        }
	}, req, res);
}

function getRetailers (req, res, callback) {
	var retailers = {};
	ACS.Objects.query({
		classname: 'retailer'
	}, function(data) {
		if (data.success && data.retailer) {
			for(var rr in data.retailer) {
				var retailer = data.retailer[rr];

				retailers[retailer.code] = {
					code: retailer.code,
					name: retailer.name,
					photo: retailer.photo ? retailer.photo.urls.small_240 : ""
				}
			}
		}

		callback(req, res, retailers);
	}, req, res);
}

function login (req, res, user, pass, callback) {
	ACS.Users.login({
		login: user,
		password: pass
	}, function(data) {
		if (data.success) {
			callback (req, res, true);
		} else {
			callback (req, res, false);
		}
	}, req, res);
}

function logout (req, res, callback) {
	ACS.Users.logout(function(data) {
		if (data.success) {
			callback (req, res, true);
		} else {
			callback (req, res, false);
		}
	}, req, res);
}

exports.createUser = createUser;
exports.checkLogin = checkLogin;
exports.getRetailers = getRetailers;
exports.login = login;
exports.logout = logout;


