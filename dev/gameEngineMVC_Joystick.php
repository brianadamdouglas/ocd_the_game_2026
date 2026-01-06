<?php

//VARIABLES
	$handler="";
	$verifiedUser = "false";
	init();
	
	function init(){
		checkCookie();
		checkLoggedIn();
	}
	
	
	function checkLoggedIn(){
		global $handler;
		global $verifiedUser;
		if($handler == ""){
			if($verifiedUser == "true"){	
				$handler = "loggedIn";
			}else{
				$handler = "registerNow";
			}
		}
	}
	
	
	function checkCookie(){
		global $verifiedUser;
		if(isset($_COOKIE['endgamesCookie'])) {	
			$verifiedUser = "true";
		}	
	}



	$gamebuilder = <<<GAMEBUILDER
	<!DOCTYPE html>
<html>
	<head>
		<title>The Game</title>
		
		<meta name="viewport" content="width=1252, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, target-densitydpi=device-dpi">
		
		<!-- Include jQuery Mobile stylesheets -->
		<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
		<link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
		<link rel="manifest" href="/manifest.json">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
		<meta name="theme-color" content="#ffffff">
		 <link rel="stylesheet" type="text/css" href="../css/gameboard_mobile.css">
		
		
		<script src="js_MVC_Joystick/jQuery_v2_1_3.js"></script> 
		
		<script type="text/javascript">
		    $(document).bind("mobileinit", function () {
		        $.event.special.tap.tapholdThreshold = 10
		    });
		</script>
		
		<!-- Include the jQuery Mobile library -->
		<script src="js_MVC_Joystick/jquery.mobile-1.4.5.js"></script>
		<script src="js_MVC_Joystick/jquerymobile-swipeupdown.js"></script>  
		<script src="js_MVC_Joystick/jquery.easing.1.3.js"></script>
		<script src="js_MVC_Joystick/e-smart-hittest-jquery.js"></script>
		<!-- CORE CLASSES -->
		<script src="js_MVC_Joystick/globals.js"></script>
		<script src="js_MVC_Joystick/ImageLoading.js"></script>
		<script src="js_MVC_Joystick/OSC.js"></script>
		<script src="js_MVC_Joystick/CLASS.js"></script>
		<script src="js_MVC_Joystick/EventHandler.js"></script>
		<script src="js_MVC_Joystick/Controller.js"></script>
		<script src="js_MVC_Joystick/View.js"></script>
		
		
		<!-- CHILD CLASSES -->
		<script src="js_MVC_Joystick/Images_Controller.js"></script>
		<script src="js_MVC_Joystick/Images_View.js"></script>
		<script src="js_MVC_Joystick/AnimationFrame_View.js"></script>
		<script src="js_MVC_Joystick/Tile_Controller.js"></script>
		<script src="js_MVC_Joystick/Tile_View.js"></script>
		<script src="js_MVC_Joystick/InteractiveTile_Controller.js"></script>
		<script src="js_MVC_Joystick/OnOffTile_Controller.js"></script>
		<script src="js_MVC_Joystick/OnOffTileControl_Controller.js"></script>
		<script src="js_MVC_Joystick/Button_Controller.js"></script>
		<script src="js_MVC_Joystick/ButtonOnOff_Controller.js"></script>
		<script src="js_MVC_Joystick/MultiStateButton_Controller.js"></script>
		<script src="js_MVC_Joystick/Button_View.js"></script>
		<script src="js_MVC_Joystick/StickyTile_Controller.js"></script>
		<script src="js_MVC_Joystick/Door_Controller.js"></script>
		<script src="js_MVC_Joystick/HingedDoor_Controller.js"></script>
		<script src="js_MVC_Joystick/HingedDoorInactive_Control.js"></script>
		<script src="js_MVC_Joystick/MovableTile_Controller.js"></script>
		<script src="js_MVC_Joystick/DropTarget_Controller.js"></script>
		<script src="js_MVC_Joystick/DropTargetRevealed_Controller.js"></script>
		<script src="js_MVC_Joystick/Mobile_View.js"></script>
		<script src="js_MVC_Joystick/NonGraphic_View.js"></script>
		<script src="js_MVC_Joystick/DispatchingNonGraphic_View.js"></script>
		<script src="js_MVC_Joystick/IDOverride_View.js"></script>
		<script src="js_MVC_Joystick/Player_Controller.js"></script>
		<script src="js_MVC_Joystick/Player_View.js"></script>
		<script src="js_MVC_Joystick/Player_OCD_Controller.js"></script>
		<script src="js_MVC_Joystick/SlideShow_Controller.js"></script>
		
		<script src="js_MVC_Joystick/StageMask_View.js"></script>
		
		<script src="js_MVC_Joystick/ThoughtBubble_View.js"></script>
		<script src="js_MVC_Joystick/ThoughtBubble_Controller.js"></script>
		<script src="js_MVC_Joystick/AnimationSequence_Controller.js"></script>
		<script src="js_MVC_Joystick/ThoughtAnimationSequence_Controller.js"></script>
		<script src="js_MVC_Joystick/StackedAnimations_Controller.js"></script>
		<script src="js_MVC_Joystick/StackedAnimations_View.js"></script>
		
		<script src="js_MVC_Joystick/Combination_View.js"></script>
		<script src="js_MVC_Joystick/Combination_Controller.js"></script>
		<script src="js_MVC_Joystick/Joystick_Controller.js"></script>
		
		<script src="js_MVC_Joystick/MultiPaneMenu_View.js"></script>
		<script src="js_MVC_Joystick/MultiPaneMenu_Controller.js"></script>
		<script src="js_MVC_Joystick/StartMenu_Controller.js"></script>
		
		
		
		
		<script src="js_MVC_Joystick/Stage_Controller.js"></script>
		
		<script src="js_MVC_Joystick/StageBuilder.js"></script>
		
		
		<script src="js_MVC_Joystick/Thought_Controller.js"></script>
		<script src="js_MVC_Joystick/Mind.js"></script>
		
		<script src="js_MVC_Joystick/Timer_View.js"></script>
		<script src="js_MVC_Joystick/Timer_Controller.js"></script>
		
		<script src="js_MVC_Joystick/Audio_View.js"></script>
		<script src="js_MVC_Joystick/Audio_Controller.js"></script>
		
		<!-- MAIN CONTROL CLASSES -->
		<script src="js_MVC_Joystick/Gameboard_Model.js"></script>
		<script src="js_MVC_Joystick/Touch_Controller.js"></script>
		<script src="js_MVC_Joystick/Main_Controller.js"></script>
		<script src="js_MVC_Joystick/StartScreen_Controller.js"></script>
		<script src="js_MVC_Joystick/RotateScreen_Controller.js"></script>
		

	</head>
	
	<body>
		<audio    id='myAudio'><source src='audio/OCD.mp3'></audio> 
		<div id="mask"></div>
		<!-- <script src="js_MVC_Joystick/gameBoard.js"></script> -->
		<!-- <script src="js_MVC_Joystick/startMatrix.js"></script> -->
		<script src="js_MVC_Joystick/main.js"></script>
		<script src="js_MVC_Joystick/mobileResize.js"></script>
			
	
	</body>

