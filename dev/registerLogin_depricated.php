<?php

	/* require_once '../connect.php'; */
	
	$createLink="";
	$errorText="";
	$userInteraction = "";
	$controls = array("verified", "registered");
	$verifiedAccount="";
	$hiddenFieldContent="";
	
	if(isset ($_GET['u_i'])){
		$userInteraction = $_GET['u_i'];
		$salt1	= "qm&h*";
		$salt2	= "pg!@";
		$token	= "";
		for ($i = 0; $i < count($controls); $i++) {
			$control = $controls[$i];
			echo "<script>console.log('$control')</script>";
			$temp	 = hash('ripemd128', "$salt1$controls[$i]$salt2");
		    if($temp == $userInteraction){
		        $token = $control;
		        echo "<script>console.log('$control')</script>";
		        break;
		    }
		} 
		
	}
	if(isset ($_GET['u_i']) && $token == "verified"){
		$hiddenFieldContent = $_GET['u_p'];
		$createLink="I've got my code. <a href='#' onclick='revealCreate();'>Create your account</a>";
	}
	
	
	if(isset($_POST['registered'])){
			/* VERIFY FORM FOR REGISTRATION */
		$email = $pin = $username = $password = "";
		if(isset($_POST['u_p']))
			$pin = fix_string($_POST['u_p']);
		if(isset($_POST['registerUser']))
			$username = fix_string($_POST['registerUser']);
		if(isset($_POST['registerPassword']))
			$password = fix_string($_POST['registerPassword']);
		if(isset($_POST['registerEmail']))
			$email = fix_string($_POST['registerEmail']);
			
		$fail = validate_username($username);
		$fail .= validate_password($password);
		$fail .= validate_email($email);
		// echo "<!DOCTYPE html>\n<html><head><title>An Example Form</title>";
		if($fail == ""){
			//emailTester($email, $username, $password);
			if (isset($_POST['registerUser']) && isset($_POST['registerPassword'])&& isset($_POST['registerEmail']) && isset($_POST['u_p'])){
				$salt1			= "qm&h*";
				$salt2			= "pg!@";
				$pin			= get_post($conn, 'u_p');
				$username		= get_post($conn, 'registerUser');
				$password		= get_post($conn, 'registerPassword');
				$email			= get_post($conn, 'registerEmail');
				$passwordToken	= hash('ripemd128', "$salt1$password$salt2");
				$verifiedAccount = hasUserAlreadyRegistered($conn, $pin, $username, $passwordToken);
				if($verifiedAccount == "no pin"){
					$createLink = "It appears that you have failed to properly register. Please fill the form out below and we will look into the problem and respond within 24 hours.";
				}
				if($verifiedAccount == "already registered"){
					$createLink = "It appears that you have registed with Endgames Interactive already.<br/><br/>Create an account. <a href='#' onclick='revealRegister();'>Sign Up Now</a>";
				}
			}	
				
			// here is where one would enter fields into a database using hash encryption for password
			
			//exit;
		}else{
			/* echo "<script>console.log('$fail')</script>"; */
		}
	}
	
	
	// FUNCTIONS
	
	function add_user($connection, $pin, $un, $pw){
		/* echo "<script>console.log('$pin, $un, $pw')</script>"; */
		//check to see if the pin exists, then get the result of that query.
		// if there is not a username associated with it then you can submit the query
		$query		= "UPDATE endgameRegisteredUsers SET username='$un',password='$pw' WHERE pin='$pin'";
		/* $query		= "INSERT INTO users VALUES" .
		 "('$fn','$sn','$un','$pw', '$pin')"; */
		$result		= $connection->query($query);
		
		if (!$result) {
			echo "INSET failed :$query<br>" . $conn->error . "<br><br>";
		} 	
	}
	
	
	
	function hasUserAlreadyRegistered($connection, $pin,  $un, $pw){
		$query = "SELECT username FROM endgameRegisteredUsers WHERE pin='$pin'";
		$result = $connection->query($query);
		
		if(!$result) die ("Database access failed :" . $conn->error);
		
		$rows = $result->num_rows;
		$noRows = ($rows == 0);
		
		if($noRows){
			
			return "no pin";
		}
		
		$result->data_seek(0);
		$row = $result->fetch_array(MYSQLI_NUM);
		if($row[0] == ''){
			//echo "not registered<br>";
			$registeredUser = false;
		}else{
			$registeredUser = true;
		}
		if(!$registeredUser){
			add_user($connection, $pin, $un, $pw);
		}else{
			return "already registered";
			// trigger something here  more than echo "<script>alert('you have already created an account')</script>"; 
		}
	}
	
	function get_post($conn, $var)
	{
		return $conn->real_escape_string($_POST[$var]);
	}
	
	// PHP FUNCTIONS
	
	
	function validate_username($field){
		if($field == ""){
			return "No Username was entered<br>";
		}else if(strlen($field) < 5){
			return "Usernames must be at least 5 characters<br>";
		}else if(preg_match("/[^a-zA-Z0-9_-]/",$field)){
			return "Only letters, numbers, - and _ in usernames<br>";
		}
		return "";
	}
	
	function validate_password($field){
		if($field == ""){
			return "No Password was entered<br>";
		}else if(strlen($field) < 6){
			return "Passwords must be at least 6 characters<br>";
		}else if(!preg_match("/[a-z]/",$field) ||
				 !preg_match("/[A-Z]/",$field) ||
				 !preg_match("/[0-9]/",$field)){
			return "Passwords require at least 1 each of a-z, A-Z, and 0-9<br>";
		}
		return "";
	}
	
	function validate_email($field){
		if($field == ""){
			return "No Email was entered<br>";
		}else if(!( (strpos($field, ".")>0) && (strpos($field, "@")>0)) || 
					 preg_match("/[^a-zA-Z0-9.@_-]/",$field)){
			return "The Email address is invalid<br>";
		}
		return "";
	}

	
	
	function fix_string($string){
		if(get_magic_quotes_gpc()){
			$string = stripslashes($string);
		}
		return htmlentities($string);
	}
	
	function emailTester($testerEmail, $username, $password){
		$to      = $testerEmail;
		$subject = 'Welcome to Beta Testing for Endgames Interactive';
		$message = "Thank you so much for registering with Endgames Interactive. \rYou username is " . $username . ". \rYour password is " . $password . " . \rTo login and get playing please visit http://www.endgamesinteractive.com/gamedev/game.php";
		$message = wordwrap($message, 70, "\r\n");
		$headers = 'From: elbowtoe@gmail.com' . "\r\n" .
		    'Reply-To: elbowtoe@gmail.com' . "\r\n" .
		    'X-Mailer: PHP/' . phpversion();
		
		mail($to, $subject, $message, $headers);
	} 
	
	
		





