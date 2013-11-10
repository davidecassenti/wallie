/*var one = {
 properties : {
 backgroundColor : "#9bbeaa",
 color : "#fff",
 selectedBackgroundColor: "#60b693",
 title: "My Wallie"
 },
 menuIcon : {
 image : 'http://lorempixel.com/30/30'
 },
 menuTitle : "My Wallie"
 };

 var two = {
 properties : {
 backgroundColor : "#9bbeaa",
 color : "#fff",
 selectedBackgroundColor: "#60b693"
 },
 menuIcon : {
 image : 'http://lorempixel.com/30/30'
 },
 menuTitle : "Market Place"
 };

 var listItems = [one,two];*/

var listItems = [];
for (var i = 0; i < 5; i++) {
	//Here is where we create the listView rows with the data
	
	var title = null;
	
	switch(i){
		case 0: title = "My Wallie"; break;
		case 1: title = "Promotions"; break;
		case 2: title = "Marketplace"; break;
		case 3: title = "Friends"; break;
		case 4: title = "Settings"; break;
	}
	var item = {
		properties: {backgroundSelectedColor: "#60b693",
		backgroundColor: "#9bbeaa"},
		info : {
			text : title
		},
		pic : {
			image : 'http://lorempixel.com/60/60/?' + i
		}
	};
	listItems.push(item);
}

$.vouchersListSection.setItems(listItems);

$.base.open();
