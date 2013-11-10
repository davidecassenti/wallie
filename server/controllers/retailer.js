var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function index(req, res) {
	res.render('retailer', { title: 'Retailer Space' });
}

function submit(req,res){
	var body = req.body;

	var couponName = body.couponName;
	var couponCode = body.couponCode;
		
	if (!couponName || !couponCode) {
			res.writeHead(400, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Missing Coupon Name, Coupon Code or Campaign Name"
			}));
	}else{
		//make the call
		var baseURL = "http://wallie.wechanged.it/coupon/add";
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (this.readyState == 4) {
				var result = JSON.parse(this.responseText);
				console.log(result);
				
				res.render('couponAdded', { 
					couponName: couponName,
					couponCode: couponCode,
					title: 'Adding your Coupon...'
				});
				res.end();
			}
		}

	    xhr.open('POST', baseURL);
	    xhr.setRequestHeader("Content-Type", "application/json");
	    xhr.send(JSON.stringify({
	    	name: couponName,
	    	code: "004CCC"+couponCode,
	    	campaign_id:1818934906795395
	    }));
	}	
}