<?php

	require_once 'connect.php';
	if (isset($_POST['id'])		&&
		isset($_POST['family'])		&&
		isset($_POST['name'])	&&
		isset($_POST['age']))
	{
		
		$id			= get_post($conn, 'id');
		$family		= get_post($conn, 'family');
		$name		= get_post($conn, 'name');
		$age		= get_post($conn, 'age');
		$query		= "INSERT INTO cats VALUES" .
		 "('$id','$family','$name','$age')";
		$result		= $conn->query($query);
		if (!$result) echo "INSET failed :$query<br>" .
		 $conn->error . "<br><br>";
	}
	
	$formbuilder = <<<FORMBUILDER
   		<form action="addingDataIntoCats.php" method="post"><pre>
   			      ID <input type="text" name="id">
   			  Family <input type="text" name="family">
   			    Name <input type="text" name="name">
   			     Age <input type="text" name="age">
   			    	 <input type="submit" value="ADD RECORD">
  		</pre></form>
  		
FORMBUILDER;

	echo $formbuilder;
	
	$conn->close();
	
	
	function get_post($conn, $var)
	{
		return $conn->real_escape_string($_POST[$var]);
	}
	
?>