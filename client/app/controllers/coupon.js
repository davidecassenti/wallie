var args = arguments[0] || {};
$.companyTitle.text = args.info.text;
$.couponTitle.text = args.es_info.text;
$.companyLogo.image = args.pic.image;

$.mapButton.addEventListener('click', function(e){
	var map = Alloy.createController('map', {}).getView();
	Alloy.Globals.nav.openWindow(map);
});

$.shareButton.addEventListener('click', function(e){
	var friends = Alloy.createController('friendsList', {
		coupon_id: args.code_info.text
	}).getView();
	Alloy.Globals.nav.openWindow(friends);
});
