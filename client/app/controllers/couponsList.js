
var nav = require('navigation');


var listItems = [];
for(var i=0; i<20; i++){
	//Here is where we create the listView rows with the data
	var item = {info: {text: 'Harris + Hoole'}, es_info: {text: 'Free Flat white on us!'}, pic: {image: 'http://lorempixel.com/60/60/'}};
	listItems.push(item);
}

$.vouchersListSection.setItems(listItems);

$.vouchersList.addEventListener('itemclick', function(e){
	var detailCoupon = Alloy.createController('coupon', {}).getView();
	nav.win.openWindow(detailCoupon);
});