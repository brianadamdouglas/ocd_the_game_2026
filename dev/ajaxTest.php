<?php // urlpost php file
	require_once '../connect.php'; 
	
	$test = "";
	if(isset($_POST['test'])){
		$test = fix_string($_POST['test']);
		echo $test;
	}
	
	function fix_string($string){
		if(get_magic_quotes_gpc()){
			$string = stripslashes($string);
		}
		return htmlentities($string);
	}
?>