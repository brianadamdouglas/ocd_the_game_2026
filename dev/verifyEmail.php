<?php

require_once '../connect.php'; 
	
	
	//VARIABLES
	$handler="";

	
	init();
	
	function init(){
		checkEmail();
	}
	
	
	
	
	
	function checkEmail(){
		if(isset($_POST['check'])){
				/* VERIFY FORM FOR REGISTRATION */
			$email  = "";
			if(isset($_POST['confirmEmail']))
				$email = fix_string($_POST['confirmEmail']);
			/* checkUsername($conn, $username); */
			$fail .= validate_email($email);
			// echo "<!DOCTYPE html>\n<html><head><title>An Example Form</title>";
			if($fail == ""){
				//emailTester($email, $username, $password);
				if (isset($_POST['confirmEmail'])){
					global $conn;
					$email			= get_post($conn, 'confirmEmail');
			
					global $handler;		
					emailPasswordLink($email);
					$handler = "email sent";
					
				}
				
					
				// here is where one would enter fields into a database using hash encryption for password
				
				//exit;
			}else{
				/* echo "<script>console.log('$fail')</script>"; */
			}
		}
		
	}
	
	
	
	
	
	// FUNCTIONS
	
	function emailPasswordLink($testerEmail){
		$to      = $testerEmail;
		$subject = 'ENDGAMES | Change your password';
		$message = "Please follow the link below to update your password. \r\r  http://www.endgamesinteractive.com/gamedev/createNewPassword.php?u_i=a50b6771a17f6ff3e2acbdda1b808da2 \r\r-- Team ENDGAMES";
		$message = wordwrap($message, 70, "\r\n");
		$headers = 'From: ENDGAMESinteractive@gmail.com' . "\r\n" .
		    'Reply-To: ENDGAMESinteractive@gmail.com' . "\r\n" .
		    'X-Mailer: PHP/' . phpversion();
		mail($to, $subject, $message, $headers);
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
	<link rel="stylesheet" href="../css/verifyEmail.css">
	<link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
	<script type="text/javascript" src="js/ajaxRequest.js"></script>
	<script type="text/javascript" src="js/checkUsernameAndEmailAjax.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script type="text/javascript" src="js/validate_functions.js"></script>
	<script type="text/javascript" src="js/verifyEmail.js"></script>
	
</head>
<body>
	<img src="../img/menuDev/logo.gif" id="logo" height="293" width="688">
	<div id="_body">
				<div id="_loginCopy">
				<span class="title">Confirm your email</span><br><br>
					<table border="0" cellpadding="2" cellspacing="5" id="table1">
						<form method="post" action="verifyEmail.php" name="submitEmail" >
							<tr><td colspan="2" class="multicolumnText">Please enter the email that you registered with and you will receive a link to change your password.<br><br></td></tr>
							<tr><td>Email</td><td><input type="text" maxlength="64" name="confirmEmail"><input type="hidden" maxlength="64" name="check" value="true"></td></tr>
							<tr><td colspan="2" class="submitCel"><a href="#" class="submitButton" onclick="validateEmailForm(document.submitEmail);">Submit</a></td></tr>
						</form>
					</table>	
				</div>
				
				<div id="_confirmationCopy">
					<span class="title">Thank you</span><br><br>
					Please check your email shortly.<br>
					You will receive a link to change your password.<br><br>
				</div>
		
				
			
		
	<img src="../img/menuDev/shim.gif" id="filler" height="1" width="1">
	</div>
</body>
</html>
FORMBUILDER;









echo	$formbuilder;


if($handler == "email sent"){
	echo "<script>revealConfirmation()</script>";
}



?>

