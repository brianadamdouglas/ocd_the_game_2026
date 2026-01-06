<?php
	class Entertainment{}
	
	class Clown extends Entertainment{}
	
	class Job{}
	
	function handleEntertainment(Entertainment $a, callable $callback = NULL){
		echo "Handling " . get_class($a) . "fun\n";
		
		if ($callback !== NULL){
			$callback();	
		}	
	}
	
	$callback = function(){
		// do something	
	};
	
	handleEntertainment(new Entertainment);
	handleEntertainment(new Clown);
	handleEntertainment(new Job, $callback);
?>