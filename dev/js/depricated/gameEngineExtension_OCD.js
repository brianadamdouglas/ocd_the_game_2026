/*GAME ENGINE EXTENSION(OCD)*/	

		/**
		* GAME SPECIFIC GLOBALS
		*/	
		var g_angle = 0;
		var g_stageRotation = 0;//rotation of the rotater selector
		var g_moveDistance = 10;
		var g_quadSize = 100; // width and heigh of a hitTest Quadrant
		
		var g_thoughtBubble; // reference to the thoughts object
		var g_lastInteractTime;
		var g_MIND;	

/* ------------------------------   EXTENTION FUNCTIONS FOR BUILDING OFF BASIC ENGINE ---------------------------------*/		
		function e_InteractionResponse(spriteToCheck){
			if(spriteToCheck.checkForClass("door") && spriteToCheck.getVisibility()){
				spriteToCheck.actedUpon();
				setCanMoveForward(true);	
				
			}else if(spriteToCheck.hasListener()){
				if(!spriteToCheck.checkForClass("door") && !spriteToCheck.checkForClass("sticky")){
					spriteToCheck.actedUpon();
				}
				
			}else{
				spriteToCheck.actedUpon();
			}
		}
		function e_InteractionExtendedActions(interactedObject){
			var thoughtType = interactedObject._classReference.getThoughtType();
			var d = new Date();
			var timeStamp = d.getTime();
			g_MIND.addThought(thoughtType,timeStamp,1);
			g_MIND.setPlayerStartPosition(getPlayerLocation());
			//g_MIND.canOCDTrigger(); 
		}
		
		function e_PlayerInitialize(playerInfo){
			var classAcronym = playerInfo.type;
			var className = gameBoardClasses[classAcronym];	
			var imagePath = gameBoardImageLookup[classAcronym];
			var spriteID = 'player';
			var container = "body";	
			var x = playerInfo.x ;
			var y = playerInfo.y;
			var w = playerInfo.w;
			var h = playerInfo.h;
			var stopFrame = playerInfo.stopFrame;
			var walkFrames = playerInfo.walkFrames;
			var turnLeftFrame = playerInfo.turnLeftFrame;
			var turnRightFrame = playerInfo.turnRightFrame;
			var interactFrame = playerInfo.interactFrame;
			var stickyLiftOffset = playerInfo.stickyLiftOffset;
			g_player = new Player_OCD();
			g_player.init(container, spriteID, className, x, y,w,h,imagePath, stopFrame, walkFrames, turnLeftFrame, turnRightFrame, interactFrame, stickyLiftOffset);
		}

		
		function e_CatchKeyDown(event){
			var key = (event.which)
				if(String.fromCharCode(key) == "W"){
					finishLastMove();
					g_player.startWalk();
					//g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
				}
				if(String.fromCharCode(key) == "X"){
					finishLastMove();	
					g_player.startTurnRight()
					rotateStage(g_angle -= 180, 180);
				}
				if(String.fromCharCode(key) == "A"){
					finishLastMove();
					g_player.startTurnLeft();
					rotateStage(g_angle += 90);
				}
				if(String.fromCharCode(key) == "D"){
					finishLastMove();
					g_player.startTurnRight()
					rotateStage(g_angle -= 90);
				}
				/*button press / interact with object*/
				if(String.fromCharCode(key) == "K"){ // pick up item
					pickUpItem();				
				}
				
				if(String.fromCharCode(key) == "L"){ // interact with items
						
					if(!g_player.getIsHoldingObject()){
						interactWithStationaryItem();
					}else{
						stickyObjectDoSomething();
					}
					
				}
		}
		
		function e_Init(){
				addThoughtBubble();//not part of core
				addOCD_control();//not part of core
		}
		

		
			
		
		
/* ------------------------------   INITIALIZATION FUNCTIONS ---------------------------------*/
		/**
		* Adds the thought bubble to the stage
		*/			
		function addThoughtBubble(){
			var classAcronym = thoughtInfo.type;
			var className = gameBoardClasses[classAcronym];	
			var imagePath = gameBoardImageLookup[classAcronym];
				
			var spriteID = 'thoughtBubble';
			var container = "body";		
			var x = thoughtInfo.x ;
			var y = thoughtInfo.y;
			var w = thoughtInfo.w;
			var h = thoughtInfo.h;
			g_thoughtBubble = new ThoughtBubble();
			g_thoughtBubble.init(container, spriteID, className, x, y,w,h,imagePath,0);
			addThoughtAnimations();

		}
			
			
		/**
		* Add the thought animation sequences to the thought bubble
		*/				
		function addThoughtAnimations(){
			for(var i = 0; i<thoughtAnimations.length; i++){
				var frames = new Array();
				// this loop looks at teh frame count established in the gameboard.js and uses it to build out array of images, rather than listing them all
				for(var j = 0; j< thoughtAnimations[i].frameCount; j++){
					frames.push(thoughtAnimations[i].frameRoot + j + thoughtAnimations[i].frameType);
				}
				g_thoughtBubble.addAnimationSequence(thoughtAnimations[i].name, i, thoughtAnimations[i].className, thoughtAnimations[i].x, thoughtAnimations[i].y, thoughtAnimations[i].width, thoughtAnimations[i].height, frames, 0);
			}
		}
		
		
		
		
/* ------------------------------   MIND FUNCTIONS ---------------------------------*/		
		function addOCD_control(){//NOT PART OF CORE
			g_MIND = new MIND();
			g_MIND.init(g_player,g_thoughtBubble, getPlayerLocation);
			g_MIND.addInstance(g_MIND);
			g_thoughtBubble.addOCDReference(g_MIND);
			//var d = new Date();
			//var timeStamp = d.getTime();
			//OCD_object.addThought("range",timeStamp, 1);
			//OCD_object.fireLatestThought(); 
		}			