function checkUsernameAndEmail(un, em){
	var params = "username=" + un + "&email=" + em;
	console.log(params)
	var request = new ajaxRequest();

	request.open("POST", "checkUsernameAndEmail.php", true); // sending to the urlPost php file 
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


	request.onreadystatechange = function(){ // this is set up as an anonymous funcion but it could also be a named function. Still use *this* keyword
			if(this.readyState == 4){
				if(this.status == 200){
					if(this.responseText != null){
						//console.log(validate)
						validateUsernameAndEmail(this.responseText);
						//alert (this.responseText);	
					}else{
						alert("AJAX error: No data received");
					}
				}else{
					alert("AJAX error: " + this.statustText);
				}
			}
		}
	request.send(params); // make the URL request
}



			