</html>
	
GAMEBUILDER;

	$registerbuilder = <<<REGISTERBUILDER
	<!DOCTYPE html>
<html>
<head>
	<title>Endgames</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
	<link rel="stylesheet" href="../css/normalize.css">
	<link rel="stylesheet" href="../css/style.css">
	<link rel="stylesheet" href="../css/about.css">
	<link href='http://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script>
		$(function() {
			var pull 		= $('#pull');
				menu 		= $('nav ul');
				menuHeight	= menu.height();

			$(pull).on('click', function(e) {
				e.preventDefault();
				menu.slideToggle();
			});

			$(window).resize(function(){
        		var w = $(window).width();
        		if(w > 320 && menu.is(':hidden')) {
        			menu.removeAttr('style');
        		}
    		});
		});
	</script>
</head>
<body>
	<nav class="clearfix">
		<ul class="clearfix">
			<li><a href="artworks.html">Artworks</a></li>
			<li><a href="about.html">About</a></li>
			<li><a href="registerLogin.php">Login/Register</a></li>
			<li><a href="contact.html">Contact</a></li>
		</ul>
		<a href="#" id="pull">Menu</a>
	</nav>
	<img src="../img/menuDev/logo.gif" id="logo" height="293" width="688">
	<div id="_body">
		<div id="_bodyCopy">
		<span class="title">There seems to be a problem</span><br><br>
		In order to access the artworks you need to register and login to the site.<br><br>
		If you are reaching this page in error, first of all, we apologize. 
		Please visit the contact section, 
		fill out the form and we will tackle the problem 
		as soon as is humanly possible.
		
	</div>
	
</body>
</html>
	
REGISTERBUILDER;


	

if($handler == "loggedIn"){
	echo $gamebuilder;
}else if($handler == "registerNow"){
	echo $registerbuilder;
}

	
	
	
	
		

?>