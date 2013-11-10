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
var xhr = Ti.Network.createHTTPClient({
	onload : function(e) {
		var response = JSON.parse(this.responseText);
		var coupons = response.coupons ? response.coupons : [];

		for (var c = 0; c < coupons.length; c++) {
			var coupon = coupons[c];
			
			var item = {
				properties : {
					accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
				},
				info : {
					text : coupon.retailer.name || ''
				},
				es_info : {
					text : coupon.name
				},
				pic : {
					image : coupon.retailer.photo || 'http://lorempixel.com/60/60?r=' + Math.random()
				}
			};
			listItems.push(item);
		}
		
		$.vouchersListSection.setItems(listItems);
	}
});
xhr.open('GET', 'http://wallie.wechanged.it/coupons');
xhr.send();

$.vouchersList.addEventListener('itemclick', function(e) {
	var detailCoupon = Alloy.createController('coupon', e.section.getItemAt(e.itemIndex)).getView();
	//var item = e.section.getItemAt(e.itemIndex);
	Ti.API.info(e.section.getItemAt(e.itemIndex));
	$.main.openWindow(detailCoupon);
});

$.main.open();
