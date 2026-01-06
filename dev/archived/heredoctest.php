<?php

$formbuilder = <<<FORMBUILDER
   		<form action="sqltest.php" method="post"><pre>
   			  Author <input type="text" name="author">
   			   Title <input type="text" name="title">
   			Category <input type="text" name="category">
   			    Year <input type="text" name="year">
   			    ISBN <input type="text" name="isbn">
   			    	 <input type="submit" value="ADD RECORD">
  		</pre></form>
FORMBUILDER;
	
	echo $formbuilder;
?>