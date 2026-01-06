<?php
	function countList(){
		if(func_num_args() == 0 ){
			return false;
		}else{
			$count = 0;
			
			for($i = 0; $i < func_num_args(); $i++){
				$count += func_get_arg($i);	
			}
			
			return $count;
		}
	}
	
	function takesTwo($a,$b){
		if(isset($a)){
			echo " a is set\n";
		}
		if(isset($b)){
			echo " $b is set\n";
		}
	}
	
	echo countList(1,5,9);
	
	echo "<br>";
	
	echo "With two arguments:\n";
	takesTwo(1,2);
	
	echo "With one argument:\n";
	takesTwo(1);
?>