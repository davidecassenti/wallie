$.menuButton.addEventListener('click', function(e){
	if(Alloy.Globals.menu == false){
	Alloy.Globals.nav.animate({
		left : 170,
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 150
	});
	Alloy.Globals.menu = true;
	} else {
		Alloy.Globals.nav.animate({
		left : 0,
		curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration : 150
	});
	
	Alloy.Globals.menu = false;
	}
});
