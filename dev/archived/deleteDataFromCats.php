<?php
	require_once 'connect.php';
	
	$query = "DELETE FROM cats WHERE name='Growler'";
	$result = $conn->query($query);
	if(!$result) die ("Database access failed: ". $conn->error);
?>