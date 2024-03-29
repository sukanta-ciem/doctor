var site_url = "http://www.arishbionaturals.com/sales/";
//var site_url = "http://localhost/sales/";
var addInStock = true;
var order_no = parseInt(localStorage.getItem("order_no")) + 1;
var order_count = 0;
var reset_count = 0;

$(document).ready(function(){
	$("#order_no").val(order_no);
	$("#order_no_invalid_process").val(order_no);
	sync();
});

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
				//alert("Error Occurred!");
				/*var r = confirm("Do you want to clear all incomplete order?");
				if(r==true){
					localStorage.setItem("order_details","");
					alert("Incomplete Orders cleared successfully!");
					window.location.href = "sale_order_ar.html";
				}*/
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

function clearOrder(){
	var r = confirm("Do you want to clear all pending order?");
	if(r==true){
		localStorage.setItem("order_details","");
		alert("All pending Orders cleared successfully!");
		window.location.href = "sale_order_ar.html";
	}
}

function addInList(){
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	var d = new Date();
	var dd = d.getDate();
	var mm = d.getMonth()+1; //January is 0!
	
	var yyyy = d.getFullYear();
	if(dd<10){
		dd='0'+dd
	} 
	if(mm<10){
		mm='0'+mm
	} 
	var today = yyyy+'-'+mm+'-'+dd;
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var totime = h+':'+m+':'+s;
	
	var proName = $("#prod_id").val().split("#");
	
	var distributor_name = $("#distributor_name").val();
	var cred_amnt = $("#credit_note").val();
	var email = $("#email").val();
	var contact_no = $("#contact_no").val();
	var special_distributor = $("#special_distributor").val();
	var dist_id = $("#distributor_id").val();
	var delivery_date = $("#datepicker1").val();
	
	var sku = $("#sku").val();
	var product_id = $("#product_id").val();
	var product_mf_id = $("#product_mf_id").val();
	var size_id = $("#qty_id").val();
	var qty = $("#product_qty").val();
	var free_qty = $("#free_qty").val();
	var ean_no = $("#ean_no").val();
	var mrp = $("#mrp").val();
	var base_purchase_price = $("#base_purchase_price").val();
	var distributor_unit_price = $("#distributor_unit_price").val();
	var vat_percentage_inp = $("#vat_percentage_inp").val();
	var vat_amnt_inp = $("#vat_amnt_inp").val();
	var cst_percentage_inp = $("#cst_percentage_inp").val();
	var cst_amnt_inp = $("#cst_amnt_inp").val();
	var exise_state_percentage_inp = $("#exise_state_percentage_inp").val();
	var exise_state_amnt_inp = $("#exise_state_amnt_inp").val();
	var exise_central_percentage_inp = $("#exise_central_percentage_inp").val();
	var exise_central_amnt_inp = $("#exise_central_amnt_inp").val();
	var distributor_price = $("#distributor_price").val();
	
	var one_order_det = [product_id, product_mf_id, size_id, qty, free_qty, ean_no, mrp, base_purchase_price, distributor_unit_price, vat_percentage_inp, vat_amnt_inp, cst_percentage_inp, cst_amnt_inp, exise_state_percentage_inp, exise_state_amnt_inp, exise_central_percentage_inp, exise_central_amnt_inp, distributor_price, sku, order_count, proName[0]];
	
	if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
		var or_det = [];
		var product_qty = $("#product_qty").val();
		if(product_qty == "" || product_qty == 0){
			alert("Enter Product Quantity!");
			return false;
		}else{
			var orderDetails = {
				"order_no" : order_no,
				"order_date" : today,
				"order_time" : totime,
				"distributor_id" : dist_id,
				"upload_id" : user,
				"billing_name" : distributor_name,
				"billing_contact_no" : contact_no,
				"billing_email" : email,
				"delivery_date" : delivery_date,
				"remarks" : "",
				"order_placed" : "N",
				"details" : []
			};
			var ordTls = orderDetails.details;
			ordTls.push(one_order_det);
			or_det.push(orderDetails);
			or_det_string = JSON.stringify(or_det);
			localStorage.setItem("order_details", or_det_string);
			localStorage.setItem("order_no", order_no);
		}
	}else{
		var or_det = JSON.parse(ordet);
		if(product_qty == "" || product_qty == 0){
			alert("Enter Product Quantity!");
			return false;
		}else{
			var already_not_exist = true;
			for(var j = 0; j<or_det.length; j++)
			{
				if(or_det[j].order_no===order_no){
					already_not_exist = false;
					var prev_order_details = or_det[j].details;
					prev_order_details.push(one_order_det);
					or_det[j].details = prev_order_details;
					or_det_string = JSON.stringify(or_det);
					localStorage.setItem("order_details", or_det_string);
				}
			}
			
			if(already_not_exist){
				var orderDetails = {
					"order_no" : order_no,
					"order_date" : today,
					"order_time" : totime,
					"distributor_id" : dist_id,
					"upload_id" : user,
					"billing_name" : distributor_name,
					"billing_contact_no" : contact_no,
					"billing_email" : email,
					"delivery_date" : delivery_date,
					"remarks" : "",
					"order_placed" : "N",
					"details" : []
				};
				var ordTls = orderDetails.details;
				ordTls.push(one_order_det);
				or_det.push(orderDetails);
				or_det_string = JSON.stringify(or_det);
				localStorage.setItem("order_details", or_det_string);
				localStorage.setItem("order_no", order_no);
			}
		}
	}
	
	var orderHtml = [];
	orderHtml.push('<tr id="row_'+order_count+'">');
	orderHtml.push('<td align="center" class="bg06">'+proName[0]+'<br>(Weight: '+sku+')</td>');
	orderHtml.push('<td align="center" class="bg06">'+distributor_price+'</td>');
	orderHtml.push('<td align="center" class="bg06">'+qty+'</td>');
	orderHtml.push('<td align="center" class="bg06">'+free_qty+'</td>');
	orderHtml.push('<td align="center" class="bg06"><a style="text-decoration:none;" onClick="removeProduct('+order_no+','+order_count+');" href="javascript:void(0)">x</a></td>');
	orderHtml.push("</tr>");
	
	var prevOrderAmnt = $("#orderTotalList").text();
	prevOrderAmnt = parseFloat(prevOrderAmnt);
	var currentOrderAmnt = parseFloat(distributor_price)*parseInt(qty);
	var newOrderAmnt = prevOrderAmnt+currentOrderAmnt;
	newOrderAmnt = newOrderAmnt.toFixed(2);
	$("#orderTotalList").text(newOrderAmnt);
	
	if(orderHtml.length>0){
		$("#orderView").find("tbody").append(orderHtml.join(""));
		$("#orderView").find("tfoot").show();
	}
	
	document.getElementById("orderForm").reset();
	order_count++;
	
	$("#distributor_name").val(distributor_name);
	$("#distributor_name").attr("readonly", true);
	$("#credit_note").val(cred_amnt);
	$("#email").val(email);
	$("#contact_no").val(contact_no);
	$("#special_distributor").val(special_distributor);
	$("#distributor_id").val(dist_id);
}

