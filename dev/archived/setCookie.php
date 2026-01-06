<?php //SET COOKIE
	
	
	
	setcookie('testCookie', '$a,$b, return "$a met $b at the mall";', (time()+60 * 60 * 24 * 7),'/');
	
?>