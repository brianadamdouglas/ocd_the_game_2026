<?php // object->property|method means object to the right is a property of the object on the left
	require_once 'connect.php';
	
	$query = "SELECT * FROM classics";
	$result = $conn->query($query);
	
	if(!$result) die ($conn->error);
	
	$rows = $result->num_rows;
	for ($i = 0; $i < $rows; $i++) {
		$result->data_seek($i);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		echo 'Author: ' 	. $row['author'] . '<br>';
		echo 'Title: ' 		. $row['title'] . '<br>';
		echo 'Category: ' 	. $row['category'] . '<br>';
		echo 'Year: ' 		. $row['year'] . '<br>';
		echo 'ISBN: ' 		. $row['isbn'] . '<br><br>';
	}
	
	$result->close();
	$conn->close();

?>