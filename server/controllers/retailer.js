function index(req, res) {
	res.render('retailer', { title: 'Welcome to Node.ACS!' });
}

function submit(req,res){
	body = req.body;

	couponName = 	body.couponName;
	couponCode = 	body.couponCode;
	campaignId = 	1818934906795395;
	retailerLogo = 	body.retailerLogo;
		
	if (!couponName || !couponCode || !campaignId) {
			res.writeHead(400, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify({
				"message": "Oops! Missing Coupon Name, Coupon Code or Campaign Name"
			}));
	}else{
		res.end(JSON.stringify({
			"message": couponName+" "+couponCode+ " "+campaignId
		}));
	}

	res.end;
		
}