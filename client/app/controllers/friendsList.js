var args = arguments[0] || {};

var coupon_id = args.coupon_id || null;

var type = coupon_id ? Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE : Ti.UI.LIST_ACCESSORY_TYPE_NONE;

//Scrollable view for offers
var scrollItems = [];
for (var j = 0; j < 5; j++) {
	var image = Ti.UI.createImageView({
		image : 'http://lorempixel.com/300/70/?' + j,
		height : 70,
		width : 300
	});
	scrollItems.push(image);
}
$.offers.views = scrollItems;

//Offer List View
var listItems = [];
var item = {
	properties : {
		accessoryType : type,
		height : 80
	},
	info : {
		text : ""
	},
	es_info : {
		text : "Betty"
	},
	pic : {
		image : "https://pbs.twimg.com/profile_images/1896815065/set.jpeg"
	}
};

listItems.push(item);

var item = {
	properties : {
		accessoryType : type,
		height : 80
	},
	info : {
		text : ""
	},
	es_info : {
		text : "Davide"
	},
	pic : {
		image : "https://pbs.twimg.com/profile_images/3413188323/569abaf70c2db9aeee2a23d0f7f5ac93.jpeg"
	}
};

listItems.push(item);

var item = {
	properties : {
		accessoryType : type,
		height : 80
	},
	info : {
		text : ""
	},
	es_info : {
		text : "Morena"
	},
	pic : {
		image : "https://pbs.twimg.com/profile_images/2524188757/53fzlr8c96axtul13oph.jpeg"
	}
};

listItems.push(item);

$.vouchersListSection.setItems(listItems);

$.vouchersList.addEventListener('itemclick', function(e) {
	if (null !== coupon_id) {
		var xhr = Ti.Network.createHTTPClient({
			onload : function(e) {
				Ti.API.info(JSON.stringify(this.responseText));
				if (200 == this.status) {
					alert("Coupon sent to your friend!");
				} else {
					alert("Oops, something went wrong...");
				}
				
				$.main.close();
			}
		});
		xhr.open('POST', 'http://wallie.wechanged.it/coupon/share');
		xhr.send({
			campaign_id: "5991732392691560",
			coupon_id: coupon_id
		});
	}
});

$.main.open();
