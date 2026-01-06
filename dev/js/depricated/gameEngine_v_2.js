			/**
			* GLOBALS
			*/	
			var g_canMoveForward = true;
			var g_stageSpriteArray = new Array();//Array of all the tiles on the stage
			var g_lastObstacles = new Array(); // obstacles to check for interaction
			var g_hitTestQuadrants = new Array(); //multidimentional array(rows/cols) that divides the stage for hitTest speed improvements
			var g_player; // refernce to player object
			var g_rotater; // refernce to rotater object
			var g_stage; // refernce to stage object
			var g_activeStickyObject = null;
			var g_lastRotation;
					
			init();
				
			
			/**
			* Initialize the game
			*/
			function init(){
				addPlayer();
				addRotater();
				addStage();
				createHitTestQuadrants();
				buildStage();
				registerPairs();
				$(document).keypress(catchKeyPress);
				$(document).keydown(catchKeyDown);
				$(document).keyup(catchKeyUp);
				e_Init();
			}
			
/* ------------------------------   BUILD STAGE FUNCTIONS ---------------------------------*/
/*
	The construction of the game space is built upon creating an user experience
	that combines the traditional top down game play with a first person perspective.
	In a traditional first person shooter, the world revolves around the player,
	that is what I am playing with here.
	
	The stacking order of the DIVs are as follows:
	
	<thoughtBubble> -- based on the ThoughtBubble.js class
	<character> -- based on the Player.js class
	<mask>
	<rotator>
		<stage>
			<game board elements> -- elements are all based on te Tile.js class as the parent, there are many children
*/


			/**
			* Adds the player to the stage
			*/			
			function addPlayer(){
				e_PlayerInitialize(playerInfo);
					
				
				

			}
			
		
			
			/**
			* Builds the stage based on instructions from gameBoard.js
			*/			
			function buildStage(){
				var max = g_gameboard.length;
				for(var i = 0; i<max; i++){
					addSprite(i);
				}
			}
			
			/**
			* Adds a rotater element to the mask(#mask)container
			*/			
			function addRotater(){		
				var container = "mask";
				var spriteID = "rotater";	
				var className = "rotater";
				g_rotater = new Rotater();
				g_rotater.init(container, spriteID, className, g_rotaterX, g_rotaterY, g_stageWidth, g_stageHeight);
			}
			
			/**
			* Adds a stage element to the rotation(#rotator) container
			*/			
			function addStage(){		
				var container = "rotater";
				var spriteID = "stage";	
				var className = "stage";
				g_stage = new Stage();
				g_stage.init(container, spriteID, className, -g_rotaterX, -g_rotaterY, g_stageWidth, g_stageHeight);
				g_stage.setGameEngineMovementCallback(checkForHit);
				g_stage.setGameEngineCanMoveCallback(setCanMoveForward);
				g_stage.setGameEngineMovementProgressCallback(getPlayerPositionWhileMoving);
			}
			
			/**
			* Adds a sprite to the stage and a reference to the sprite to the g_stageSpriteArray
			* @param {Number} id 
			*/			
			function addSprite(id){
				g_stageSpriteArray.push(createSprite(id));
				
			}
			
			
			/**
			* Creates a sprite
			* @param {Numner} id 
			* @return {Object} _name:Name of Sprite, _classReference: what type of Tile class it is
			*/			
			function createSprite(id){
				var classAcronym = g_gameboard[id].type;
				var className = gameBoardClasses[classAcronym];	
				var imagePath = gameBoardImageLookup[classAcronym];
				var listener = g_gameboard[id].listener;
				var listenerString = g_gameboard[id].listener;//used for door objects though I may pass all listeners to be registered over to other function
				var thoughtType = g_gameboard[id].thoughtType;
				var visibility = g_gameboard[id].state;
				var stickyHoldingOffset = g_gameboard[id].stickyHoldingOffset;
				var IDOverride = g_gameboard[id].IDOverride;
				var dropTargetFunction = g_gameboard[id].dropTargetFunction;
				var moveObject = g_gameboard[id].moveObject;
				
				var spriteID = 'sprite_tile'+id;
				var stage = "stage";		
				var x = g_gameboard[id].x;
				var y = g_gameboard[id].y;
				var w = g_gameboard[id].w;
				var h = g_gameboard[id].h;
				
				var newTile = g_stage.addTile(spriteID, className, x, y,w,h,imagePath, listener, listenerString, thoughtType, visibility, g_stageSpriteArray, stickyHoldingOffset, IDOverride, dropTargetFunction, moveObject);			
				//console.log(newTile.getClass());
				if(newTile.getClass() != "Tile" && newTile.getClass() != "MobileControl"){
					registerRect(newTile, id);// use the id to lookup from stage SpriteArray
				}
				return {_name:newTile.getID(), _classReference:newTile};
				
				
				
			}
			
			
			/**
			* Registers pairs of sprites that listen and control(Doors, plugs, etc.)
			*/			
			function registerPairs(){
				var max = g_gameboard.length;
				for(var i = 0; i<max; i++){
					var spriteToCheck = g_stageSpriteArray[i]._classReference;
					if(spriteToCheck.hasListener()){
						var listener = spriteToCheck.getListenerString();
						var re = new RegExp(listener,"gi");
						for(var j = 0; j< g_stageSpriteArray.length; j++){
							var name = g_stageSpriteArray[j]._name;
							if(name.match(re)!=null){			
								break;
							}
						}
						spriteToCheck.setListener(g_stageSpriteArray[j]._classReference);	
					}
				}
			}
			
			
			/**
			* Catches keystroke events
			*/
			function catchKeyDown(event){
				e_CatchKeyDown(event);	
			}
			
			
			/**
			* Catches keystroke events
			*/
			function catchKeyUp(event){
				var key = (event.which)
				if(key == 87){
					//finishLastMove();
					g_player.stopWalk();
					//g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
				}
				if(key != 87){
					g_player.stopWalk();
				}
				if(key == 75){//lift up item
					if(g_player.getIsHoldingObject()){
						getPlayerPositionWhileMoving();
					}	
				}
				
			}
			
			
			/**
			* Catches keystroke events
			*/
			function catchKeyPress(event){
				var key = (event.which)

				if(String.fromCharCode(key) == "w"){
					finishLastMove();
					g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
				}
				
			}
			
			
