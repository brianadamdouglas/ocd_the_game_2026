<?php 
	require_once '../connect.php';
		
	
	//PHP CODE
	$created="false";
	$pin = $forename = $surname= $email= "";
	if(isset($_POST['pin']))
		$pin = fix_string($_POST['pin']);
	if(isset($_POST['forename']))
		$forename = fix_string($_POST['forename']);
	if(isset($_POST['surname']))
		$surname = fix_string($_POST['surname']);
	if(isset($_POST['email']))
		$email = fix_string($_POST['email']);
		
	$fail = validate_forename($forename);
	$fail .= validate_surname($surname);
	$fail .= validate_email($email);
	
	
	// echo "<!DOCTYPE html>\n<html><head><title>An Example Form</title>";
	if($fail == ""){
		$created = "true";
	/* echo "<script>console.log('$pin')</script>"; */
		//echo "<script>alert('$forename, $surname, $username, $password, $email')</script>";
		//$message = 'Dear $forename thank you so much for registering to beta test for Endgames Interactive. You username is $username and your password is $password. You will be required to enter these when you begin a session. Now for the fun part; the link to the game is http://www.endgamesinteractive.com/gamedev/game.php . I look forward to your feedback. Sincerely, Brian.'; 
		
		emailNewUserLink($email, $forename, $username, $pin);
		//echo "<script>sendMail('$email', 'Welcome to Beta Testing for Endgames Interactive',  'Dear $forename thank you so much for registering to beta test for Endgames Interactive. You username is $username and your password is $password. You will be required to enter these when you begin a session. Now for the fun part; the link to the game is http://www.endgamesinteractive.com/gamedev/game.php . I look forward to your feedback. Sincerely, Brian.')</script>";
		//echo "</head><body>Form data successfully validated:
			//$forename, $surname, $username, $password, $email.</body></html>"; 
			
	
		
		if (isset($_POST['forename'])		&&
			isset($_POST['surname'])		&&
			isset($_POST['email'])			&&
			isset($_POST['pin']))
			{
				$salt1			= "qm&h*";
				$salt2			= "pg!@";
				$pin			= get_post($conn, 'pin');
				$forename		= get_post($conn, 'forename');
				$surname		= get_post($conn, 'surname');
				$email			= get_post($conn, 'email');
				
				createNewUser($conn, $forename, $surname, $pin);
			}	
				
			// here is where one would enter fields into a database using hash encryption for password
			
		 	
		} 
	
	
	
/* 	$formbuilder = <<<FORMBUILDER
   		<form action="createUsersTable.php" method="post"><pre>
   			  PIN <input type="text" name="pin">
   			  Forename <input type="text" name="forename">
   			  Surname <input type="text" name="surname">
   			  Username <input type="text" name="username">
   			  Password <input type="text" name="password">
   			  <input type="submit" value="ADD RECORD">
  		</pre></form>
FORMBUILDER; */

	$formbuilder = <<<FORMBUILDER
	
	<!-- The HTML/Javascript section -->
	
	<meta name="viewport" content="width=100, initial-scale=1">
	
		<style>
			.signup{
				border:	1px solid #999999;
				font:	normal 14px helvetica;
				color:	#444444;	
			}		
			
			body {
 			   background-color: #999999;
			}
			
			 div.container {
   				 width:98%; 
				 margin:1%;
			}
			  table#table1 {
			    text-align:center; 
			    margin-left:auto; 
			    margin-right:auto; 
			    width:100px;
			  }
			  tr,td {text-align:left;}
	
		</style>
		<script>
			function validate(form){
				
				fail	 = validateForename(form.forename.value);
				fail	+= validateSurname(form.surname.value);
				fail	+= validateEmail(form.email.value);
					
				if(fail==""){
					return true;
				}else{
					alert(fail);
					return false;					}
					
			}
			
			
			/*  function sendMail(address, subject, message) {
    			var link = "mailto:"+ address
			             + "&subject=" + escape(subject)
			             + "&body=" + escape(message)
			    ;
			
			    window.location.href = link;
			}  */
		</script>
		<script type="text/javascript" src="js/validate_functions.js"></script>
		</head>
		<body>
		 <div class="container">
			<table border="0" cellpadding="2" cellspacing="5" bgcolor="eeeeee" id="table1">
				<th colspan="2" align="center">Endgames Interactive<br>Create New User Row</th>
				<form method="post" action="createUserRow.php" onsubmit="return(validate(this))">
					<tr><td>PIN</td><td><input type="text" maxlength="32" name="pin"></td></tr>
					<tr><td>First</td><td><input type="text" maxlength="32" name="forename"></td></tr>
					<tr><td>Last</td><td><input type="text" maxlength="32" name="surname"></td></tr>
					<tr><td>Email</td><td><input type="text" maxlength="64" name="email"></td></tr>
					<tr><td colspan="2" align="center"><input type="submit" value="Create New User"></td></tr>
				</form>
			</table>
			</div>
		</body>
	</html>
FORMBUILDER;

$confirmbuilder = <<<CONFIRMBUILDER
	
	<!-- The HTML/Javascript section -->
	
	<meta name="viewport" content="width=100, initial-scale=1">
	
		<style>
			.signup{
				border:	1px solid #999999;
				font:	normal 14px helvetica;
				color:	#444444;	
			}		
			
			body {
 			   background-color: #999999;
			}
			
			 div.container {
   				 width:98%; 
				 margin:1%;
			}
			  table#table1 {
			    text-align:center; 
			    margin-left:auto; 
			    margin-right:auto; 
			    width:100px;
			  }
			  tr,td {text-align:left;}
	
		</style>
		
		</head>
		<body>
		 <div class="container">
			<table border="0" cellpadding="2" cellspacing="5" bgcolor="eeeeee" id="table2">
				<th colspan="2" align="center">Endgames Interactive<br>Created User Info</th>	
					<tr><td>PIN</td><td>$pin</td></tr>
					<tr><td>First</td><td>$forename</td></tr>
					<tr><td>Last</td><td>$surname</td></tr>
					<tr><td>Email</td><td>$email</td></tr>
			</table>
			</div>
		</body>
	</html>
CONFIRMBUILDER;


	if($created == "false"){
		echo $formbuilder;
	}else{
		echo $confirmbuilder;
	}
	
		


	
	
	
	
	// FUNCTIONS
	
	function createNewUser($connection, $fn, $sn,  $pin){
		
		

		$query		= "INSERT INTO endgameRegisteredUsers (forename, surname, pin) VALUES ('$fn','$sn','$pin')"; 
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
	
	function validate_forename($field){
		return ($field == "") ? "No Forename was entered<br>" : "";
	}
	
	function validate_surname($field){
		return ($field == "") ? "No Surname was entered<br>" : "";
	}
	
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
	
	function emailNewUserLink($testerEmail, $forename, $surname, $pin){
		$to      = $testerEmail;
		$subject = 'ENDGAMES | Complete your ENDGAMES account registration';
		$message = "Dear " . $forename . ", \r \rWelcome to Endgames. Please follow the link below to complete your registration. \r\r  http://www.endgamesinteractive.com/gamedev/registerLogin.php?u_i=ff96c800ca0a8c82a07ffed0fb7aed83&u_p=".$pin."\r\r-- Team ENDGAMES";
		$message = wordwrap($message, 70, "\r\n");
		$headers = 'From: ENDGAMESinteractive@gmail.com' . "\r\n" .
		    'X-Mailer: PHP/' . phpversion();
		mail($to, $subject, $message, $headers);
	}
	
	
	
?>