var site_url = "http://www.arishbionaturals.com/sales/";
//var site_url = "http://localhost/sales/";

$(document).ready(function(){
	var order_no = localStorage.getItem("order_no");
	if(order_no === null || typeof order_no === typeof undefined){
		localStorage.setItem("order_no", "0");
	}
	var loggedIn = localStorage.getItem("loggedIn");
	var user_id = localStorage.getItem("user_id");
	var user = localStorage.getItem("username");
	if(loggedIn === "ok"){
		$.ajax({
			type: 'post',
			url: site_url+'api/distributor_api.php',
			data: "user="+user,
			async: false,
			success: function(msg){
				var data = JSON.parse(msg);
				if(data.status === "success"){
					var distributor_details = JSON.stringify(data.distributor);
					localStorage.setItem("distributor_details", distributor_details);					
				}else{
				/////do nothing
				}
			}
		});
		$.ajax({
			type: 'post',
			url: site_url+'api/orderlist_api.php',
			data: "user="+user,
			async: false,
			success: function(msg){
				var data = JSON.parse(msg);
				if(data.status === "success"){
					var order_no_details = JSON.stringify(data.distributor);
					localStorage.setItem("order_no_details", order_no_details);						
				}else{
					/////do nothing
				}
			}
		});
		$.ajax({
		   type: 'post',
		   url: site_url+'api/product_api.php',
		   data: "",
		   async: false,
		   success: function(msg){
			  var data = JSON.parse(msg);
			  if(data.status === "success"){
				  var prod_details = JSON.stringify(data.product);
				  localStorage.setItem("product_details", prod_details);	
			  }else{
				/////do nothing
			  }
		   }
	    });
		$.ajax({
		   type: 'post',
		   url: site_url+'api/country_state_city_api.php',
		   data: "",
		   async: false,
		   success: function(msg){
			  var data = JSON.parse(msg);
			  if(data.status === "success"){
				  var country_details = JSON.stringify(data.country);
				  var state_details = JSON.stringify(data.state);
				  var city_details = JSON.stringify(data.city);
				  localStorage.setItem("country_details", country_details);
				  localStorage.setItem("state_details", state_details);
				  localStorage.setItem("city_details", city_details);
			  }else{
				/////do nothing
			  }
		   }
	    });
		window.location.href = "sale_order_ar.html";
	}
	$.ajax({
		type: 'post',
		url: site_url+'api/product_api.php',
		data: "",
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				var prod_details = JSON.stringify(data.product);
				localStorage.setItem("product_details", prod_details);
				
			}else{
				/////do nothing
			}
		}
	});
	$.ajax({
	   type: 'post',
	   url: site_url+'api/country_state_city_api.php',
	   data: "",
	   success: function(msg){
		  var data = JSON.parse(msg);
		  if(data.status === "success"){
			  var country_details = JSON.stringify(data.country);
			  var state_details = JSON.stringify(data.state);
			  var city_details = JSON.stringify(data.city);
			  localStorage.setItem("country_details", country_details);
			  localStorage.setItem("state_details", state_details);
			  localStorage.setItem("city_details", city_details);
		  }else{
			/////do nothing
		  }
	   }
	});
	
});