/* ------------------------------   CONTROL STAGE FUNCTIONS ---------------------------------*/
/*
	The movment of the game space is, as described above, built around a first person shooter as well as traditional top down game play.
	The player never physically moves around the space, rather the space rotates around them and moves downwards in whatever direction
	that they are walking. The player always appears to be facint the top of the screen. 
	
	Every time the player moves or turns(they can turn left 90, - 90 or 180 degrees), the engine checks to see if the player has run into an object.
	The space on the stage that is anylized is relatively small, based on a global called g_quadSize, at the writing of this comment the optinal size is 50 pixels.
	
	One of the most critical functions of this set is the resetPosition function. What I discovered while developing the engine is that Javascript has no method
	to go local to global or global to local. When the <rotater> div is spun, all the <tiles> inside it have entirely new rects. Because of this, we actually
	rewrite the rect of the character to fit the rect of the rotated stage, rather than rewriting all the elements "current rect spaces".
	
*/			
		
			
			
			/**
			* Rotate the stage
			* @param {Number} degrees
			* @param {Number} rot Used for determening rotation speed
			*/
			function rotateStage(degrees, rot){
				g_canMoveForward = true;
				var remainder = (degrees/360)%1;
				if(remainder < 0){
					var percent = 1 + remainder;	
				}else{
					var percent = remainder;
				}
				g_lastRotation = g_stageRotation
				g_stageRotation = 360 * percent;
				getPlayerPositionWhileTurning();
				if(rot != 180){
					var _duration = 200;
				}else{
					var _duration = 300;
				}
				

				$('#rotater').animate(
										{target: degrees}, 
											{step: function(now,fx) {
														$(this).css('-webkit-transform','rotate('+now+'deg)'); 
														$(this).css('-moz-transform','rotate('+now+'deg)');
														$(this).css('transform','rotate('+now+'deg)');
												   }
													,duration:_duration,
													easing:'easeOutCirc',
													complete:checkForHitRotate
											});
				
			}
			
			
			
			/**
			* Resets the position of the stage if the character has intersected object
			*/			
			function resetPosition(hitObstacle){//array
				var hits = hitObstacle[2];
				var targetRect = hits[0]._classReference.getRect();
				var targetRectAdjusted = returnStageRectAdjustedForOffset(targetRect);
				var targetName = hits[0]._classReference.getID();//using for debugging, remove later
				var playerPointOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var playerRectAdjusted = g_player.getTransformedRect(playerPointOnStage, g_stageRotation);	
				g_stage.repositionStage(targetRectAdjusted, playerRectAdjusted, g_stageRotation);
		
			}
			

			
			/**
			* Finishes any existing animations of the stage
			*/			
			function finishLastMove(){
				$('#rotater').finish();
				$('#stage').finish();
			}
			
			/**
			* Get the position of the player relative to the stage, used for the OCD functions
			* @return {Object} loc x and y position of player
			*/					
			function getPlayerLocation(){//transformPlayerToStage
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var loc = {x:playerOnStage.x, y:playerOnStage.y}
				return loc;
			}
			
