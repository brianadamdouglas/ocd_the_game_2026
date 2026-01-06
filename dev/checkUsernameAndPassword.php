<?php // urlpost php file
	require_once '../connect.php'; 
	
	$un = $pwd ="";
	if(isset($_POST['username']) && isset($_POST['password'])){
		$un = fix_string($_POST['username']);
		$pwd = fix_string($_POST['password']);
		echo checkUsername($conn, $un, $pwd);
	}
	
	function checkUsername($connection,$un, $pwd){
		$query = "SELECT password FROM endgameRegisteredUsers WHERE username='$un'";
		$result = $connection->query($query);
		
		if(!$result) die ("Database access failed :" . $conn->error);
		
		
		$result->data_seek(0);
		$row = $result->fetch_array(MYSQLI_NUM);
		$existingPassword = "";
		if($row[0] != ''){
			$existingPassword = $row[0];
			$salt1	= "qm&h*";
			$salt2	= "pg!@";
			$submittedPassword	 = hash('ripemd128', "$salt1$pwd$salt2");
			//return ($existingPassword. ":" . $submittedPassword);
			if($existingPassword == $submittedPassword){
				return "verified";
			}else{
				return "notVerified";
			}
		}
	}
	
	function fix_string($string){
		if(get_magic_quotes_gpc()){
			$string = stripslashes($string);
		}
		return htmlentities($string);
	}
?>