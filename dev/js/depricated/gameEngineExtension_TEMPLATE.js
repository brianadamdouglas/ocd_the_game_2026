		/**
		* GAME SPECIFIC GLOBALS
		*/	
		var g_stageWidth = ;//set width of stage
		var g_stageHeight =	;//set height of stage
		var g_angle = ;//set the default angle used for calculations
		var g_stageRotation = ;//set the default angle used for rotation atribute of the stage, should be same as g_angle
		var g_moveDistance = ;//set the rate in pixels that the player moves
		var g_quadSize = ; //set the default width and height of an hitTest quadrant

		

/* ------------------------------   EXTENTION FUNCTIONS FOR BUILDING OFF BASIC ENGINE ---------------------------------*/		
		function e_InteractionResponse(spriteToCheck){
		    /*if(spriteToCheck.checkForClass("test") && spriteToCheck.getVisibility()){
				spriteToCheck.actedUpon();
				setCanMoveForward(true);	
			}else{
				spriteToCheck.actedUpon();
			} */
		}
		
		function e_InteractionExtendedActions(interactedObject){
			//var testType = interactedObject._classReference.someGetter();		
		}
		
		function e_Init(){
			//add additional init function calls here
		}
		
		
/* ------------------------------   INITIALIZATION FUNCTIONS ---------------------------------*/
		