$formbuilder = <<<FORMBUILDER
	
	<!DOCTYPE html>
<html>
<head>
	<title>Endgames</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<link rel="stylesheet" href="../css/normalize.css">
	<link rel="stylesheet" href="../css/style.css">
	<link rel="stylesheet" href="../css/login.css">
	<link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script type="text/javascript" src="js/validate_functions.js"></script>
	<script>
		function validate(form){	
			var fail = "";
				fail	+= validateUsername(form.registerUser.value);
				fail	+= validatePassword(form.registerPassword.value);
				fail	+= validateEmail(form.registerEmail.value);
				console.log(fail);

				if(fail==""){
					return true;
				}else{
					alert(fail);
					return false;					}
					
		}
		
		$(function() {
			var pull 		= $('#pull');
				menu 		= $('nav ul');
				menuHeight	= menu.height();

			$(pull).on('click', function(e) {
				e.preventDefault();
				menu.slideToggle();
			});

			$(window).resize(function(){
        		var w = $(window).width();
        		if(w > 320 && menu.is(':hidden')) {
        			menu.removeAttr('style');
        		}
    		});
		});
		
		function revealRegister(){
			$("#_joinCopy").css("display", "block");
			$("#_loginCopy").css("display", "none");
		}
		
		function revealCreate(){
			$("#_createCopy").css("display", "block");
			$("#_loginCopy").css("display", "none");
			
		}
		
		function back(){
			$("#_joinCopy").css("display", "none");
			$("#_createCopy").css("display", "none");
			$("#_loginCopy").css("display", "block");
		}
	</script>
</head>
<body>
	<nav class="clearfix">
		<ul class="clearfix">
			<li><a href="artworks.html">Artworks</a></li>
			<li><a href="about.html" >About</a></li>
			<li><a href="#" class="activePage">Login/Register</a></li>
			<li><a href="contact.html">Contact</a></li>
		</ul>
		<a href="#" id="pull">Menu</a>
	</nav>
	<img src="../img/menuDev/logo.gif" id="logo" height="293" width="688">
	<div id="_body">
				<div id="_loginCopy">
				<span class="title">Sign In</span><br><br>
				<table border="0" cellpadding="2" cellspacing="5" id="table1">
						<form method="post" action="betaTestingRegistration.php" onsubmit="return(validate(this))">
							<tr><td>Email</td><td><input type="text" maxlength="64" name="email"></td></tr>
							<tr><td>Password</td><td><input type="text" maxlength="12" name="password"></td></tr>
							<tr><td colspan="2" class="submitCel"><input type="submit" value="Sign In" class="submitButton"></td></tr>
						</form>
					</table>
					<br>
					New to Endgames? <a href="#" onclick="revealRegister();">Sign Up Now</a><br>
					$createLink		
				</div>
		
				 <div id="_createCopy">
					 <span class="title">Create An Account</span><br><br>
					<table border="0" cellpadding="2" cellspacing="5" id="table1">
						<form method="post" action="registerLogin.php" onsubmit="return(validate(this))">
							<tr><td>Email</td><td><input type="text" maxlength="64" name="registerEmail"></td></tr>
							<tr><td>Username</td><td><input type="text" maxlength="64" name="registerUser"><input type="hidden" maxlength="64" name="registered" value="true"></td></tr>
							<tr><td>Password</td><td><input type="text" maxlength="12" name="registerPassword"><input type="hidden" maxlength="64" name="u_p" value="$hiddenFieldContent"></td></tr>
							<tr><td colspan="2" class="submitCel"><input type="submit" value="Create Account" class="submitButton"></td></tr>
						</form>
					</table>
					<br>
					<a href="#" onclick="back();">Back</a> 
					
				</div>
				
				<div id="_joinCopy">
					 <div id="_registerSubmit">
						For a one time resgistration fee of <b>$3.00</b> you will gain unlimited access to 
						current and future interactive artworks.<br><br>
						Upon verification of your membership purchase you will receive a 
						confirmation email within 24 hours containing a link and your registration 
						code to establish your Username and Password.<br><br>
						<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
						<input type="hidden" name="cmd" value="_s-xclick">
						<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
						">
						<input type="submit" value="Register now" class="submitButton" name="submit">
						<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
						</form>
					</div>
					<a href="#" onclick="back();">Back</a> 
					
				</div> 
				<div id="_errorCopy">
					<span class="title">An error occurred</span><br><br>
					$errorText
				</div>
			
		
	<img src="../img/menuDev/shim.gif" id="filler" height="1" width="1">
	</div>
</body>
</html>
FORMBUILDER;
echo	$formbuilder;

if($verifiedAccount == "no pin"){
	/echo "<script>revealCreate()</script>";
}



?>