/* ------------------------------   INTERACTION FUNCTIONS ---------------------------------*/			
	
			/**
			* Attaches a sticky object to the PLAYER, appears that the player will pick up an object
			* @param {stickyObject} StickyTile
			*/
			function stickyObjectLifted(stickyObject){
				g_activeStickyObject = stickyObject;
				g_player.setIsHoldingObject(true);
				getPlayerPositionWhileMoving();
			}	
			
			
			/**
			* Unattach a sticky object to the PLAYER, appears that the player drops an object
			* @param {stickyObject} StickyTile
			*/
			function stickyObjectDropped(stickyObject){
				g_activeStickyObject = null; 
				var data = getPlayerTransformRect();
				stickyObject.setDroppedRect(data);
				var id = stickyObject.getID().replace("sprite_tile","");
				var hitTarget = checkForDropTarget(stickyObject); // need some sort of boolean return at this point to not alow item to register on stage
				
				console.log(hitTarget);
				if(!hitTarget){
					registerRect(stickyObject, Number(id)); 
				}
				//g_activeStickyObject do something
			}	
			
			/**
			* Some sticky objects are OnOffControllers. This propogates the interaction of that object with it's listener.
			*/
			function stickyObjectDoSomething(){
				g_activeStickyObject.actedUpon();
			}
			
			
			/**
			* The player can drop a Sticky Object on a Drop Target. Each Drop Target has a custom function associated with it. These are 
			* found in the gameEngineExtension.js file
			* @param {stickyObject} StickyTile
			*/
			function checkForDropTarget(stickyObject){
				var results = checkForInteraction();
				if(results.length > 0){
					for(var i = 0; i< results.length; i++){
						var spriteToCheck = results[i].sprite;
						var hitDropTarget =  e_DropTargetActions(spriteToCheck, stickyObject);
						if(hitDropTarget){
							g_player.setIsHoldingObject(false);	
							return true;	
						}
					}
				}
				return false;
				
			}
			
			
			/**
			* Player picks up a Sticky Object. In the stand alone version this occurs by the user pressing the "K" key when standing in front of an object.
			*/
			function pickUpItem(target){ //boolean
				g_player.stopWalk();
				
				if(g_player.getIsHoldingObject()){
					g_player.startInteract();
					getPlayerPositionWhileMoving();
					g_player.setIsHoldingObject(false);
					g_activeStickyObject.attachUnattach();
					return;
				}	
				
				if(g_player.getIsHoldingObject()){ // if they are holding an object then it they can not interact
					return;
				}
				g_player.startInteract();	
				if(target == undefined){
					var results = checkForInteraction();
				}else{
					var results = checkForInteraction_mobile(target);
				}
				if(results.length > 0){
					for(var i = 0; i< results.length; i++){
						var spriteToCheck = results[i].sprite;
						if(spriteToCheck.checkForClass("sticky")){
							g_player.setIsHoldingObject(true);	
							spriteToCheck.attachUnattach();	
							e_InteractionResponse(results[i].sprite);
							break;
						}
						
					}
				}
			}
			
			
			/**
			* Player picks up a Sticky Object. In the mobile version this occurs by the user touching the object they want to pick up.
			* The item will lift if they are within the specified distance for interactions.
			* @param {target} StickyTile
			*/
			function pickUpItem_mobile(target){ //boolean
				g_player.stopWalk();
				
				if(g_player.getIsHoldingObject()){
					g_player.startInteract();
					getPlayerPositionWhileMoving();
					g_player.setIsHoldingObject(false);
					g_activeStickyObject.attachUnattach();
					return;
				}	
				
				if(g_player.getIsHoldingObject()){ // if they are holding an object then it they can not interact
					return;
				}
				g_player.startInteract();	
				
				var results = checkForInteraction_mobile(target);
				if(results.length > 0){
					for(var i = 0; i< results.length; i++){
						var spriteToCheck = results[i].sprite;
						if(spriteToCheck.checkForClass("sticky")){
							g_player.setIsHoldingObject(true);	
							spriteToCheck.attachUnattach();	
							e_InteractionResponse(results[i].sprite);
							break;
						}
						
					}
				}
			}
			
			
			/**
			* Player interacts with a stationary object, such as an OnOffTile. The item will activate if they are within the specified distance for interactions.
			*/
			function interactWithStationaryItem(target){ //boolean
				g_player.stopWalk();
				g_player.startInteract();	
				
				if(target == undefined){
					var results = checkForInteraction();	
				}else{
					var results = checkForInteraction_mobile(target);
				}
				
				if(results.length > 0){
					for(var i = 0; i< results.length; i++){
						e_InteractionResponse(results[i].sprite,results[i].direction);
						e_InteractionExtendedActions(results[i].interactedObject);
					}
				}
					
				//g_thoughtBubble.fireLatestThought('test');
					
					
				// OCD start checking to see if it can begin firing a thought.
					
				// looking at items in quadrant in relation to the player
			}
			

			/**
			* Player interacts with a stationary object, such as an OnOffTile. In the mobile version this occurs by the user touching the object they want to activate.
			* The item will lift if they are within the specified distance for interactions.
			* @param {target} StickyTile
			*/		
			function interactWithStationaryItem_Mobile(target){ //boolean
				g_player.stopWalk();
				g_player.startInteract();	
					
				var results = checkForInteraction_mobile(target);
				if(results.length > 0){
					for(var i = 0; i< results.length; i++){
						e_InteractionResponse(results[i].sprite,results[i].direction);
						e_InteractionExtendedActions(results[i].interactedObject);
					}
				}
					
				//g_thoughtBubble.fireLatestThought('test');
					
					
				// OCD start checking to see if it can begin firing a thought.
					
				// looking at items in quadrant in relation to the player
			}
			
			
			function checkForInteraction(){ //boolean
	
				var predictedObjectArray = g_lastObstacles;
				//console.log(predictedObjectArray);
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var playerRect = g_player.getTransformedRect(playerOnStage, g_stageRotation, g_quadSize);
				var possibleInteraction = false;
				var direction; // use for pushing/pulling items
				var results = new Array();
				/*
					There is an Array of items that are in the quadrants that are within interactive distance of the character.
					We need to check to see which ones are within 10 pixels and those that are can be interacted with.
				*/
				
				for(var i = 0; i<predictedObjectArray.length; i++){
					var spriteToCheck = g_stageSpriteArray[predictedObjectArray[i]]._classReference;
					//console.log(spriteToCheck);
					var targetRect = spriteToCheck.rect;
					switch(g_stageRotation){
							case 0:
								if((targetRect.bottom >= playerRect.top - 10 && targetRect.bottom <= playerRect.bottom) && (targetRect.right >= playerRect.left - 5 && targetRect.left <= playerRect.right + 5)){
									possibleInteraction = true;
									direction = "UP"
								}
								break;
							case 90:
								if((targetRect.right>= playerRect.left - 10 && targetRect.right <= playerRect.right ) && (targetRect.top <= playerRect.bottom + 5  && targetRect.bottom >= playerRect.top - 5)){
									direction = "LEFT"
									possibleInteraction = true;
								}
								break;
							case 180:
								if((targetRect.top <= playerRect.bottom + 10 && targetRect.top > playerRect.bottom) && (targetRect.right >= playerRect.left - 5 && targetRect.left <= playerRect.right + 5)){
										direction = "DOWN"	
										possibleInteraction = true;
								}
								break;
							case 270:
								if((targetRect.left<= playerRect.right + 10 && targetRect.left > playerRect.left) && (targetRect.top <= playerRect.bottom + 5 && targetRect.bottom >= playerRect.top - 5)){
									direction = "RIGHT"
									possibleInteraction = true;
								}
								break;
					}
					if(possibleInteraction){
							
						var isInteractive = $('#' + g_stageSpriteArray[predictedObjectArray[i]]._name).hasClass( "interactive" );
						
						if(isInteractive){
							results.push({sprite:spriteToCheck, interactedObject:g_stageSpriteArray[predictedObjectArray[i]], direction:direction});		
						}
						possibleInteraction = false;
					}
						
						
				}
				
				return results;
					
			}
			
			
			function checkForInteraction_mobile(target){ //boolean
				
				var predictedObjectArray = [target];
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var playerRect = g_player.getTransformedRect(playerOnStage, g_stageRotation, g_quadSize);
				var possibleInteraction = false;
				var direction; // use for pushing/pulling items
				var results = new Array();
				/*
					There is an Array of items that are in the quadrants that are within interactive distance of the character.
					We need to check to see which ones are within 10 pixels and those that are can be interacted with.
				*/
				
				for(var i = 0; i<predictedObjectArray.length; i++){
					var spriteToCheck = predictedObjectArray[i];
					
					var targetRect = spriteToCheck.getRect();
					var catchableDistance = 20;
					switch(g_stageRotation){
							case 0:
								if((targetRect.bottom >= playerRect.top - catchableDistance && targetRect.bottom <= playerRect.bottom) && (targetRect.right >= playerRect.left - 5 && targetRect.left <= playerRect.right + 5)){
									direction = "UP";
									possibleInteraction = true;
								}
								break;
							case 90:
								if((targetRect.right>= playerRect.left - catchableDistance && targetRect.right <= playerRect.right ) && (targetRect.top <= playerRect.bottom + 5  && targetRect.bottom >= playerRect.top - 5)){
									direction = "LEFT";
									possibleInteraction = true;
								}
								break;
							case 180:
								if((targetRect.top <= playerRect.bottom + catchableDistance && targetRect.top > playerRect.bottom) && (targetRect.right >= playerRect.left - 5 && targetRect.left <= playerRect.right + 5)){
										direction = "DOWN";	
										possibleInteraction = true;
								}
								break;
							case 270:
								if((targetRect.left<= playerRect.right + catchableDistance && targetRect.left > playerRect.left) && (targetRect.top <= playerRect.bottom + 5 && targetRect.bottom >= playerRect.top - 5)){
									direction = "RIGHT";
									possibleInteraction = true;
								}
								break;
					}
					
					if(possibleInteraction){
							
						var isInteractive = target.getDiv().hasClass( "interactive" );
						
						if(isInteractive){
							results.push({sprite:spriteToCheck, interactedObject:g_stageSpriteArray[predictedObjectArray[i]], direction:direction});		
						}
						possibleInteraction = false;
					}
						
						
				}
				
				return results;
					
			}
					
			
