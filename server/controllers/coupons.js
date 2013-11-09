var ACS = require('acs').ACS;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var CONFIG = require('nconf');

CONFIG.use('file', {
	file: __dirname + '/../config.json'
});
CONFIG.load();

ACS.init(CONFIG.get("acs:key"), CONFIG.get("acs:secret"));

var StickyStreet = CONFIG.get("stickystreet");

function __checkLogin(req, res, callback) {
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

function list(req, res) {
	console.log('coupons#list called');

	__list(req, res, function(req, res, coupons) {
		if (null !== coupons) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"coupons": coupons
			}));
		} else {
			res.writeHead(400, {
			    'Content-Type' : 'application/json'
			});
			res.end("{message: 'Invalid request. Something is wrong here!'}");	
		}
	});
}

function share(req, res) {
	console.log('coupons#share called');

	var campaign_id = req.body.campaign_id;
	var coupon_id = req.body.coupon_id;

	if (campaign_id && coupon_id) {
		// get the friend
		__list(req, res, function(req, res, coupons) {
			if (null !== coupons) {
				for (var cc in coupons) {
					if (coupons[cc].item_id == coupon_id) {
						var item = coupons[cc];

						__buildStickyStreetCall(req, res, {
							user_id: StickyStreet.user_id,
							user_password: StickyStreet.user_password,
							account_id: StickyStreet.account_id,
							type: "campaign_delete",
							action: "item",
							campaign_id: item.campaign_id,
							item_id: item.item_id
						}, function(req, res, result) {
							__add(req, res, campaign_id, item, function(req, res, result) {
								res.writeHead(200, {
									"Content-Type": "application/json"
								});
								res.end(JSON.stringify({}));
							});
						});

						return;
					}
				}

				res.writeHead(400, {
				    'Content-Type' : 'application/json'
				});
				res.end("{message: 'Coupon not valid. Try again!'}");
			} else {
				res.writeHead(400, {
				    'Content-Type' : 'application/json'
				});
				res.end("{message: 'You have no coupons to share!'}");	
			}
		});
	} else {
		res.writeHead(400, {
		    'Content-Type' : 'application/json'
		});
		res.end("{message: 'Invalid request. Something is wrong here!'}");	
	}
}

function __list(req, res, callback) {
	__checkLogin(req, res, function(user) {
    	if (user.custom_fields && user.custom_fields.code) {
    		var baseURL = StickyStreet.base_url;

    		var params = {
    			user_id: StickyStreet.user_id,
    			user_password: StickyStreet.user_password,
    			account_id: StickyStreet.account_id,
    			type: "customer_info",
    			code: user.custom_fields.code
    		};

    		var query = "";
    		for (var p in params) {
    		    query += "&" + p + "=" + params[p];
    		}

    		var xhr = new XMLHttpRequest();
    	    xhr.onreadystatechange = function() {
    			if (this.readyState == 4) {
    				try {
    					var result = JSON.parse(this.responseText);
    					if (result && result.status == "success") {
    						var coupons = [];
    						// get all the campaigns
    						var campaigns = result.campaigns;
    						if (campaigns && campaigns.length > 0) {
    							for (var cc in campaigns) {
    								for (var ii in campaigns[cc].items) {
    									var item = campaigns[cc].items[ii];
    									item.campaign_id = campaigns[cc].id;
    									coupons.push(item);
    								}
    							}
    						}

    						callback(req, res, coupons);
    					}
    				} catch(e) {
    					callback(req, res, null);
    				}
    	        }
    	    };

    	    xhr.open('GET', baseURL + query);
    	    xhr.send();
    	} else {
    		callback(req, res, null);
    	}
    });
}

function add(req, res) {
	var item = {
		name: req.body.name,
		reward_id: req.body.code
	};

	__add(req, res, req.body.campaign_id, item, function(req, res, result) {
		res.writeHead(200, {
			"Content-Type": "application/json"
		});
		res.end(JSON.stringify({}));
	});
}

function __add(req, res, campaign_id, item, callback) {
	__buildStickyStreetCall(req, res, {
		user_id: StickyStreet.user_id,
		user_password: StickyStreet.user_password,
		account_id: StickyStreet.account_id,
		type: "campaign_new",
		action: "item",
		reward_level: 1,
		campaign_id: campaign_id,
		item_description: item.name,
		item_identifier: item.reward_id
	}, function(req, res, result) {
		callback(req, res, result);
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