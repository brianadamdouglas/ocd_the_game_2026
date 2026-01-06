/*GAME ENGINE EXTENSION(OCD MOBILE)*/	

		/* STOP THE SCREEN FROM SCROLLING */
		
		document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
		
		
		/* var test = setInterval(testFunc, 100);
		
		function testFunc(){
			if (document.getElementById("myAudio").readyState == 4 && document.getElementById("myAudio2").readyState == 4)	{
				clearInterval(test);
				document.getElementById("myAudio").play();
				//document.getElementById("myAudio2").play();
				//document.getElementById("myAudio2").volume = 0.4;
				
			}
		} */
		
		//document.write("<audio  autoplay loop  id='myAudio'><source src='../audio/GameSong.mp3'></audio> ");
		
		//document.getElementById('myAudio').pause();
		
		//document.getElementById('myAudio').loop = true;
		
		//document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
		
		/* STOP THE SCREEN FROM SCROLLING */

		/**
		* GAME SPECIFIC GLOBALS
		*/	
		var g_angle = 0;
		var g_stageRotation = 0;//rotation of the rotater selector
		var g_moveDistance = 10;
		var g_quadSize = 100; // width and heigh of a hitTest Quadrant
		
		var g_thoughtBubble; // reference to the thoughts object
		var g_mask;
		var g_lastInteractTime;
		var g_walkInterval;
		var g_MIND;	
		var g_topZIndex = 1000;
		var g_maxLoad = 903968//1003968;
		var g_startScreenInformation;
		var g_startScreenDisclaimer;
		var g_timer;
		

/* ------------------------------   EXTENTION FUNCTIONS FOR BUILDING OFF BASIC ENGINE ---------------------------------*/		
	
		/**
		* @description Extended function that specifies GAME SPECIFIC interaction response calls for InteractiveTile Class and it's decendents 
		* @param {Class} spriteToCheck //a reference to a class instance, in this case the sprite the player has intereacted with 
		* @param {String} direction //"up", "down", "left" or "right"
		*/	
		function e_InteractionResponse(spriteToCheck, direction){
			if(spriteToCheck.checkForClass("door") && spriteToCheck.getVisibility()){
				spriteToCheck.actedUpon();
				setCanMoveForward(true);	
				
			}else if(spriteToCheck.checkForClass("movable")){
				spriteToCheck.actedUpon(direction);
				setCanMoveForward(true);	
				
			}else if(spriteToCheck.hasListener()){
				if(!spriteToCheck.checkForClass("door") && !spriteToCheck.checkForClass("sticky")){
					spriteToCheck.actedUpon();
				}
				
			}else{
				spriteToCheck.actedUpon();
			}
		}
		
		
		/**
		* @description Extended functionality that specifies GAME SPECIFIC interaction response calls beyond interactions from e_InteractionResponse
		* @param {Class} interactedObject //a reference to a class instance, in this case the sprite the player has intereacted with 
		*/		
		function e_InteractionExtendedActions(interactedObject){
			var thoughtType = interactedObject.getThoughtType();
			if(thoughtType == undefined){
				return;
			}
			//var d = new Date();
			//var timeStamp = d.getTime();
			g_MIND.addThought(thoughtType,2, getPlayerLocation());
			
			//perhaps if the thought is already in the queue and they go back it shifts to the front of the queue and the intensity increases
			//g_MIND.setPlayerStartPosition(getPlayerLocation()); 
			//g_MIND.canOCDTrigger();
			
		}
		
		
		
		/**
		* @description Extended function that specifies GAME SPECIFIC interaction response calls for the DropTarget Class
		* @param {Class} spriteToCheck //a reference to a class instance, in this case the sprite the player has intereacted with 
		* @param {Class} droppedClassReference // a reference to a class, in this case a Sticky Object
		* @return {Boolean} // returned to checkForDropTarget in main game engine
		*/
		function e_DropTargetActions(spriteToCheck, droppedClassReference ){
			if(spriteToCheck.checkForClass("dropTarget")){
				spriteToCheck.actedUpon(droppedClassReference);
				return true;
			}
			return false;
		}
		
		/**
		* @description Extended function that is a callback to the Stage Class moveStage method, which is fired during the tween
		* In this case it is used to sync the active Sticky Object(g_activeStickyObject) with the position of the Player's hand
		*/	
		function e_stageMovementProgressCallback(){
			if(g_player.getIsHoldingObject()){
				g_activeStickyObject.stickToPlayer(getPlayerTransformRect());
			}
		}
		

		
		
		
		/**
		* @description creating paired listeners for the hinged doors that are open 
		*/	
		function e_registerHingedDoors(){
			var max = g_gameboard.length;
				for(var i = 0; i<max; i++){
					var spriteToCheck = g_stageSpriteArray[i]._classReference;
					if(spriteToCheck.hasMultipleListeners()){
						for(var count = 1; count<3; count++){
							var listener = spriteToCheck["getListenerString" + count]();
							var re = new RegExp(listener,"gi");
							for(var j = 0; j< g_stageSpriteArray.length; j++){
								var name = g_stageSpriteArray[j]._name;
								if(name.match(re)!=null){			
									break;
								}
							}
							
							//console.log(g_stageSpriteArray[j]);
							spriteToCheck["setListener" + count](g_stageSpriteArray[j]._classReference);
						} 
							
					} 
				}
		}
		
		
		
		
		
		
