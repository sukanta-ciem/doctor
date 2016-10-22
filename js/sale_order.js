var addInStock = true;
var order_no = parseInt(localStorage.getItem("order_no")) + 1;

$(document).ready(function(){
	$("#order_no").val(order_no);
	$("#order_no_invalid_process").val(order_no);
});

function addInList(){
	document.getElementById("wrappers").className = "";
	setTimeout(function(){ document.getElementById("wrappers").className = "hidden"; }, 2000);
	var ordet = localStorage.getItem("order_details");
	if(ordet === null || typeof ordet === typeof undefined){
		var or_det = [];
		var proName = $("#prod_id").val();
		var product_qty = $("#product_qty").val();
		var distributor_price = $("#distributor_price").val();
		if(product_qty === "" || product_qty === 0){
			alert("Enter Product Quantity!");
			return false;
		}else{
			var one_order = [proName, distributor_price, product_qty, 0];
			or_det.push(one_order);
		}
	}else{
		var or_det = JSON.parse(ordet);
	}
	var orderHtml = [];
	
	for(var i=0; i<or_det.length; i++){
		orderHtml.push("<tr>");
		var singleOrder = or_det[i];
		for(var j=0; j<singleOrder.length; j++){
			orderHtml.push('<td align="center" class="bg06">'+singleOrder[j]+'</td>');
		}
		orderHtml.push("</tr>");
	}
	if(orderHtml.length>0){
		$("#orderView").find("tbody").append(orderHtml.join(""));
	}
	
	var distributor_name = $("#distributor_name").val();
	var cred_amnt = $("#credit_note").val();
	var email = $("#email").val();
	var contact_no = $("#contact_no").val();
	var special_distributor = $("#special_distributor").val();
	var dist_id = $("#distributor_id").val();
	
	document.getElementById("orderForm").reset();
	
	$("#distributor_name").val(distributor_name);
	$("#credit_note").val(cred_amnt);
	$("#email").val(email);
	$("#contact_no").val(contact_no);
	$("#special_distributor").val(special_distributor);
	$("#distributor_id").val(dist_id);
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
				$("#special_distributor").val(dist_id);
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
		var product_details = JSON.parse(localStorage.product_details);
		for(var i=0; i<product_details.length; i++){
			if(product_details[i].other_detail.product_id === prod_id){
				var product_mf_id = product_details[i].other_detail.product_mf_id;
				var qty_id = product_details[i].other_detail.qty;
				var sku = product_details[i].other_detail.sku;
				var mrp = product_details[i].other_detail.mrp;
				var base_purchase_price = product_details[i].other_detail.base_purchase_price;
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
				var ean_no = product_details[i].other_detail.ean_no;
				
				$("#product_mf_id").val(product_mf_id);
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
