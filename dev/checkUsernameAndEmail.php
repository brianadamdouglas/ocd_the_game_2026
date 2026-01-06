<?php // urlpost php file
	require_once '../connect.php'; 
	
	$un = $email = "";
	if(isset($_POST['username']) && isset($_POST['email'])){
		$un = fix_string($_POST['username']);
		$email = fix_string($_POST['email']);
		echo checkUsername($conn, $un, $email);
	}
	
	function checkUsername($connection,$un, $email){
		$query = "SELECT username FROM endgameRegisteredUsers WHERE email='$email'";
		$result = $connection->query($query);
		
		if(!$result) die ("Database access failed :" . $conn->error);
		
		
		$result->data_seek(0);
		$row = $result->fetch_array(MYSQLI_NUM);
		$existingPassword = "";
		if($row[0] != ''){
			$existingUsername = $row[0];
			if($existingUsername == $un){
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