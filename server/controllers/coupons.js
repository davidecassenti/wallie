var StickyStreet = require('/stickystreet');
var Wallie = require('/wallie');

function list(req, res) {
	console.log('coupons#list called');

	__list(req, res, function(req, res, coupons) {
		if (null !== coupons) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"coupons": coupons.reverse()
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
					if (coupons[cc].coupon_id == coupon_id) {
						var item = coupons[cc];

						var newItem = {
							name: item.name,
							reward_id: item.code
						};

						StickyStreet.call(req, res, {
							type: "campaign_delete",
							action: "item",
							campaign_id: item.campaign_id,
							item_id: item.coupon_id
						}, function(req, res, result) {
							__add(req, res, campaign_id, newItem, function(req, res, result) {
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
	Wallie.checkLogin(req, res, function(user) {
		// get the retailers info
		Wallie.getRetailers (req, res, function (req, res, retailers) {
			if (user.custom_fields && user.custom_fields.code) {
				StickyStreet.call(req, res, {
					type: "customer_info",
					code: user.custom_fields.code
				}, function(req, res, result) {
					var coupons = [];
					// get all the campaigns
					var campaigns = result.campaigns;
					if (campaigns && campaigns.length > 0) {
						for (var cc in campaigns) {
							for (var ii in campaigns[cc].items) {
								var fullItem = campaigns[cc].items[ii];

								var retailer_code = fullItem.reward_id.substring(0, 3);

								var item = {
									name: fullItem.name,
									coupon_id: fullItem.item_id,
									code: fullItem.reward_id,
									campaign_id: campaigns[cc].id,
									retailer: retailers[retailer_code] || {}
								}

								coupons.push(item);
							}
						}
					}

					callback(req, res, coupons);
				});
			} else {
				callback(req, res, null);
			}
		});
    });
}

function add(req, res) {
	console.log(req);
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
	console.log(item);
	StickyStreet.call(req, res, {
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