function resetForm(){
	var distributor_name = $("#distributor_name").val();
	var cred_amnt = $("#credit_note").val();
	var email = $("#email").val();
	var contact_no = $("#contact_no").val();
	var special_distributor = $("#special_distributor").val();
	var dist_id = $("#distributor_id").val();
	var delivery_date = $("#datepicker1").val();
	
	if(reset_count==0){
		document.getElementById("orderForm").reset();
	
		$("#distributor_name").val(distributor_name);
		$("#distributor_name").attr("readonly", true);
		$("#credit_note").val(cred_amnt);
		$("#email").val(email);
		$("#contact_no").val(contact_no);
		$("#special_distributor").val(special_distributor);
		$("#distributor_id").val(dist_id);
		reset_count++;
	}else{
		document.getElementById("orderForm").reset();
		alert("Order List reset successfully!");
		window.location.href = "sale_order_ar.html";
	}
	
	
}

function addSaleRemarks(sales_remarks){
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
		alert("Error Occured!");
	}else{
		var or_det = JSON.parse(ordet);
		for(var i = 0; i<or_det.length; i++)
		{
			if(or_det[i].order_no===order_no){
				or_det[i].remarks = sales_remarks;
				or_det_string = JSON.stringify(or_det);
				localStorage.setItem("order_details", or_det_string);
				alert("Your remarks Updated!");
			}
		}
	}
}

