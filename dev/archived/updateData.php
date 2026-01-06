<?php
	require_once 'connect.php';
	
	$query = "UPDATE cats SET name='Charlie' WHERE name='Charly'";
	$result = $conn->query($query);
	if(!$result) die ("Database access failed: ". $conn->error);
?>