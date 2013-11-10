var ACS = require('acs').ACS;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var CONFIG = require('nconf');

CONFIG.use('file', {
	file: __dirname + '/../config.json'
});
CONFIG.load();

ACS.init(CONFIG.get("acs:key"), CONFIG.get("acs:secret"));

var StickyStreet = CONFIG.get("stickystreet");

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
		__createStickyStreetCampaign(req, res, user, pass);
	}
}

function __createStickyStreetCampaign(req, res, user, pass) {
	__buildStickyStreetCall(req, res, {
		user_id: StickyStreet.user_id,
		user_password: StickyStreet.user_password,
		account_id: StickyStreet.account_id,
		type: "campaign_new",
		action: "campaign",
		campaign_type: "buyx",
		campaign_name: user
	}, function(req, res, result) {
		__createStickyStreetUser(req, res, user, pass, result.campaign.id);
	});
}

function __createStickyStreetUser(req, res, user, pass, campaign_id) {
	__buildStickyStreetCall(req, res, {
		user_id: StickyStreet.user_id,
		user_password: StickyStreet.user_password,
		account_id: StickyStreet.account_id,
		type: "record_customer",
		customer_action: "new",
		card_number_generate: 16,
		send_no_email: true,
		campaign_id: campaign_id
	}, function(req, res, result) {
		var fields = {
			"code": result.customer.code,
			"card_number": result.customer.card_number,
			"campaign_id": campaign_id
		};

		__createACSUser(res, res, user, pass, fields)
	});
}

function __createACSUser(req, res, user, pass, fields) {
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

function __buildStickyStreetCall(req, res, params, callback) {
	// create the StickyStreet user
	var baseURL = StickyStreet.base_url;
			
	var query = "";
	for (var p in params) {
	    query += "&" + p + "=" + params[p];
	}

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			var result = JSON.parse(this.responseText);
			if (result && result.status == "success") {
				callback(result);
			} else {
				res.writeHead(400, {
					"Content-Type": "application/json"
				});
				res.end(JSON.stringify({
					"message": "Something went wrong..."
				}));
			}
		}
	}

    xhr.open('GET', baseURL + query);
    xhr.send();
}