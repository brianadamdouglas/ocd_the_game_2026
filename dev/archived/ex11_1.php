<?php
	echo <<<_HTMLBUILD
	
	<html>
		<head>
			<title>Form Test</title>
		</head>
		<body>
			<form method="POST" action="ex11_1.php">
				What is your name?
				<input type="text" name="name">
				<input type="submit">
			</form>
		</body>
	</html>
	
_HTMLBUILD;
?>