/* ------------------------------   EVALUATION FUNCTIONS ---------------------------------*/	


			
			
			
			function checkForHitRotate(){
				g_player.stopWalk();
				checkForHit();
			}
						
			
			/**
			* Checks for intersection of character and stage elements, sets g_canMoveForward global(t/f) 
			* @return {Array} hitObstacle[1] items that the character intersects
			*/			
			function checkForHit(){
				getPlayerPositionWhileMoving();
				var hitObstacle = getHits();
				if(hitObstacle[0]){
					var hits = hitObstacle[2];
					for(var i = 0; i<hits.length ; i++){ // updated 8/20 so that it checks all items of possible interaction
						var isObstacle = hits[i]._classReference.getDiv().hasClass( "obstacle" );
						if(isObstacle){	
							g_canMoveForward = false;
							resetPosition(hitObstacle);
							clearInterval(g_walkInterval);
							g_player.stopWalk();
						}
					}
					
					
				}else{
					g_canMoveForward = true;
				}
				g_lastObstacles = hitObstacle[1];
				
			}			
			
			
			/**
			* Calculates which items the character has intersected 
			* @return {Array} [{Boolean}, {Array} obstacles]
			*/			
			function getHits(){
				var mergedQuadrants = returnPossibleTargets();
				//console.log(mergedQuadrants);
				
				var hits = new Array();
				for(var i = 0; i<mergedQuadrants.length; i++){
					var k = '#' + g_stageSpriteArray[mergedQuadrants[i]]._name;
					 if($('#player').objectHitTest({"object":$(k)})){
						var hit = true;
						
					}else{
						var hit = false;
					} 
					
					
					if(hit && g_stageSpriteArray[mergedQuadrants[i]]._classReference.getVisibility()){// if it hits an item
						hits.push(g_stageSpriteArray[mergedQuadrants[i]]);
					}
				}
				
				
				if(hits.length > 0){
					return ([true, mergedQuadrants,hits]);
				}else{
					return ([false, mergedQuadrants]);
				}
				
			}
			
			
			
			

			/**
			* Gets rotation of the stage
			* @param {jQuery Object} obj 
			* @return {Number} g_angle
			*/
			function getRotationDegrees(obj) {
 			   var matrix = obj.css("-webkit-transform") ||
			    obj.css("-moz-transform")    ||
			    obj.css("-ms-transform")     ||
			    obj.css("-o-transform")      ||
			    obj.css("transform");
			    if(matrix !== 'none') {
			        var values = matrix.split('(')[1].split(')')[0].split(',');
			        var a = values[0];
			        var b = values[1];
			        var g_angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
			    } else { var g_angle = 0; }
			    return g_angle;
			}
			
			
			function returnStageRectAdjustedForOffset(rect){
				var newRect = {top:0,right:0,bottom:0,left:0};
				for(var i in rect){
					newRect[i] = rect[i];
				}
				//console.log(newRect);
				return (newRect);
			}
			
			function returnRoundedRectAndDifferences(rect){
				var t = Math.floor(rect.top/g_quadSize);// subtract g_containerOffsetToAlignCharacter to offset the border
				var r = Math.floor(rect.right/g_quadSize);
				var b = Math.floor(rect.bottom/g_quadSize);
				var l = Math.floor(rect.left/g_quadSize);
				var vDiff = b - t;
				var hDiff = r - l;
				var data = {t:t,
						 r:r,
						 b:b,
						 l:l,
						 hDiff:hDiff,
						 vDiff:vDiff
				}
				return(data);
				
			}
			
			function setCanMoveForward(bool){
				g_canMoveForward = bool;
			}
			
			
			
			



