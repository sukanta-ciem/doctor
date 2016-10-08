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
		window.location.href = "sale_order_ar.html";
	}
	$.ajax({
		type: 'post',
		url: site_url+'api/product_api.php',
		data: "",
		dataType: 'json',
		crossDomain: true,
		success: function(msg){
			var data = msg;
			if(data.status === "success"){
				var prod_details = JSON.stringify(data.product);
				localStorage.setItem("product_details", prod_details);
				
			}else{
				/////do nothing
			}
		}
	});
	
});

document.getElementById("submit").addEventListener("click", showLoader);
(function() {
   // your page initialization code here
   // the DOM will be available here
	document.getElementById("wrapper").className = "";
	setTimeout(function(){ document.getElementById("wrapper").className = "hidden"; }, 2000);
})();

function showLoader(){
	var u = document.getElementById("textfield").value;
	var p = document.getElementById("textfield2").value;
	if(u==="" || p===""){
		alert("Fill up the required field!");
		return false;
	}
	document.getElementById("wrapper").className = "";
	var formData = $("#loginForm").serializeArray();
	$.ajax({
		type: 'post',
		url: site_url+'api/login_api.php',
		data: formData,
		success: function(msg){
			var data = JSON.parse(msg);
			if(data.status === "success"){
				var user_id = data.user_id;
				localStorage.setItem("loggedIn", "ok");
				localStorage.setItem("user_id", user_id);
				localStorage.setItem("username", u);
				$.ajax({
					type: 'post',
					url: site_url+'api/distributor_api.php',
					data: "user="+u,
					dataType: 'json',
					crossDomain: true,
					success: function(msg){
						var data = msg;
						if(data.status === "success"){
							var distributor_details = JSON.stringify(data.distributor);
							localStorage.setItem("distributor_details", distributor_details);
							window.location.href = "sale_order_ar.html";								
						}else{
							/////do nothing
						}
					}
				});
			}else{
				alert("Wrong Username or Password!");
				document.getElementById("wrapper").className = "hidden";
			}
		}
	});
}