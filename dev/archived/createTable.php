<?php 
	require_once 'connect.php';
	
	$query = "CREATE TABLE cats(
		id SMALLINT NOT NULL AUTO_INCREMENT,
		family VARCHAR(32) NOT NULL,
		name VARCHAR(32) NOT NULL,
		age TINYINT NOT NULL,
		PRIMARY KEY (id)
	)";
	
	$result	= $conn->query($query);
	if(!$result) die ("Database access failed: " . $conn->error);

 ?>