/* ------------------------------   HITTEST QUADRANTS FUNCTIONS ---------------------------------*/
/*
	In an effort to speed up the gmaeplay, I have divided the entire gamespace up into quadrants, based on the size of the global g_quadSize variable. 
	At the writing of this comment I am not sure why I am adding 2 to the result in the createHitTestQuadrants, I assume it resolves some issure with remainders,
	once I figure it out I will add the info after this comment line.
	
	All the tiles are registered to quadrants with the rotater being at 0 degrees. Each time the player moves in some fashion, it determines the rotation of the 
	stage and changes the characters relationship to the quadrants, the only item that reregisters is the player. The player can overlay up to four quadrants, as
	can any tile in the game.
	
	Ultimately we can have all the elements of up to four quadrants in an array to check against. If a <tile> is registered in more than one of the quadtrants the
	player overlays then we delete any duplicates in the array. This will inprove the efficiency of the hit testing.
	
	To speed the transformation of the player to the stage elements as they turn en masse, I have written 3 funtions that handle the players position on the stage.
	registerPlayer
	transformPlayerToStage(inside Player.js)
	getTransformedRect(inside Player.js)
*/


			/**
			* Divides the stage up into quadrants to speed up the hitTests
			*/
			function createHitTestQuadrants(){
				var quadsColumns = (g_stageWidth/g_quadSize) + 1;
				var quadsRows = (g_stageHeight/g_quadSize) + 1;
				for(var i = 0; i < quadsRows; i++){
					g_hitTestQuadrants[i] = new Array();
					for(var j = 0; j<quadsColumns; j++){
						g_hitTestQuadrants[i].push(new Array());
					}
					
				}
				
			}
			
			
			
			/**
			* Registers a tile into all the quadrants in which it's rect overlays
			* @param {Class} tile
			* @param {Number} id // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
			*/			
			function registerRect(tile, id){
				var tileToAdd = tile;
				var rect = tileToAdd.getRect();
				var data = returnRoundedRectAndDifferences(rect);
				//console.log(tileToAdd);
				//console.log(data)
				if(tile.getClass() != "Tile"){
					g_hitTestQuadrants[data.t][data.l].push(id);
					tileToAdd.registerAQuad([data.t,data.l,id]);
					if(data.hDiff == 1 ){
						g_hitTestQuadrants[data.t][data.l + 1].push(id);
						tileToAdd.registerAQuad([data.t,(data.l+ 1),id]);
					}
					if(data.vDiff == 1){
						g_hitTestQuadrants[data.t + 1][data.l].push(id);
						tileToAdd.registerAQuad([(data.t+1),data.l,id]);
					}
					if(data.hDiff == 1 && data.vDiff == 1){
						g_hitTestQuadrants[data.t + 1][data.l + 1].push(id);
						tileToAdd.registerAQuad([(data.t+1),(data.l+ 1),id]);
					}
				}
				
			}
			
			function removeRect(data){
				var temp = g_hitTestQuadrants[data[0]][data[1]];
				for(var i = 0; i<temp.length; i++){
					if(temp[i] == data[2]){
						g_hitTestQuadrants[data[0]][data[1]].splice(i, 1);
						break;
					}
				}
				
			}
			
			/**
			* Determines the quadrants that the player's rect overlays, a player can overlay at most 4 quadrants
			* @param {Object} point // x,y coordinates of the player on the stage.
			* @return {Array} mergedQuadrants //a list of all the sprites on the stage that exist in the quadrants that the player overlays
			*/			
			function registerPlayer(data){		
				var rect = {
					top:data.y,
					right:(data.x+data.w),
					bottom:(data.y+data.h),
					left:data.x		
				}
				//console.log(rect)
				var data = returnRoundedRectAndDifferences(rect);
				var quadrantsToMerge = new Array();
				quadrantsToMerge.push(g_hitTestQuadrants[data.t][data.l]);
				if(data.hDiff == 1){
					quadrantsToMerge.push(g_hitTestQuadrants[data.t][data.l + 1]);
				}
				if(data.vDiff == 1){
					quadrantsToMerge.push(g_hitTestQuadrants[data.t + 1][data.l]);
				}
				if(data.hDiff == 1 && data.vDiff == 1){
					quadrantsToMerge.push(g_hitTestQuadrants[data.t + 1][data.l + 1]);
				}
				var mergedQuadrants = mergeQuadrants(quadrantsToMerge);
				return(mergedQuadrants); 

			}
			
			
			/**
			* Returns an Array of g_stageSpriteArray indexes to test for hitTesting
			* @return {Array} possibleTargets //a list of all the sprites on the stage that exist in the quadrants that the player overlays
			*/				
			function returnPossibleTargets(){
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var point = playerOnStage;
				var possibleTargets = registerPlayer(point);
				return possibleTargets;
			}
			
			
			
			/**
			* Merges the targets that the player overlays and removes duplicates
			* @param {Array} a multidimensional array of up to 4 quadrants.
			* @return {Array} cleanedQuadrants //an array of g_stageSpriteArray indexes
			*/				
			function mergeQuadrants(a){
				var mergedQuadrants = new Array();
				var alreadyExists = false;
				//console.log(a);
				for(var i = 0; i<a.length; i++){
					for(var j = 0; j<a[i].length; j++){
						mergedQuadrants.push(a[i][j]);
						
					}
				}
				var cleanedQuadrants = new Array();
				var arrayLength = mergedQuadrants.length;
				for(var k = 0; k<arrayLength; k++){
					var last = mergedQuadrants.shift();
						if(!checkForDuplicates(last, mergedQuadrants)){
							cleanedQuadrants.push(last);
						}
					
				}
				
				return cleanedQuadrants;
			}
			
			
			/**
			* Removes duplicates from an array
			* @param {Object} item //an index from the array that is being cleaned
			* @param {Array} a //the array to be cleaned
			* @return {Boolean} if a duplicate exists return true else false
			*/				
			function checkForDuplicates(item, a){
				for(var i = 0; i<a.length; i++){
					if(a[i] == item){
						return true;
					}
				}
				return false;
			}
			