function removeProduct(order_no1, order_count){
	var r = confirm("Do you want to remove this product?");
	if(r===true){
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
					var distributor_price = $("#row_"+order_count+" td:nth-child(2)").text();
					var qty = $("#row_"+order_count+" td:nth-child(3)").text();
					$("#row_"+order_count).remove();
					var prevOrderAmnt = $("#orderTotalList").text();
					prevOrderAmnt = parseFloat(prevOrderAmnt);
					
					var currentOrderAmnt = parseFloat(distributor_price)*parseInt(qty);
					var newOrderAmnt = prevOrderAmnt-currentOrderAmnt;
					newOrderAmnt = newOrderAmnt.toFixed(2);
					$("#orderTotalList").text(newOrderAmnt);
					alert("Product Removed Successfully!");
				}
			}
		}
	}
}

function removeProductQty(order_count){
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
		alert("Error Occured!");
	}else{
		var or_det = JSON.parse(ordet);
		for(var i = 0; i<or_det.length; i++)
		{
			if(or_det[i].order_no===order_no){
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
				addSaleOrderQuick();
				alert("Product Removed Successfully!");
			}
		}
	}
}

function changeProductQty(dis, order_count, oldQty){
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
				if(or_det[i].order_no===order_no){
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
					addSaleOrderQuick();
				}
			}
		}
	}else{
		$(dis).val(oldQty);
	}
}

function changeProductFreeQty(dis, order_count, oldQty){
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
				if(or_det[i].order_no===order_no){
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
					addSaleOrderQuick();
				}
			}
		}
	}else{
		$(dis).val(oldQty);
	}
}

function addSaleOrderQuick()
{
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
		alert("Error Occured!");
	}else{
		var or_det = JSON.parse(ordet);
		for(var i = 0; i<or_det.length; i++)
		{
			if(or_det[i].order_no===order_no){
				
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
					product_html.push('<td data-th="Oty Ordered" align="center"><input type="text" type="text" style="width:50px; text-align:center;" value="'+one_order[3]+'" onchange="changeProductQty(this,'+one_order[19]+','+one_order[3]+')"></td>');
					product_html.push('<td data-th="Total Price">'+one_total+'</td>');
					product_html.push('<td data-th="Remove" align="center"><a onclick="removeProductQty('+one_order[19]+')" href="javascript: void(0)">Remove</a></td>');
					product_html.push('</tr>');
					
					if(parseInt(one_order[4])>0){
						free_html.push('<tr>');
						free_html.push('<td data-th="SL">'+j+'</td>');
						free_html.push('<td data-th="Product Name">'+one_order[20]+'</td>');
						free_html.push('<td data-th="SKU">'+one_order[18]+'</td>');
						free_html.push('<td data-th="Free Oty Ordered" align="center"><input type="text" type="text" style="width:50px; text-align:center;" value="'+one_order[4]+'" onchange="changeProductFreeQty(this,'+one_order[19]+','+one_order[4]+')"></td>');
						product_html.push('</tr>');
					}
				}
				
				$("#totalOrderAmount").text(total_order_amount.toFixed(2));
				$("#distributorName").html(or_det[i].billing_name);
				$("#orderDate").html(or_det[i].order_date);
				if(product_html.length>0){
					$("#orderViewPanelProduct").find("tbody").html(product_html.join(""));
				}
				if(free_html.length>0){
					$("#orderViewPanelProductFree").find("tbody").html(free_html.join(""));
					$("#freeTableZone").show();
				}
				
				
				or_det[i].order_placed = "Y";
				or_det_string = JSON.stringify(or_det);
				localStorage.setItem("order_details", or_det_string);
			}
		}
	}
	$("#order_place_panel").hide();	
	$("#order_view_panel").show();
	//window.location.href = "sale_order_ar.html";
}

