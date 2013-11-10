var ACS = require('acs').ACS;
var Wallie = require('./wallie');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var CONFIG = require('nconf');

CONFIG.use('file', {
	file: __dirname + '/config.json'
});
CONFIG.load();

ACS.init(CONFIG.get("acs:key"), CONFIG.get("acs:secret"));

var StickyStreet = CONFIG.get("stickystreet");

function call (req, res, params, callback) {
	// create the StickyStreet user
	var baseURL = StickyStreet.base_url;
			
	var query = "";
	for (var p in params) {
	    query += "&" + p + "=" + params[p];
	}

	// sign the request
	query += "&user_id=" + StickyStreet.user_id;
	query += "&user_password=" + StickyStreet.user_password;
	query += "&account_id=" + StickyStreet.account_id;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			var result = JSON.parse(this.responseText);
			if (result && result.status == "success") {
				callback(req, res, result);
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

function createCampaign (req, res, user, pass) {
	call(req, res, {
		type: "campaign_new",
		action: "campaign",
		campaign_type: "buyx",
		campaign_name: user
	}, function(req, res, result) {
		createUser(req, res, user, pass, result.campaign.id);
	});
}

function createUser(req, res, user, pass, campaign_id) {
	StickyStreet.call(req, res, {
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

		Wallie.createUser(res, res, user, pass, fields)
	});
}

exports.call = call;
exports.createCampaign = createCampaign;
