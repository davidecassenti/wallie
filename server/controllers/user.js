var ACS = require('acs').ACS;
var CONFIG = require('nconf');

CONFIG.use('file', {
	file: __dirname + '/../config.json'
});
CONFIG.load();

ACS.init(CONFIG.get("acs:key"), CONFIG.get("acs:secret"));

function login(req, res) {
	console.log('user#login called');


	try {
		var user = req.body.user;
		var pass = req.body.pass;

		if (!user || !pass) {
			res.writeHead(400, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Missing username and/or password!"
			}));
		} else {
			ACS.Users.login({
				login: user,
				password: pass
			}, function(data) {
				if (data.success) {
					res.writeHead(200, {
						"Content-Type": "application/json"
					});
					res.end(JSON.stringify({
						"message": "User logged in!"
					}));
				} else {
					console.log("login#login error: " + JSON.stringify(data));
					res.writeHead(401, {
						"Content-Type": "application/json"
					});
					res.end(JSON.stringify({
						"message": "Oops! Login failed, check credentials!"
					}));
				}
			}, req, res);
		}
	} catch (e) {
		console.log("login#login error: " + JSON.stringify(e));
		res.writeHead(500, {
			"Content-Type": "application/json"
		});
		res.end(JSON.stringify({
			"message": "Oops! Something went wrong with the login: please try again!"
		}));
	}
}

function logout(req, res) {
	console.log('login#logout called');
	ACS.Users.logout(function(data) {
		if (data.success) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "See you next time!"
			}));
		} else {
			console.log("login#logout error: " + JSON.stringify(data));
			res.writeHead(500, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Logout failed for some reason!"
			}));
		}
	}, req, res);
}

function signup(req, res) {
	console.log('user#signup called');

	try {
		console.log(req);
		var user = req.body.user;
		var pass = req.body.pass;
		var confirm = req.body.confirm;

		if (!user || !pass || !confirm) {
			res.writeHead(400, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Missing username and/or password!"
			}));
		} else if (pass != confirm) {
			console.log("login#signup error: passwords mismatch");
			res.writeHead(400, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Signup failed, passwords mismatch!"
			}));
		} else {
			ACS.Users.create({
				username: user,
				password: pass,
				password_confirmation: confirm
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
	} catch (e) {
		console.log("login#signup error: " + JSON.stringify(e));
		res.writeHead(400, {
			"Content-Type": "application/json"
		});
		res.end(JSON.stringify({
			"message": "Oops! Signup failed, check username and/or password!"
		}));
	}
}
