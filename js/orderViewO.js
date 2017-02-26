var site_url = "http://www.arishbionaturals.com/sales/";
//var site_url = "http://localhost/sales/";

var order_details_server;

function sync(){
	$("#order_place_panel").hide();	
	$("#order_view_panel").hide();
	$("#syncPanel").css("height", $(window).height());
	$("#syncPanel").show();
	var order_details = localStorage.getItem("order_details");
	
	if(order_details === null || order_details === "null" || typeof order_details === typeof undefined || order_details == "" || order_details == "[]"){
		alert("No pending Orders to upload!");
		$("#order_place_panel").show();
		$("#syncPanel").hide();
		return false;
		//window.location.href = "sale_order_ar.html";
	}
	var order = JSON.parse(order_details);
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

function searchOrderO(){
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
	var dist = $("#distributor_id").val();
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
		url: site_url+'api/get_order_o_api.php',
		data: "d1="+d1+"&d2="+d2+"&dist="+dist+'&upload_id='+user+'&order_no='+order_no_filter,
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				order_details_server = data.orderDetails;
				for(var i=0; i<order_details_server.length; i++){
					view_order_html_server.push('<tr>');
					view_order_html_server.push('<td data-th="Sl No" align="center" class="bg06">'+cnt+'</td>');
					view_order_html_server.push('<td data-th="Orders Received" align="center" class="bg06">'+order_details_server[i].order_no+'</td>');
					view_order_html_server.push('<td data-th="Order Amt" align="center" class="bg06">'+order_details_server[i].totAmnt+'</td>');
					view_order_html_server.push('<td data-th="Payment Amt" align="center" class="bg06">'+order_details_server[i].total_payment_received_amount+'</td>');
					view_order_html_server.push('<td data-th="Order Date" align="center" class="bg06">'+order_details_server[i].order_date+'</td>');
					view_order_html_server.push('<td data-th="Despatche Status (Complete/Partial/No)" align="center" class="bg06">'+order_details_server[i].delivery_status+'</td>');
					view_order_html_server.push('<td data-th="View Details" align="center" class="bg06"><a class="viewClass fancybox" href="#viewOrder" data-orderno="'+order_details_server[i].order_no+'" onclick="openPopUp(this,2,1)">View</a></td>');
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

function openPopUp(elm, type, flag){
	var order_no1 = $(elm).attr("data-orderno");
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	
	if(type===1){
		
	}else{
		var ordet = order_details_server;
		if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet.length === 0){
			alert("Error Occured!");
			return false;
		}else{
			var or_det = ordet;
			for(var i = 0; i<or_det.length; i++)
			{
				if(or_det[i].order_no===order_no1){
					
					//////view order html structure 
					var total_order_amount = parseFloat(or_det[i].totAmnt);
					var order_details = or_det[i].details;
					var product_html = [];
					var free_html = [];
					for(var j=0; j<order_details.length; j++)
					{
						var one_order = order_details[j];
						var one_total = parseFloat(one_order[17])*parseInt(one_order[3]);
						one_total = one_total.toFixed(2);
						product_html.push('<tr id="rowView_'+one_order[19]+'">');
						product_html.push('<td data-th="SL">'+j+'</td>');
						product_html.push('<td data-th="Product Name">'+one_order[20]+'</td>');
						product_html.push('<td data-th="SKU">'+one_order[18]+'</td>');
						product_html.push('<td data-th="Distributor Price">'+one_order[17]+'</td>');
						product_html.push('<td data-th="Oty Ordered" align="center">'+one_order[3]+'</td>');
						product_html.push('<td data-th="Oty Delivered" align="center">'+one_order[21]+'</td>');
						product_html.push('<td data-th="Oty Remains" align="center">'+one_order[22]+'</td>');
						product_html.push('<td data-th="Cancelled Qty" align="center">'+one_order[23]+'</td>');
						product_html.push('<td data-th="Total Price">'+one_total+'</td>');
						product_html.push('</tr>');
						
						if(parseInt(one_order[4])>0){
							free_html.push('<tr>');
							free_html.push('<td data-th="SL">'+j+'</td>');
							free_html.push('<td data-th="Product Name">'+one_order[20]+'</td>');
							free_html.push('<td data-th="SKU">'+one_order[18]+'</td>');
							free_html.push('<td data-th="Free Oty Ordered" align="center">'+one_order[4]+'</td>');
							free_html.push('<td data-th="Free Oty Delivered" align="center">'+one_order[24]+'</td>');
							free_html.push('<td data-th="Free Oty Remains" align="center">'+one_order[25]+'</td>');
							free_html.push('<td data-th="Free Cancelled Qty" align="center">'+one_order[26]+'</td>');
							product_html.push('</tr>');
						}
					}
					
					$("#totalOrderAmount").text(total_order_amount.toFixed(2));
					$("#orderNo").text(or_det[i].order_no);
					$("#distributorName").html(or_det[i].billing_name);
					$("#orderDate").html(or_det[i].order_date);
					if(product_html.length>0){
						$("#orderViewPanelProduct").find("tbody").html(product_html.join(""));
					}else{
						$("#orderViewPanelProduct").find("tbody").html("");
					}
					if(free_html.length>0){
						$("#orderViewPanelProductFree").find("tbody").html(free_html.join(""));
						$("#freeTableZone").show();
					}else{
						$("#orderViewPanelProductFree").find("tbody").html("");
						$("#freeTableZone").hide();
					}
				}
			}
		}
	}
}

function loggedOut(){
	localStorage.setItem("loggedIn", "no");
	localStorage.setItem("user_id", "");
	localStorage.setItem("username", "");
	window.location.href = "index.html";
}