/* ------------------------------   EXTENSION MOBILE TOUCH AND NON MOBILE KEYPRESS FUNCTIONS ---------------------------------*/		
		/**
		* @description Extended function that specifies GAME SPECIFIC interaction for the mobile button that catches swipe and tap events 
		*/			
		function e_addMobileButton(){
			$('#'+'swipeInterface').on("swipeup",e_moveUp);
			$('#'+'swipeInterface').on("swipedown",e_moveDown);
			$('#'+'swipeInterface').on("swipeleft",e_moveLeft);
			$('#'+'swipeInterface').on("swiperight",e_moveRight);
			$('#'+'swipeInterface').on("tap",e_stopAndDropOrWalk);
			$('#'+'swipeInterface').on("taphold",stickyObjectDoSomething);
			
		}


		/**
		* @description Extended function that specifies GAME SPECIFIC actions for moving the Player up the stage 
		*/			
		function e_moveUp(){
			clearInterval(g_walkInterval);
			g_player.stopWalk();
			finishLastMove();
			g_walkInterval = setInterval(e_moveForward, 90); // use .bind to correct scope
			g_player.startWalk();
			g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
		}


		/**
		* @description Extended function that specifies GAME SPECIFIC actions for turning the Player left 
		*/					
		function e_moveLeft(){
			e_stopMoving();
			finishLastMove();
			g_player.startTurnLeft();
			rotateStage(g_angle += 90);
		}


		/**
		* @description Extended function that specifies GAME SPECIFIC actions for turning the Player right 
		*/			
		function e_moveRight(){
			e_stopMoving();
			finishLastMove();
			g_player.startTurnRight()
			rotateStage(g_angle -= 90);
		}



		/**
		* @description Extended function that specifies GAME SPECIFIC actions for turning the Player 180 degrees around 
		*/			
		function e_moveDown(){
			e_stopMoving();
			finishLastMove();	
			g_player.startTurnRight()
			rotateStage(g_angle -= 180, 180);
		}
		
		

		/**
		* @description Extended function that specifies GAME SPECIFIC actions for dropping a Sticky Object or if not holding a Sticky Object, moving forward one step
		*/	
		function e_stopAndDropOrWalk(event){
			
			var d = new Date();
			var timeStamp = d.getTime();
			var clickInterval = timeStamp - g_lastInteractTime;
			g_lastInteractTime = timeStamp;
			console.log(clickInterval);
			//always stop walking
			
			e_stopMoving();
			
			// determine what they might have touched
			// need the player position for a relative point
			var playerOnStage = e_transformObjectToStageRotation($('#stage').position(), g_stageRotation, 76, 90);
			console.log($('#stage').position());
			var point = e_getTransformedPoint(playerOnStage, event.pageX, event.pageY, g_stageRotation);
			console.log(point);
			//if the item is in front of them they check to see if it is something to interact with.
			if(point.inFront){
				var itemsToTest = e_registerTouch(point);
				var touchedObject = e_getTouchPointHits(itemsToTest[0], point.x, point.y);
				if(touchedObject != null){
					var sticky = touchedObject[1];
					if(!sticky){// if the interactive item is not a sticky item
						interactWithStationaryItem(touchedObject[0]._classReference);
					}else{
						pickUpItem(touchedObject[0]._classReference);
						
					}			
				}else{ // the user youched inactive space so either drop the object they are holding or move forward
					if(g_player.getIsHoldingObject()){
						if(clickInterval<250){
							pickUpItem();
						}else{
							g_player.startWalk();
							e_moveForward();
						}
					}else{
						g_player.startWalk();
						e_moveForward();
					}
				}					
			}else{
				if(g_player.getIsHoldingObject()){
					if(clickInterval<250){	
						pickUpItem();
					}else{
						g_player.startWalk();
						e_moveForward();
					}
						
				}else{
					g_player.startWalk();
					e_moveForward();	
				}
			}
			

			//document.getElementById("myAudio").play();
			//document.getElementById("myAudio2").play();
			//document.getElementById("myAudio2").volume = 0.2;

		}
		
		
		/**
		* @description Extended function that specifies GAME SPECIFIC actions for moving the Player forward once 
		*/					
		function e_moveForward(){
			g_player.walk();
			g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
		}
		
		
		
		/**
		* @description Extended function that specifies GAME SPECIFIC actions for stopping the movement of the Player
		*/	
		function e_stopMoving(){
			clearInterval(g_walkInterval);
			g_player.stopWalk();

		}
		
		/**
		* @description Extended function from the main gameEngine's CatchKeyDown event hat specifies GAME SPECIFIC event handling
		* @param {Event Object} event //KeyDown event object 
		*/		
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
		
	
	
