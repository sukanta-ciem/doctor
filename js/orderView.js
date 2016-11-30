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

function searchOrder(){
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
	var view_order_html = [];
	var view_order_html_server = [];
	var cnt = 1;
	var order_details = localStorage.getItem("order_details");
	var order = JSON.parse(order_details);
	if(order_details === null || order_details === "null" || typeof order_details === typeof undefined || order_details == "" || order_details == "[]"){
		//no local order
	}else{
		for(var i=0; i<order.length; i++)
		{
			var ode = toEpoch(order[i].order_date, false);
			if(dist!=""){
				if(order[i].order_placed === "Y" && order[i].distributor_id == dist_id && order[i].upload_id === user && ode>=d1e && ode<=d2e){
					var totAmn = 0;
					var ordDetails = order[i].details;
					for(var j=0; j<ordDetails.length; j++){
						var one_order = ordDetails[j];
						var one_total = parseFloat(one_order[17])*parseInt(one_order[3]);
						one_total = one_total.toFixed(2);
						totAmn += parseFloat(one_total);
					}
					var billName = order[i].billing_name;
					var billingName = billName.split("#");
					view_order_html.push('<tr class="bg_blue">');
					view_order_html.push('<td align="center" class="bg06">'+cnt+'</td>');
					view_order_html.push('<td align="center" class="bg06">'+billingName[0]+'</td>');
					view_order_html.push('<td align="center" class="bg06">NA</td>');
					view_order_html.push('<td align="center" class="bg06">'+order[i].order_date+'</td>');
					view_order_html.push('<td align="center" class="bg06" id="totAmnt'+order[i].order_no+'">'+totAmn.toFixed(2)+'</td>');
					view_order_html.push('<td align="center" class="bg06"><a class="viewClass fancybox" href="#viewOrder" data-orderno="'+order[i].order_no+'" onclick="openPopUp(this,1,1)">View</a></td>');
					view_order_html.push('</tr>');
					cnt++;
				}
			}else{
				if(order[i].order_placed === "Y" && order[i].upload_id === user && ode>=d1e && ode<=d2e){
					var totAmn = 0;
					var ordDetails = order[i].details;
					for(var j=0; j<ordDetails.length; j++){
						var one_order = ordDetails[j];
						var one_total = parseFloat(one_order[17])*parseInt(one_order[3]);
						one_total = one_total.toFixed(2);
						totAmn += parseFloat(one_total);
					}
					var billName = order[i].billing_name;
					var billingName = billName.split("#");
					view_order_html.push('<tr class="bg_blue">');
					view_order_html.push('<td align="center" class="bg06">'+cnt+'</td>');
					view_order_html.push('<td align="center" class="bg06">'+billingName[0]+'</td>');
					view_order_html.push('<td align="center" class="bg06">NA</td>');
					view_order_html.push('<td align="center" class="bg06">'+order[i].order_date+'</td>');
					view_order_html.push('<td align="center" class="bg06" id="totAmnt'+order[i].order_no+'">'+totAmn.toFixed(2)+'</td>');
					view_order_html.push('<td align="center" class="bg06"><a class="viewClass fancybox" href="#viewOrder" data-orderno="'+order[i].order_no+'" onclick="openPopUp(this,1,1)">View</a></td>');
					view_order_html.push('</tr>');
					cnt++;
				}
			}
		}
	}
	$.ajax({
		type: 'post',
		url: site_url+'api/get_order_api.php',
		data: "d1="+d1+"&d2="+d2+"&dist="+dist+'&upload_id='+user,
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				order_details_server = data.orderDetails;
				for(var i=0; i<order_details_server.length; i++){
					view_order_html_server.push('<tr>');
					view_order_html_server.push('<td align="center" class="bg06">'+cnt+'</td>');
					view_order_html_server.push('<td align="center" class="bg06">'+order_details_server[i].billing_name+'</td>');
					view_order_html_server.push('<td align="center" class="bg06">'+order_details_server[i].order_no+'</td>');
					view_order_html_server.push('<td align="center" class="bg06">'+order_details_server[i].order_date+'</td>');
					view_order_html_server.push('<td align="center" class="bg06">'+order_details_server[i].totAmnt+'</td>');
					view_order_html_server.push('<td align="center" class="bg06"><a class="viewClass fancybox" href="#viewOrder" data-orderno="'+order_details_server[i].order_no+'" onclick="openPopUp(this,2,1)">View</a></td>');
					view_order_html_server.push('</tr>');
					cnt++;
				}
				if(view_order_html.length>0 || view_order_html_server.length>0){
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderViewList").find("tbody").prepend(view_order_html_server.join(""));
					$("#orderViewList").find("tbody").prepend(view_order_html.join(""));
					$("#orderStatus").text("");
				}else{
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderStatus").text("No order found!");
					//alert("gf");
				}
				setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
			}else{
				if(view_order_html.length>0 || view_order_html_server.length>0){
					$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
					$("#orderViewList").find("tbody").prepend(view_order_html_server.join(""));
					$("#orderViewList").find("tbody").prepend(view_order_html.join(""));
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
			if(view_order_html.length>0 || view_order_html_server.length>0){
				$("#orderViewList").find("tbody tr").not("#summeryRow").remove();
				$("#orderViewList").find("tbody").prepend(view_order_html_server.join(""));
				$("#orderViewList").find("tbody").prepend(view_order_html.join(""));
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
		var ordet = localStorage.getItem("order_details");
		if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
			alert("Error Occured!");
			return false;
		}else{
			var or_det = JSON.parse(ordet);
			for(var i = 0; i<or_det.length; i++)
			{
				if(or_det[i].order_no===parseInt(order_no1)){
					
					//////view order html structure
					var total_order_amount = 0;
					var order_details = or_det[i].details;
					var product_html = [];
					var free_html = [];
					for(var j=0; j<order_details.length; j++)
					{
						var one_order = order_details[j];
						var one_total = parseFloat(one_order[17])*parseInt(one_order[3]);
						one_total = one_total.toFixed(2);
						total_order_amount += parseFloat(one_total);
						product_html.push('<tr id="rowView_'+one_order[19]+'">');
						product_html.push('<td data-th="SL">'+j+'</td>');
						product_html.push('<td data-th="Product Name">'+one_order[20]+'</td>');
						product_html.push('<td data-th="SKU">'+one_order[18]+'</td>');
						product_html.push('<td data-th="Distributor Price">'+one_order[17]+'</td>');
						product_html.push('<td data-th="Oty Ordered" align="center"><input type="text" type="text" style="width:50px; text-align:center;" value="'+one_order[3]+'" onchange="changeProductQty(this,'+one_order[19]+','+one_order[3]+','+order_no1+')"></td>');
						product_html.push('<td data-th="Total Price">'+one_total+'</td>');
						product_html.push('<td data-th="Remove" align="center"><a onclick="removeProductQty('+one_order[19]+','+order_no1+')" href="javascript: void(0)">Remove</a></td>');
						product_html.push('</tr>');
						
						if(parseInt(one_order[4])>0){
							free_html.push('<tr>');
							free_html.push('<td data-th="SL">'+j+'</td>');
							free_html.push('<td data-th="Product Name">'+one_order[20]+'</td>');
							free_html.push('<td data-th="SKU">'+one_order[18]+'</td>');
							free_html.push('<td data-th="Free Oty Ordered" align="center"><input type="text" type="text" style="width:50px; text-align:center;" value="'+one_order[4]+'" onchange="changeProductFreeQty(this,'+one_order[19]+','+one_order[4]+','+order_no1+')"></td>');
							product_html.push('</tr>');
						}
					}
					
					$("#totalOrderAmount").text(total_order_amount.toFixed(2));
					$("#totAmnt"+order_no1).text(total_order_amount.toFixed(2));
					$("#orderNo").text("NA");
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
						product_html.push('<td data-th="Oty Ordered" align="center"><input type="text" type="text" style="width:50px; text-align:center;" value="'+one_order[3]+'" readonly="readonly"></td>');
						product_html.push('<td data-th="Total Price">'+one_total+'</td>');
						product_html.push('<td data-th="Remove" align="center">NA</td>');
						product_html.push('</tr>');
						
						if(parseInt(one_order[4])>0){
							free_html.push('<tr>');
							free_html.push('<td data-th="SL">'+j+'</td>');
							free_html.push('<td data-th="Product Name">'+one_order[20]+'</td>');
							free_html.push('<td data-th="SKU">'+one_order[18]+'</td>');
							free_html.push('<td data-th="Free Oty Ordered" align="center"><input type="text" type="text" style="width:50px; text-align:center;" value="'+one_order[4]+'" readonly="readonly"></td>');
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

function removeProductQty(order_count, order_no1){
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
		alert("Error Occured!");
	}else{
		var or_det = JSON.parse(ordet);
		for(var i = 0; i<or_det.length; i++)
		{
			if(or_det[i].order_no===order_no1){
				var prev_order_details = or_det[i].details;
				for(var j=0; j<prev_order_details.length; j++)
				{
					var prev_one_order = prev_order_details[j];
					if(prev_one_order[19]===order_count){
						prev_order_details.splice(j, 1);
					}
				}
				
				or_det[i].details = prev_order_details;
				or_det_string = JSON.stringify(or_det);
				localStorage.setItem("order_details", or_det_string);
				$("#rowView_"+order_count).remove();
				updatePrice(order_no1);
				_xyz.fancybox.close();
				alert("Product Removed Successfully!");
			}
		}
	}
}

function changeProductQty(dis, order_count, oldQty, order_no1){
	var changeQty = $(dis).val();
	var r=confirm("Do you want to change the Product Qty '"+changeQty+"' ?");
	if(r==true)
	{
		var regex=/^[0-9]+$/;
		if(changeQty=='')
		{
			alert("Enter Oty!");
			return false;
		}
		else if(!changeQty.match(regex))
		{
			alert("Must input numbers");
			return false;
		}
		document.getElementById("wrappers").className = "";
		setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
		var ordet = localStorage.getItem("order_details");
		if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
			alert("Error Occured!");
		}else{
			var or_det = JSON.parse(ordet);
			for(var i = 0; i<or_det.length; i++)
			{
				if(or_det[i].order_no===order_no1){
					var prev_order_details = or_det[i].details;
					for(var j=0; j<prev_order_details.length; j++)
					{
						var prev_one_order = prev_order_details[j];
						if(prev_one_order[19]===order_count){
							prev_one_order[3] = changeQty;
							prev_order_details[j] = prev_one_order;
						}
					}
					
					or_det[i].details = prev_order_details;
					or_det_string = JSON.stringify(or_det);
					localStorage.setItem("order_details", or_det_string);
					updatePrice(order_no1);
					_xyz.fancybox.close();
				}
			}
		}
	}else{
		$(dis).val(oldQty);
	}
}

function changeProductFreeQty(dis, order_count, oldQty, order_no1){
	var changeQty = $(dis).val();
	var r=confirm("Do you want to change the Free Qty '"+changeQty+"' ?");
	if(r==true)
	{
		var regex=/^[0-9]+$/;
		if(changeQty=='')
		{
			alert("Enter Oty!");
			return false;
		}
		else if(!changeQty.match(regex))
		{
			alert("Must input numbers");
			return false;
		}
		document.getElementById("wrappers").className = "";
		setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
		var ordet = localStorage.getItem("order_details");
		if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
			alert("Error Occured!");
		}else{
			var or_det = JSON.parse(ordet);
			for(var i = 0; i<or_det.length; i++)
			{
				if(or_det[i].order_no===order_no1){
					var prev_order_details = or_det[i].details;
					for(var j=0; j<prev_order_details.length; j++)
					{
						var prev_one_order = prev_order_details[j];
						if(prev_one_order[19]===order_count){
							prev_one_order[4] = changeQty;
							prev_order_details[j] = prev_one_order;
						}
					}
					
					or_det[i].details = prev_order_details;
					or_det_string = JSON.stringify(or_det);
					localStorage.setItem("order_details", or_det_string);
					updatePrice(order_no1);
					_xyz.fancybox.close();
				}
			}
		}
	}else{
		$(dis).val(oldQty);
	}
}

function updatePrice(order_no1)
{
	var order_details = localStorage.getItem("order_details");
	var order = JSON.parse(order_details);
	if(order_details === null || order_details === "null" || typeof order_details === typeof undefined || order_details == "" || order_details == "[]"){
		//no local order
	}else{
		for(var i=0; i<order.length; i++)
		{
			if(order[i].order_no===order_no1){
				var totAmn = 0;
				var ordDetails = order[i].details;
				for(var j=0; j<ordDetails.length; j++){
					var one_order = ordDetails[j];
					var one_total = parseFloat(one_order[17])*parseInt(one_order[3]);
					one_total = one_total.toFixed(2);
					totAmn += parseFloat(one_total);
				}
				$("#totAmnt"+order_no1).text(totAmn.toFixed(2));
			}
		}
	}
}