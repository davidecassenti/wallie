var args = arguments[0] || {};
$.companyTitle.text = args.info.text;
$.couponTitle.text = args.es_info.text;
$.companyLogo.image = args.pic.image;

$.mapButton.addEventListener('click', function(e){
	var map = Alloy.createController('map', {}).getView();
	Alloy.Globals.nav.openWindow(map);
});