/* ------------------------------   EXTENTION FUNCTIONS FOR DROP TARGET ---------------------------------*/		
		/**
		* @description Extended function - fires when a player drops an object on a hamper.
		*/			
		function e_dropTargetHamper(target, droppedClassReference){
			var temp = target.getLoc();
			var loc = {x:temp.left, y:temp.top}
			g_topZIndex++;
			droppedClassReference.setLoc(((loc.x + 5) +  getRandomInt(0,25)) , ((loc.y + 3) +  getRandomInt(0,10)));
			droppedClassReference.getDiv().css('z-index', String(g_topZIndex));
			//console.log(droppedClassReference);
		}
		

		/**
		* @description Extended function - fires when a player drops an object on the bookcase
		*/			
		function e_dropTargetBookcase(target,droppedClassReference){
			
			droppedClassReference.getDiv().hide();
			for(var i in g_stageSpriteArray){
				if(g_stageSpriteArray[i]._name == "bookInBookcase"){
					g_stageSpriteArray[i]._classReference.actedUpon();
					console.log('got it');
				}
			}
			//$('#'+'bookInBookcase').show();
			
			//console.log(droppedClassReference);
		}
		
		function getRandomInt(min, max) {
 			 return Math.floor(Math.random() * (max - min)) + min;
		}
		 
		
			
		
		