function addSaleOrder()
{
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	var d = new Date();
	var dd = d.getDate();
	var mm = d.getMonth()+1; //January is 0!
	
	var yyyy = d.getFullYear();
	if(dd<10){
		dd='0'+dd
	} 
	if(mm<10){
		mm='0'+mm
	} 
	var today = yyyy+'-'+mm+'-'+dd;
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var totime = h+':'+m+':'+s;
	
	var proName = $("#prod_id").val().split("#");
	
	var distributor_name = $("#distributor_name").val();
	var cred_amnt = $("#credit_note").val();
	var email = $("#email").val();
	var contact_no = $("#contact_no").val();
	var special_distributor = $("#special_distributor").val();
	var dist_id = $("#distributor_id").val();
	var delivery_date = $("#datepicker1").val();
	
	var sku = $("#sku").val();
	var product_id = $("#product_id").val();
	var product_mf_id = $("#product_mf_id").val();
	var size_id = $("#qty_id").val();
	var qty = $("#product_qty").val();
	var free_qty = $("#free_qty").val();
	var ean_no = $("#ean_no").val();
	var mrp = $("#mrp").val();
	var base_purchase_price = $("#base_purchase_price").val();
	var distributor_unit_price = $("#distributor_unit_price").val();
	var vat_percentage_inp = $("#vat_percentage_inp").val();
	var vat_amnt_inp = $("#vat_amnt_inp").val();
	var cst_percentage_inp = $("#cst_percentage_inp").val();
	var cst_amnt_inp = $("#cst_amnt_inp").val();
	var exise_state_percentage_inp = $("#exise_state_percentage_inp").val();
	var exise_state_amnt_inp = $("#exise_state_amnt_inp").val();
	var exise_central_percentage_inp = $("#exise_central_percentage_inp").val();
	var exise_central_amnt_inp = $("#exise_central_amnt_inp").val();
	var distributor_price = $("#distributor_price").val();
	
	var one_order_det = [product_id, product_mf_id, size_id, qty, free_qty, ean_no, mrp, base_purchase_price, distributor_unit_price, vat_percentage_inp, vat_amnt_inp, cst_percentage_inp, cst_amnt_inp, exise_state_percentage_inp, exise_state_amnt_inp, exise_central_percentage_inp, exise_central_amnt_inp, distributor_price, sku, order_count, proName[0]];
	
	if(ordet === null || ordet === "null" || typeof ordet === typeof undefined || ordet == "" || ordet == "[]"){
		var or_det = [];
		var proName = $("#prod_id").val();
		var product_qty = $("#product_qty").val();
		var distributor_price = $("#distributor_price").val();
		if(product_qty == "" || product_qty == 0){
			alert("Enter Product Quantity!");
			return false;
		}else{
			var orderDetails = {
				"order_no" : order_no,
				"order_date" : today,
				"order_time" : totime,
				"distributor_id" : dist_id,
				"upload_id" : user,
				"billing_name" : distributor_name,
				"billing_contact_no" : contact_no,
				"billing_email" : email,
				"delivery_date" : delivery_date,
				"remarks" : "",
				"order_placed" : "Y",
				"details" : []
			};
			var ordTls = orderDetails.details;
			ordTls.push(one_order_det);
			or_det.push(orderDetails);
			or_det_string = JSON.stringify(or_det);
			localStorage.setItem("order_details", or_det_string);
			localStorage.setItem("order_no", order_no);
		}
	}else{
		var or_det = JSON.parse(ordet);
		if(product_qty == "" || product_qty == 0){
			alert("Enter Product Quantity!");
			return false;
		}else{
			var already_not_exist = true;
			for(var j = 0; j<or_det.length; j++)
			{
				if(or_det[j].order_no===order_no){
					already_not_exist = false;
					or_det[j].order_placed = "Y";
					var prev_order_details = or_det[j].details;
					prev_order_details.push(one_order_det);
					or_det[j].details = prev_order_details;
					or_det_string = JSON.stringify(or_det);
					localStorage.setItem("order_details", or_det_string);
				}
			}
			
			if(already_not_exist){
				var orderDetails = {
					"order_no" : order_no,
					"order_date" : today,
					"order_time" : totime,
					"distributor_id" : dist_id,
					"upload_id" : user,
					"billing_name" : distributor_name,
					"billing_contact_no" : contact_no,
					"billing_email" : email,
					"delivery_date" : delivery_date,
					"remarks" : "",
					"order_placed" : "Y",
					"details" : []
				};
				var ordTls = orderDetails.details;
				ordTls.push(one_order_det);
				or_det.push(orderDetails);
				or_det_string = JSON.stringify(or_det);
				localStorage.setItem("order_details", or_det_string);
				localStorage.setItem("order_no", order_no);
			}
		}
	}
	
	addSaleOrderQuick();
}

