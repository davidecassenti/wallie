var listItems = [];
for (var i = 0; i < 5; i++) {
	//Here is where we create the listView rows with the data
	
	var title = null;
	var image = null;
	
	switch(i){
		case 0: title = "My Wallie"; image="images/icons/heart-icon.png"; break;
		case 1: title = "Promotions"; image="images/icons/plus-icon.png"; break;
		case 2: title = "Marketplace"; image="images/icons/cart-icon.png"; break;
		case 3: title = "Friends"; image="images/icons/share-icon.png"; break;
		case 4: title = "Logout"; image="images/icons/settings-icon.png"; break;
	}
	var item = {
		properties: {backgroundSelectedColor: "#60b693",
		backgroundColor: "#9bbeaa"},
		info : {
			text : title
		},
		pic : {
			image : image
		}
	};
	listItems.push(item);
}

$.vouchersListSection.setItems(listItems);


$.vouchersList.addEventListener('itemclick', function(e){
	
	var control = null;
	var title = null;
	
	switch(e.itemIndex){
		case 0: control = 'couponList'; title="My Wallie"; break;
		case 1: control = 'couponList'; title="Promotions"; break;
		case 2: control = 'couponList'; title="Marketplace"; break;
		case 3: control = 'friendsList'; title="Friends"; break;
		case 4: control = 'login'; title="Logout"; break;
	}
	
	var controller = Alloy.createController(control, {title: title});
	var win = controller.getView();
	Alloy.Globals.nav.close();
	Alloy.Globals.nav = win;
	
	Alloy.Globals.nav.animate({
		left : 0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 150
	});
	
	Alloy.Globals.menu = false;
});

$.base.open();
