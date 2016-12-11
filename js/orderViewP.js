var site_url = "http://www.arishbionaturals.com/sales/";
//var site_url = "http://localhost/sales/";

var order_details_server;

function sync(){
	$("#order_place_panel").hide();	
	$("#order_view_panel").hide();
	$("#syncPanel").css("height", $(window).height());
	$("#syncPanel").show();
	var order_details = localStorage.getItem("order_details");
	var order = JSON.parse(order_details);
	if(order_details === null || order_details === "null" || typeof order_details === typeof undefined || order_details == "" || order_details == "[]"){
		alert("No pending Orders to upload!");
		$("#order_place_panel").show();
		$("#syncPanel").hide();
		return false;
		//window.location.href = "sale_order_ar.html";
	}
	$.ajax({
		type: 'post',
		url: site_url+'api/order_api.php',
		data: "order="+encodeURIComponent(order_details),
		success: function(msg){
			var data = JSON.parse(msg);
			var placed_order = data.placed_order;
			var error = data.error;

			if(data.status === "success" && placed_order.length>0){
				var order_details = JSON.stringify(data.order_details);
				localStorage.setItem("order_details", order_details);
				alert("Order uploaded successfully! Placed order no is "+placed_order.join(","));
				$("#order_place_panel").show();
				$("#syncPanel").hide();
				return false;								
			}else{
				var order_details = JSON.stringify(data.order_details);
				localStorage.setItem("order_details", order_details);
				alert("Error Occurred! \n Error is "+order_details);
				$("#order_place_panel").show();
				$("#syncPanel").hide();
				return false;
			}
		},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('No Active network Connection is present!');
			$("#order_place_panel").show();
			$("#syncPanel").hide();
			return false;
	    }
	});
}

function searchOrderP(){
	document.getElementById("wrappers").className = "";
	var d1 = $("#datepicker1").val();
	if(d1===""){ alert("Enter From Date!"); return false; }
	var d1e = toEpoch(d1, true);
	var d2 = $("#datepicker2").val();
	if(d2===""){ alert("Enter To Date!"); return false; }
	var d2e = toEpoch(d2, true);
	if(d1e>d2e){
		alert("To Date cannot be smaller than From Date!");
		return false;
	}
	var dist = $("#distributor_name").val();
	if(dist!=""){
		var arr = dist.split("#");
		var billingName = arr[0];
		var dist_id = arr[1];
	}
	var order_no_filter = $("#order_no").val();
	var view_order_html_server = [];
	var cnt = 1;
	
	$.ajax({
		type: 'post',
		url: site_url+'api/get_order_p_api.php',
		data: "d1="+d1+"&d2="+d2+"&dist="+dist+'&upload_id='+user+'&order_no='+order_no_filter,
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				order_details_server = data.orderDetails;
				for(var i=0; i<order_details_server.length; i++){
					view_order_html_server.push('<tr>');
					view_order_html_server.push('<td data-th="Sl No" align="center" class="bg06">'+cnt+'</td>');
					view_order_html_server.push('<td data-th="Product Name" align="center" class="bg06">'+order_details_server[i].product_name+'</td>');
					view_order_html_server.push('<td data-th="Weight" align="center" class="bg06">'+order_details_server[i].sku+'</td>');
					view_order_html_server.push('<td data-th="Order Received Qty" align="center" class="bg06">'+order_details_server[i].total_p+'</td>');
					view_order_html_server.push('<td data-th="Despatched Qty" align="center" class="bg06">'+order_details_server[i].total_d+'</td>');
					view_order_html_server.push('<td data-th="Remaining Qty" align="center" class="bg06">'+order_details_server[i].total_r+'</td>');
					view_order_html_server.push('<td data-th="Cancelled Qty" align="center" class="bg06">'+order_details_server[i].total_c+'</td>');
					view_order_html_server.push('</tr>');
					cnt++;
				}
				if(view_order_html_server.length>0){
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderViewList").find("tbody").prepend(view_order_html_server.join(""));
					$("#orderStatus").text("");
				}else{
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderStatus").text("No order found!");
					//alert("gf");
				}
				setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
			}else{
				if(view_order_html_server.length>0){
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderViewList").find("tbody").prepend(view_order_html_server.join(""));
					$("#orderStatus").text("");
				}else{
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderStatus").text("No order found!");
					//alert("gf");
				}
				setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
			}
		},
	    error: function(XMLHttpRequest, textStatus, errorThrown) {
			if(view_order_html_server.length>0){
				$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
				$("#orderViewList").find("tbody").prepend(view_order_html_server.join(""));
				$("#orderStatus").text("");
			}else{
				$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
				$("#orderStatus").text("No order found!");
				//alert("gf");
			}
			setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	    }
	});
	
	
}

function toEpoch(dt, jY){
	if(jY){
		var formattedDays = dt.split("-");
		var epoch = new Date(formattedDays[2], formattedDays[1] - 1, formattedDays[0]).getTime();
	}else{
		var formattedDays = dt.split("-");
		var epoch = new Date(formattedDays[0], formattedDays[1] - 1, formattedDays[2]).getTime();
	}
	return epoch;
}

function loggedOut(){
	localStorage.setItem("loggedIn", "no");
	localStorage.setItem("user_id", "");
	localStorage.setItem("username", "");
	window.location.href = "index.html";
}