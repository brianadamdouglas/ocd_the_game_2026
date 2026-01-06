<?php // urlpost php file
	require_once '../connect.php'; 
	
	$un = "";
	if(isset($_POST['username'])){
		$un = fix_string($_POST['username']);
		echo checkUsername($conn, $un);
	}
	
	function checkUsername($connection,$un){
		$query = "SELECT * FROM endgameRegisteredUsers WHERE username='$un'";
		$result = $connection->query($query);
		
		if(!$result) die ("Database access failed :" . $conn->error);
		
		$rows = $result->num_rows;
		return $rows;
	}
	
	function fix_string($string){
		if(get_magic_quotes_gpc()){
			$string = stripslashes($string);
		}
		return htmlentities($string);
	}
?>