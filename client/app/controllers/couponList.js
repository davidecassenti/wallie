
var args = arguments[0] || {};
$.couponList.title = args.title;
//Scrollable view for offers
var scrollItems = [];
for(var j=0; j<5; j++){
	var image = Ti.UI.createImageView({
		image: 'http://lorempixel.com/300/70/?'+i,
		height: 70,
		width: 300
	});
	scrollItems.push(image);
}
$.offers.views = scrollItems;


//Offer List View
var listItems = [];
for(var i=0; i<20; i++){
	//Here is where we create the listView rows with the data
	var item = {properties: {accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE} ,info: {text: 'Harris + Hoole'}, es_info: {text: 'Free Flat white on us!'}, pic: {image: 'http://lorempixel.com/60/60/?'+i}};
	listItems.push(item);
}

$.vouchersListSection.setItems(listItems);

$.vouchersList.addEventListener('itemclick', function(e){
	var detailCoupon = Alloy.createController('coupon', e.section.getItemAt(e.itemIndex)).getView();
	//var item = e.section.getItemAt(e.itemIndex);
	Ti.API.info(e.section.getItemAt(e.itemIndex));
	$.main.openWindow(detailCoupon);
});

$.main.open();
