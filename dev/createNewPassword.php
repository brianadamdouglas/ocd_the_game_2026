<?php

require_once '../connect.php'; 
	
	
	//VARIABLES
	$handler="";
	$errorText="";
	$userInteraction = "";
	$controls = array("reset");
	$verifiedAccount="";
	$errorForm;
	$token	= "";
	$verifiedUser = "false";

	
	init();
	
	function init(){
		checkGet();
		checkReset();
	}
	
	
	
	/**
	* @function Checks to url to see if data was sent via GET
	* @description A global class that dispatches and receives Events
	*/
	function checkGet(){
		
		if(isset ($_GET['u_i'])){
			$userInteraction = $_GET['u_i'];
			$salt1	= "qm&h*";
			$salt2	= "pg!@";
			$token	= "";
			global $controls;
			for ($i = 0; $i < count($controls); $i++) {
				$control = $controls[$i];
				$temp	 = hash('ripemd128', "$salt1$controls[$i]$salt2");
			    if($temp == $userInteraction){
			        $token = $control;
			     /*    echo "<script>console.log('$control')</script>"; */
			        break;
			    }
			} 
			
		}
		global $handler;
		if($token == "reset"){
			$handler="display form";
		}
		
	}
	
	
	function checkReset(){
		if(isset($_POST['reset'])){
				/* VERIFY FORM FOR REGISTRATION */
			$email = $password = "";
			if(isset($_POST['newPassword']))
				$password = fix_string($_POST['newPassword']);
			if(isset($_POST['loginEmail']))
				$email = fix_string($_POST['loginEmail']);
			/* checkUsername($conn, $username); */
			$fail .= validate_password($password);
			$fail .= validate_email($email);
			// echo "<!DOCTYPE html>\n<html><head><title>An Example Form</title>";
			if($fail == ""){
				
				if (isset($_POST['newPassword'])&& isset($_POST['loginEmail'])){
					global $conn;
					$salt1			= "qm&h*";
					$salt2			= "pg!@";
					$password		= get_post($conn, 'newPassword');
					$email			= get_post($conn, 'loginEmail');
					$passwordToken	= hash('ripemd128', "$salt1$password$salt2");
					
					global $handler;		
					updatePassword($conn, $passwordToken, $email);
					$handler = "account updated";
					
				}
				
				emailUpdatedPassword($email, $password);
				
				if (isset($_COOKIE['endgamesCookie'])) {
				    unset($_COOKIE['endgamesCookie']);
				    setcookie('endgamesCookie', null, -1, '/');
				}
					
				// here is where one would enter fields into a database using hash encryption for password
				
				//exit;
			}else{
				/* echo "<script>console.log('$fail')</script>"; */
			}
		}
		
	}
	
	
	
	
	
	// FUNCTIONS
	
	function updatePassword($connection, $pw, $em){
		/* echo "<script>console.log('$pin, $un, $pw')</script>"; */
		//check to see if the pin exists, then get the result of that query.
		// if there is not a username associated with it then you can submit the query
		$query		= "UPDATE endgameRegisteredUsers SET password='$pw' WHERE email='$em'";
		/* $query		= "INSERT INTO users VALUES" .
		 "('$fn','$sn','$un','$pw', '$pin')"; */
		$result		= $connection->query($query);
		
		if (!$result) {
			echo "INSET failed :$query<br>" . $conn->error . "<br><br>";
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
	
	function emailUpdatedPassword($testerEmail, $password){
		$to      = $testerEmail;
		$subject = 'ENDGAMES | Updated Password';
		$message = "Your password has been updated.\r\rYour updated password is ".$password."\r\r-- Team ENDGAMES";
		$message = wordwrap($message, 70, "\r\n");
		$headers = 'From: ENDGAMESinteractive@gmail.com' . "\r\n" .
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
	<link rel="stylesheet" href="../css/createNewPW.css">
	<link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
	<script type="text/javascript" src="js/ajaxRequest.js"></script>
	<script type="text/javascript" src="js/checkUsernameAndEmailAjax.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script type="text/javascript" src="js/validate_functions.js"></script>
	<script type="text/javascript" src="js/createNewPassword.js"></script>
	
</head>
<body>
	<nav class="clearfix">
		<ul class="clearfix">
			<li><a href="artworks.html">Artworks</a></li>
			<li><a href="about.html" >About</a></li>
			<li><a href="registerLogin.php">Login/Register</a></li>
			<li><a href="contact.html">Contact</a></li>
		</ul>
		<a href="#" id="pull">Menu</a>
	</nav>
	<img src="../img/menuDev/logo.gif" id="logo" height="293" width="688">
	<div id="_body">
				<div id="_loginCopy">
				<span class="title">Sign In</span><br><br>
					<table border="0" cellpadding="2" cellspacing="5" id="table1">
						<form method="post" action="createNewPassword.php" name="changeForm" >
							<tr><td>Email</td><td><input type="text" maxlength="64" name="loginEmail"></td></tr>
							<tr><td>Username</td><td><input type="text" maxlength="64" name="loginUsername"></td></tr>
							<tr><td>Password</td><td><input type="password" maxlength="12" name="newPassword"><input type="hidden" maxlength="64" name="reset" value="true"></td></tr>
							<tr><td>Verify Password</td><td><input type="password" maxlength="12" name="duplicate"></td></tr>
							<tr><td colspan="2" id="_invalidUsernameOrPassword">The email or username are incorrect.<br>Please try again.</td></tr>
							<tr><td colspan="2" class="submitCel"><a href="#" class="submitButton" onclick="beginValidateUsernameAndEmail(document.changeForm);">Sign In</a></td></tr>
						</form>
					</table>	
				</div>
				
				<div id="_confirmationCopy">
					<span class="title">Congratulations!</span><br><br>
					Your password has been changed.<br>
					Please return to the login page to sign in.<br><br>
					<a href="registerLogin.php" class="linkButton">Back to login</a> 
				</div>
		
				
			
		
	<img src="../img/menuDev/shim.gif" id="filler" height="1" width="1">
	</div>
</body>
</html>
FORMBUILDER;









echo	$formbuilder;


if($handler == "display form"){
	echo "<script>revealLogin()</script>";
}else if($handler == "account updated"){
	echo "<script>revealConfirmation()</script>";
}




?>

