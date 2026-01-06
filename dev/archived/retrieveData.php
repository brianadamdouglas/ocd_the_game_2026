<?php
	require_once 'connect.php';
	
	$query = "SELECT * FROM cats";
	$result = $conn->query($query);
	if (!$result) die ("Database access failed: " . $conn->error);
	
	$rows = $result->num_rows;
	echo "<table><tr><th>Id</th> <th>Family</th><th>Name</th><th>Age</th></tr>";
	
	for ($i = 0; $i < $rows; $i++) 
		{
			$result->data_seek($i);
			$row = $result->fetch_array(MYSQLI_NUM);
			echo "<tr>";
		
			for ($k = 0; $k < 4; $k++) 
				{
					echo "<td>$row[$k]</td>";
				}

		
		echo"</tr>";
	}

	
	
	echo "</table>";
?>