var nav ={
	win: null,
	views: [],
	addView: function(view){
		this.views.push(view);
		this.win.add(view);
	},
	
};

module.exports = nav;