/* ------------------------------   POSITIONING FUNCTIONS ---------------------------------*/
			
			function getPlayerTransformRect(){
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var playerRect = g_player.getTransformedRect(playerOnStage, g_stageRotation, g_quadSize);	
				return (playerRect);
			}	
			
			function getPlayerPositionWhileMoving(){
				if(g_player.getIsHoldingObject()){
					g_activeStickyObject.stickToPlayer(getPlayerTransformRect());
				}
			}
			
			function getPlayerPositionWhileTurning(){
				if(g_player.getIsHoldingObject()){
					var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_lastRotation, g_stageWidth, g_stageHeight);
					var playerRect = g_player.getTransformedRect(playerOnStage, g_lastRotation, g_quadSize);	
					g_activeStickyObject.stickForTurn(playerRect);
				}
			}
			
			
  /**
  * Returns a point(x,y) of the player on the stage
  * @return {Array} point //a loc of the player
  */			
  

   function transformObjectToStageRotation(position, stageRotation, objectWidth, objectHeight){
	  var loc = {x:position.left, y:position.top};
	  var objectW = objectWidth;
	  var objectH = objectHeight;
	  // this case/switch returns a point that is always transformed to align with the top and left of the given stage space
	  switch(stageRotation){
					  case 0:
						  var x = -(loc.x +(objectW/2));
						  var y = -(loc.y + (objectH/2));
						  var w = objectW;
						  var h = objectH;
						  break;
					  case 90:
						  var x = -(loc.y + (objectH/2));
						  var y = (loc.x - (objectW/2));
						  var w = objectH;
						  var h = objectW;
						  break;
					  case 180:
						  var x = loc.x - (objectW/2)
						  var y = loc.y - (objectH/2)	  
						  var w = playerW;
						  var h = objectW;						
						  break;
					  case 270:
						  var x = (loc.y - (objectH/2));
						  var y = -(loc.x +(objectW/2));
						  var w = objectH;
						  var h = objectW;				  
						  break;
	  }
	  var data = {x:Math.round((x)),y:Math.round((y)),w:w,h:h}		
	  return data;

  } 
			
			
			
/* ------------------------------   EXTENTION FUNCTIONS FOR BUILDING OFF BASIC ENGINE ---------------------------------*/			
			
		/* function e_InteractionResponse(spriteToCheck){
			//Add actions related to the response of interacted objects
		}
		
		   function e_InteractionExtendedActions(interactedObject){
			//Add additional actions after player has interacted with object
		}
		
		function e_Init(){
			//Add additional calls to game specific intitialization functions	
		} */