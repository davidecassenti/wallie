var StickyStreet = require('/stickystreet');
var Wallie = require('/wallie');

function login(req, res) {
	console.log('user#login called');

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
		Wallie.login(req, res, user, pass, function (req, res, loggedIn) {
			if (loggedIn) {
				res.writeHead(200, {
					"Content-Type": "application/json"
				});
				res.end(JSON.stringify({
					"message": "User logged in!"
				}));
			} else {
				res.writeHead(401, {
					"Content-Type": "application/json"
				});
				res.end(JSON.stringify({
					"message": "Oops! Login failed, check credentials!"
				}));
			}
		});
	}
}

function logout(req, res) {
	console.log('login#logout called');
	Wallie.logout(req, res, function(req, res, loggedOut) {
		if (loggedOut) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "See you next time!"
			}));
		} else {
			res.writeHead(500, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Logout failed for some reason!"
			}));
		}
	});
}

function signup(req, res) {
	console.log('user#signup called');

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
		StickyStreet.createCampaign(req, res, user, pass);
	}
}
