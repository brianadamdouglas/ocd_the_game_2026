<?php 
	require_once 'connect.php';
	
	$query = "DESCRIBE CATS";
	$result = $conn->query($query);
	if(!$result) die ("Database access failed: " . $conn->error);
	
	$rows = $result->num_rows;
	
	echo "<table><tr><th>Column</th><th>Type</th><th>Null</th><th>Keys</th></tr>";
	
	for ($i = 0; $i < $rows; $i++) {
		
		$result->data_seek($i);
		$row = $result->fetch_array(MYSQLI_NUM);
		
		echo"<tr>";
		for ($j = 0; $j < 4 ; $j++) {
			echo "<td>$row[$j]</td>";
		}
		echo"</tr>";
	}

	echo "</table>";


 ?>