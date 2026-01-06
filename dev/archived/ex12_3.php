<?php 
	require_once 'connect.php';
	
	$user_query = "DESCRIBE users";
	$user_result = $conn->query($user_query);
	if(!$user_result){
		$create_user_query = "CREATE TABLE users (
		forename VARCHAR(32) NOT NULL,
		surname  VARCHAR(32) NOT NULL,
		username VARCHAR(32) NOT NULL UNIQUE,
		password VARCHAR(32) NOT NULL
		)";
		
		$create_user_result = $conn->query($create_user_query);
		if(!$create_user_result) die($conn->error);
		
		
	}
	
	
	
	if (isset($_POST['forename'])		&&
		isset($_POST['surname'])		&&
		isset($_POST['username'])		&&
		isset($_POST['password']))
	{
		$salt1			= "qm&h*";
		$salt2			= "pg!@";
		$forename		= get_post($conn, 'forename');
		$surname		= get_post($conn, 'surname');
		$username		= get_post($conn, 'username');
		$password		= get_post($conn, 'password');
		$token			= hash('ripemd128', "$salt1$password$salt2");
		
		add_user($conn, $forename, $surname, $username, $token);
	}
	
	$formbuilder = <<<FORMBUILDER
   		<form action="ex12_3.php" method="post"><pre>
   			  Forename <input type="text" name="forename">
   			   Surname <input type="text" name="surname">
   			  Username <input type="text" name="username">
   			  Password <input type="text" name="password">
   			    	 <input type="submit" value="ADD RECORD">
  		</pre></form>
FORMBUILDER;
	
	echo $formbuilder;
	
	
	
	
	
	
	
	
	// FUNCTIONS
	
	function add_user($connection, $fn, $sn, $un, $pw){
		$query		= "INSERT INTO users VALUES" .
		 "('$fn','$sn','$un','$pw')";
		$result		= $connection->query($query);
		if (!$result) echo "INSET failed :$query<br>" .
		 $conn->error . "<br><br>";	
	}
	
	function get_post($conn, $var)
	{
		return $conn->real_escape_string($_POST[$var]);
	}
	
	
	
?>