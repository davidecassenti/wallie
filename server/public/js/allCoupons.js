$(document).ready(function(){
	$(".viewCoupons").click(function(e){
		//hide form
		var container = $(".wallieContainer");
		$(".wallieContainer form").fadeOut();

		//prepare ajax call
		$.ajax({
		  url: "http://wallie.wechanged.it/coupons",
		  //beforeSend: function( xhr ) {
		    //xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		  //}
		})
		  .done(function( data ) {
		    if ( console && console.log ) {
		      console.log( "Sample of data:", data.slice( 0, 100 ) );
		      container.append("ciao");
		    }
		  });
		e.preventDefault();
	});
});