/* ------------------------------   INITIALIZATION FUNCTIONS ---------------------------------*/


		/**
		* @description Extended function that specifies GAME SPECIFIC initializations 
		*/			
		function e_Init(){
				e_registerHingedDoors();
				e_addMobileButton();//not part of core
				e_addMask();
				e_addThoughtBubble();//not part of core
				e_addOCD_control();//not part of core
				//e_initializeTimer();
		}
		
		

		/**
		* @description Extended function that specifies GAME SPECIFIC initialization of the Player Class
		* @param {Object} playerInfo //an Object set in the gameboard file. It contains all the information about the player 
		*/		
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
		
		
		/**
		* @description Adds the thought bubble to the stage
		*/			
		function e_addThoughtBubble(){
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
			e_addThoughtAnimations();

		}
		
		/**
		* @description Add the thought animation sequences to the thought bubble
		*/				
		function e_addThoughtAnimations(){
			for(var i = 0; i<thoughtAnimations.length; i++){
				var frames = new Array();
				// this loop looks at teh frame count established in the gameboard.js and uses it to build out array of images, rather than listing them all
				for(var j = 0; j< thoughtAnimations[i].frameCount; j++){
					frames.push(thoughtAnimations[i].frameRoot + j + thoughtAnimations[i].frameType);
				}
				g_thoughtBubble.addAnimationSequence(thoughtAnimations[i].name, i, thoughtAnimations[i].className, thoughtAnimations[i].x, thoughtAnimations[i].y, thoughtAnimations[i].w, thoughtAnimations[i].h, frames, 0);
			}
		}
		
		/**
		* @description Adds the thought bubble to the stage
		*/			
		function e_addMask(){
			var classAcronym = maskInfo.type;
			var className = gameBoardClasses[classAcronym];	
			var imagePath = gameBoardImageLookup[classAcronym];

			var spriteID = 'masker';
			var container = "body";		
			var x = maskInfo.x ;
			var y = maskInfo.y;
			var w = maskInfo.w;
			var h = maskInfo.h;
			g_mask = new StageMask();
			g_mask.init(container, spriteID, className, x, y,w,h,imagePath,0);

		}
		
		function e_addOCD_control(){//NOT PART OF CORE
			g_MIND = new MIND();
			g_MIND.init(g_player,g_thoughtBubble);
			g_MIND.addInstance(g_MIND);
			g_MIND.setGameEnginePlayerPositionCallback(getPlayerLocation)
			g_thoughtBubble.addOCDReference(g_MIND);
			//var d = new Date();
			//var timeStamp = d.getTime();
			//OCD_object.addThought("range",timeStamp, 1);
			//OCD_object.fireLatestThought(); 
		}
		
		function e_initializeStartScreen(screenInfo){
			var className = "startScreen";	
			var spriteID = 'startScreen';
			var container = "body";	
			var x = 0;
			var y = 0;
			var w = 375;
			var h = 559;
			g_startScreen = new StartScreen();
			g_startScreen.init(container, spriteID, className, x, y,w,h);
		
			for(var i = 0; i< screenInfo.length; i++){
				var classAcronym = screenInfo[i].type;
				var className = gameBoardClasses[classAcronym];	// changeToStartScreenClasses
				var imagePath = gameBoardImageLookup[classAcronym];
				var spriteID = 'screen_tile'+i;
				var container = "startScreen";		
				var x = screenInfo[i].x;
				var y = screenInfo[i].y;
				var w = screenInfo[i].w;
				var h = screenInfo[i].h;
				var IDOverride = screenInfo[i].IDOverride;
				var buttonFunction = screenInfo[i].buttonFunction;
				var data = {container:container, spriteID:spriteID, className:className, x:x, y:y, w:w, h:h, imagePath:imagePath, buttonFunction:buttonFunction, IDOverride:IDOverride};
				g_startScreen.addTile(data);
			}
			g_startScreen.getInterfaceElement("instructions").show();
			g_startScreen.getInterfaceElement("disclaimer").show();
			
			e_initializeInformationDisplay(g_instructionElements);
			g_startScreen.setInterfaceElement("informationSlideshow", g_startScreenInformation);

			
			e_initializeDisclaimerDisplay(g_disclaimerElements);
			g_startScreen.setInterfaceElement("disclaimerSlideshow", g_startScreenDisclaimer);
			
			g_startScreen.setGameEngineStartCallback(e_startGame);
			
		}
		
		function e_initializeInformationDisplay(screenInfo){
			var className = "informationDisplay";	
			var spriteID = 'informationDisplay';
			var container = "startScreen";	
			var x = 28;
			var y = 24;
			var w = 319;
			var h = 508;
			g_startScreenInformation = new MultiPaneMenu();
			g_startScreenInformation.init(g_startScreen, container, spriteID, className, x, y,w,h);
		
			for(var i = 0; i< screenInfo.length; i++){
				var classAcronym = screenInfo[i].type;
				var className = gameBoardClasses[classAcronym];	// changeToStartScreenClasses
				var imagePath = gameBoardImageLookup[classAcronym];
				var spriteID = 'information_tile'+i;
				var container = "informationDisplay";		
				var x = screenInfo[i].x;
				var y = screenInfo[i].y;
				var w = screenInfo[i].w;
				var h = screenInfo[i].h;
				var IDOverride = screenInfo[i].IDOverride;
				var buttonFunction = screenInfo[i].buttonFunction;
				var data = {container:container, spriteID:spriteID, className:className, x:x, y:y, w:w, h:h, imagePath:imagePath, buttonFunction:buttonFunction, IDOverride:IDOverride};
				g_startScreenInformation.addTile(data);
				
			}
			
			g_startScreenInformation.getInterfaceElement("back").show();
			g_startScreenInformation.getInterfaceElement("forward").show();
			g_startScreenInformation.getInterfaceElement("close").show();
			
		}
		
		function e_initializeDisclaimerDisplay(screenInfo){
			var className = "disclaimerDisplay";	
			var spriteID = 'disclaimerDisplay';
			var container = "startScreen";	
			var x = 28;
			var y = 24;
			var w = 319;
			var h = 508;
			g_startScreenDisclaimer = new MultiPaneMenu();
			g_startScreenDisclaimer.init(g_startScreen, container, spriteID, className, x, y,w,h);
		
			for(var i = 0; i< screenInfo.length; i++){
				var classAcronym = screenInfo[i].type;
				var className = gameBoardClasses[classAcronym];	// changeToStartScreenClasses
				var imagePath = gameBoardImageLookup[classAcronym];
				var spriteID = 'disclaimer_tile'+i;
				var container = "disclaimerDisplay";		
				var x = screenInfo[i].x;
				var y = screenInfo[i].y;
				var w = screenInfo[i].w;
				var h = screenInfo[i].h;
				var IDOverride = screenInfo[i].IDOverride;
				var buttonFunction = screenInfo[i].buttonFunction;
				var data = {container:container, spriteID:spriteID, className:className, x:x, y:y, w:w, h:h, imagePath:imagePath, buttonFunction:buttonFunction, IDOverride:IDOverride};
				g_startScreenDisclaimer.addTile(data);
				
			}
			g_startScreenDisclaimer.getInterfaceElement("close").show();
			
		}
		
		function e_initializeTimer(){
			var className = "timerDisplay";	
			var spriteID = 'timerDisplay';
			var container = "body";	
			var x = 0;
			var y = 0;
			var w = 100;
			var h = 30;
			g_timer = new TimerDisplay(container, spriteID, className, x, y, w, h);
			g_timer.addTimer(1.5);
			
			
		}
		
		
		/* ------------------------------   POSITIONING AND QUADRANT FUNCTIONS ---------------------------------*/
	
			
		
		
		function e_transformObjectToStageRotation(position, stageRotation, objectWidth, objectHeight){
			
			//I need to not only enter the width and height but the position on the screen.
			// thsis original method is very specific to the placement of the player because the player marks position 0,0 for the stage as the roator is alligned to it.
			var loc = {x:position.left, y:position.top}; //send in the position of the stage
	  		var playerW = objectWidth;
	  		var playerH = objectHeight;
	 		 // this case/switch returns a point that is always transformed to align with the top and left of the given stage space
	 		 switch(stageRotation){
							  case 0:
								  var x = -(loc.x +(playerW/2));
								  var y = -(loc.y + (playerH/2));
								  var w = playerW;
								  var h = playerH;
								  break;
							  case 90:
								  var x = -(loc.y + (playerH/2));
								  var y = (loc.x - (playerW/2));
								  var w = playerH;
								  var h = playerW;
								  break;
							  case 180:
								  var x = loc.x - (playerW/2)
								  var y = loc.y - (playerH/2)	  
								  var w = playerW;
								  var h = playerH;						
								  break;
							  case 270:
								  var x = (loc.y - (playerH/2));
								  var y = -(loc.x +(playerW/2));
								  var w = playerH;
								  var h = playerW;				  
								  break;
			  }
			  var data = {x:Math.round((x)),y:Math.round((y)),w:w,h:h}		
			  return data;
		}
			  
		    /**
		* @description Returns a rect(t,r,b,l) of the player on the stage
	  * @return {Object} rect 
	  */
	  function e_getTransformedPoint(data, touchX, touchY, stageRotation){
	      	var centerX = data.x +38;
	      	var centerY = data.y +45;
			switch(stageRotation){
						  case 0:
						  	  var targetX = touchX - g_rotaterX;
							  var targetY = touchY - g_rotaterY;
							  var x = centerX + targetX;
							  var y = centerY + targetY;
							  
							  break;
						  case 90:
							  var targetX = touchX - g_rotaterX;
							  var targetY = touchY - g_rotaterY;
							  var x = centerX + targetY;
							  var y = centerY - targetX;
							  
							  break;
						  case 180:
							  var targetX = touchX - g_rotaterX;
							  var targetY = touchY - g_rotaterY;
							  var x = centerX - targetX;
							  var y = centerY - targetY;	
							  			
							  break;
						  case 270:
							  var targetX = touchX - g_rotaterX;
							  var targetY = touchY - g_rotaterY;
							  var x = centerX - targetY;
							  var y = centerY + targetX;			  
							  break;
							  
			}	
			var inFront = (targetY < 0) ? true : false;
			var data = {
				x:x,
				y:y,
				inFront:inFront
			}
			
			return 	data;		  
			
	  }
  
		/**
		* @description Returns the quadrant that the user has touched
		* @param {Point} initData
		* @param {Number} id // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
		*/			
		function e_registerTouch(initData){
			
			var rect = {top:initData.y,right:initData.x,bottom:initData.y,left:initData.x}
			var data = returnRoundedRectAndDifferences(rect);
			//console.log([data.t,data.l])
			var quadrant = new Array();
			quadrant.push(g_hitTestQuadrants[data.t][data.l]);
			return(quadrant); 
			
		}
		
		/**
		* @description Returns any objects that are under the point on stage that the user has touched
		* @param {Point} quadrants
		* @param {Number} id // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
		*/	
		function e_getTouchPointHits(quadrants, x, y){
				
			var hits = new Array();
			for(var i = 0; i<quadrants.length; i++){
				var k = '#' + g_stageSpriteArray[quadrants[i]]._name;			
				var rect = g_stageSpriteArray[quadrants[i]]._classReference.getRect();
				if(x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom){
					var isInteractive = $(k).hasClass( "interactive" );
					var isSticky = $(k).hasClass( "sticky" );
					if(isInteractive){
						return ([g_stageSpriteArray[quadrants[i]], isSticky]);
					}
					

				}  
			}
			return (null);
			
				
				
		}
		
		
	/* ------------------------------   START SCREEN EXTENSION FUNCTIONS ---------------------------------*/		
		
		function e_startGame(){
			console.log("pushed");
			//if(((g_loadTotal/334958) * 100) == 100){
				g_startScreen.hide();
				/* g_startScreen.getInterfaceElement("start").hide();
				g_startScreen.getInterfaceElement("instructions").hide();
				g_startScreen.getInterfaceElement("disclaimer").hide(); */
				g_mask.show();
				g_rotater.show();
				g_player.show();
				//g_timer.startClock();
				console.log(g_loadTotal);
			//}
		}
		
		
		function e_displayStartButton(){
			g_startScreen.getInterfaceElement("start").show();
			
		}
		
		
		function e_displayProgress(bytes){
			g_loadTotal += bytes;
			console.log(g_loadTotal);
			//console.log(((g_loadTotal/g_maxLoad) * 100) + "%");
			if((g_loadTotal/g_maxLoad)>=1){
				e_displayStartButton();
			}
			
		}	
		
			
		
		
		
		
		