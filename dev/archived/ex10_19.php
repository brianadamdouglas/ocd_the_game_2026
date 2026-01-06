<?php
	require_once 'connect.php';
	$stmt = $conn->prepare('INSERT INTO classics VALUES(?,?,?,?,?)');
	$stmt->bind_param('sssss', $author, $title, $category, $year, $isbn);
	
	$author = 'Emily Brontë';
	$title = 'Wuthering Heights';
	$category = 'Classic Fiction';
	$year = '1847';
	$isbn = '9780553212587';
	
	$stmt->execute();
	printf("%d Row inserted.\n", $stmt->affected_rows);
	$stmt->close();
	$conn->close();
	
?>