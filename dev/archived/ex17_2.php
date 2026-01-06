<?php // urlpost php file
	if(isset($_POST['url'])){
		echo file_get_contents('http://' . sanitizeString($_POST['url']));
	}
	
	function sanitizeString($var){
		$var = strip_tags($var);
		$var = htmlentities($var);	
		return stripslashes($var);
	}
?>