function changeDistributorName()
{
	$("#qty_id").val('');
	$("#distributor_id").val('');
	$("#special_distributor").val('');
}


function fetch_disdata(distributor_name)
{
	//alert(prod_name);
	var n = distributor_name.indexOf("#");
	if(n!=-1)
	{
		var res = distributor_name.split("#");
		var dist_id = res[1];
		//alert(product_id);
		var distributor_details = JSON.parse(localStorage.distributor_details);
		for(var i=0; i<distributor_details.length; i++){
			if(distributor_details[i].other_detail.distributor_id === dist_id){
				var cred_amnt = distributor_details[i].other_detail.credit_note_current_amount;
				var email = distributor_details[i].other_detail.email;
				var contact_no = distributor_details[i].other_detail.contact_no;
				var special_distributor = distributor_details[i].other_detail.special_distributor;
				$("#credit_note").val(cred_amnt);
				$("#email").val(email);
				$("#contact_no").val(contact_no);
				$("#special_distributor").val(special_distributor);
				$("#distributor_id").val(dist_id);
			}
		}
	}
}

function fetch_data(prod_name)
{
	var n = prod_name.indexOf("#");
	if(n!=-1)
	{
		var res = prod_name.split("#");
		var prod_id = res[1];
		var special_distributor = $("#special_distributor").val();
		var product_details = JSON.parse(localStorage.product_details);
		for(var i=0; i<product_details.length; i++){
			if(product_details[i].other_detail.product_id === prod_id){
				var product_mf_id = product_details[i].other_detail.product_mf_id;
				var product_id = product_details[i].other_detail.product_id;
				var qty_id = product_details[i].other_detail.qty_id;
				var sku = product_details[i].other_detail.sku;
				var mrp = product_details[i].other_detail.mrp;
				var base_purchase_price = product_details[i].other_detail.base_purchase_price;
				if(special_distributor.toLowerCase()==="y"){
					var distributor_unit_price = product_details[i].other_detail.sp_distributor_unit_price;
					var vat_percentage_inp = product_details[i].other_detail.vat_percentage_inp;
					var vat_amnt_inp = product_details[i].other_detail.sp_vat_amnt_inp;
					var cst_percentage_inp = product_details[i].other_detail.cst_percentage_inp;
					var cst_amnt_inp = product_details[i].other_detail.sp_cst_amnt_inp;
					var exise_state_percentage_inp = product_details[i].other_detail.exise_state_percentage_inp;
					var exise_state_amnt_inp = product_details[i].other_detail.sp_exise_state_amnt_inp;
					var exise_central_percentage_inp = product_details[i].other_detail.exise_central_percentage_inp;
					var exise_central_amnt_inp = product_details[i].other_detail.sp_exise_central_amnt_inp;
					var distributor_price = product_details[i].other_detail.sp_distributor_price;
				}else if(special_distributor.toLowerCase()==="o"){
					var distributor_unit_price = product_details[i].other_detail.os_distributor_unit_price;
					var vat_percentage_inp = product_details[i].other_detail.os_vat_percentage_inp;
					var vat_amnt_inp = product_details[i].other_detail.os_vat_amnt_inp;
					var cst_percentage_inp = product_details[i].other_detail.os_cst_percentage_inp;
					var cst_amnt_inp = product_details[i].other_detail.os_cst_amnt_inp;
					var exise_state_percentage_inp = product_details[i].other_detail.os_exise_state_percentage_inp;
					var exise_state_amnt_inp = product_details[i].other_detail.os_exise_state_amnt_inp;
					var exise_central_percentage_inp = product_details[i].other_detail.os_exise_central_percentage_inp;
					var exise_central_amnt_inp = product_details[i].other_detail.os_exise_central_amnt_inp;
					var distributor_price = product_details[i].other_detail.os_distributor_price;
				}else if(special_distributor.toLowerCase()==="n"){
					var distributor_unit_price = product_details[i].other_detail.distributor_unit_price;
					var vat_percentage_inp = product_details[i].other_detail.vat_percentage_inp;
					var vat_amnt_inp = product_details[i].other_detail.vat_amnt_inp;
					var cst_percentage_inp = product_details[i].other_detail.cst_percentage_inp;
					var cst_amnt_inp = product_details[i].other_detail.cst_amnt_inp;
					var exise_state_percentage_inp = product_details[i].other_detail.exise_state_percentage_inp;
					var exise_state_amnt_inp = product_details[i].other_detail.exise_state_amnt_inp;
					var exise_central_percentage_inp = product_details[i].other_detail.exise_central_percentage_inp;
					var exise_central_amnt_inp = product_details[i].other_detail.exise_central_amnt_inp;
					var distributor_price = product_details[i].other_detail.distributor_price;
				}else{
					var distributor_unit_price = product_details[i].other_detail.distributor_unit_price;
					var vat_percentage_inp = product_details[i].other_detail.vat_percentage_inp;
					var vat_amnt_inp = product_details[i].other_detail.vat_amnt_inp;
					var cst_percentage_inp = product_details[i].other_detail.cst_percentage_inp;
					var cst_amnt_inp = product_details[i].other_detail.cst_amnt_inp;
					var exise_state_percentage_inp = product_details[i].other_detail.exise_state_percentage_inp;
					var exise_state_amnt_inp = product_details[i].other_detail.exise_state_amnt_inp;
					var exise_central_percentage_inp = product_details[i].other_detail.exise_central_percentage_inp;
					var exise_central_amnt_inp = product_details[i].other_detail.exise_central_amnt_inp;
					var distributor_price = product_details[i].other_detail.distributor_price;
				}
				
				var ean_no = product_details[i].other_detail.ean_no;
				
				$("#product_mf_id").val(product_mf_id);
				$("#product_id").val(product_id);
				$("#qty_id").val(qty_id);
				$("#sku").val(sku);
				$("#mrp").val(mrp);
				$("#base_purchase_price").val(base_purchase_price);
				$("#distributor_unit_price").val(distributor_unit_price);
				$("#vat_percentage_inp").val(vat_percentage_inp);
				$("#vat_amnt_inp").val(vat_amnt_inp);
				$("#cst_percentage_inp").val(cst_percentage_inp);
				$("#cst_amnt_inp").val(cst_amnt_inp);
				$("#exise_state_percentage_inp").val(exise_state_percentage_inp);
				$("#exise_state_amnt_inp").val(exise_state_amnt_inp);
				$("#exise_central_percentage_inp").val(exise_central_percentage_inp);
				$("#exise_central_amnt_inp").val(exise_central_amnt_inp);
				$("#distributor_price").val(distributor_price);
				$("#ean_no").val(ean_no);
			}
		}
	}
}

function loggedOut(){
	localStorage.setItem("loggedIn", "no");
	localStorage.setItem("user_id", "");
	localStorage.setItem("username", "");
	localStorage.setItem("distributor_details", "");
	window.location.href = "index.html";
}

function addProQty(product_qty)
{
	
	var regex=/^[0-9]+$/;
	if((product_qty=='')||(product_qty=='0'))
	{
		alert("Enter Product Qty!");
		$("#product_qty").val('');
	}
	else if(!product_qty.match(regex))
	{
		alert("Must input numbers");
		$("#product_qty").val('');
	}
}
