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
				var classAcronym = playerInfo.type;
				var className = gameBoardClasses[classAcronym];	
				var imagePath = gameBoardImageLookup[classAcronym];
				
				var spriteID = 'player';
				var container = "body";		
				var x = playerInfo.x ;
				var y = playerInfo.y;
				var w = playerInfo.w;
				var h = playerInfo.h;
				g_player = new Player();
				g_player.init(container, spriteID, className, x, y,w,h,imagePath,0);

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
				
				var spriteID = 'sprite_tile'+id;
				var stage = "stage";		
				var x = g_gameboard[id].x;
				var y = g_gameboard[id].y;
				var w = g_gameboard[id].w;
				var h = g_gameboard[id].h;
				
				var newTile = g_stage.addTile(spriteID, className, x, y,w,h,imagePath, listener, listenerString, thoughtType, visibility, g_stageSpriteArray);			
				//console.log(newTile.getClass());
				if(newTile.getClass() != "Tile"){
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
				
				var key = (event.which)
				if(String.fromCharCode(key) == "W"){
					finishLastMove();
					g_player.startWalk();
					g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
				}
				if(String.fromCharCode(key) == "X"){
					finishLastMove();	
					rotateStage(g_angle -= 180, 180);
				}
				if(String.fromCharCode(key) == "A"){
					finishLastMove();
					rotateStage(g_angle += 90);
				}
				if(String.fromCharCode(key) == "D"){
					finishLastMove();
					rotateStage(g_angle -= 90);
				}
				/*button press / interact with object*/
				if(String.fromCharCode(key) == "S"){
					checkForInteraction();	
				}
				
			}
			
			
			/**
			* Catches keystroke events
			*/
			function catchKeyUp(event){
				var key = (event.which)
				
				if(key == 87){
					finishLastMove();
					g_player.stopWalk();
					g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
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
				g_stageRotation = 360 * percent;
				if(rot != 180){
					var _duration = 300;
				}else{
					var _duration = 400;
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
													complete:checkForHit
											});
				
			}
			
			
			
			/**
			* Resets the position of the stage if the character has intersected object
			*/			
			function resetPosition(hits){//array
				var targetRect = hits[0]._classReference.getRect();
				var targetRectAdjusted = returnStageRectAdjustedForOffset(targetRect);
				var targetName = hits[0]._classReference.getID();//using for debugging, remove later
				var playerPointOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var playerRectAdjusted = g_player.getTransformedRect(playerPointOnStage, g_stageRotation);
				var distance = g_moveDistance;
				
				g_stage.repositionStage(targetRectAdjusted, playerRectAdjusted, distance, g_stageRotation);			
			}
			

			
			/**
			* Finishes any existing animations of the stage
			*/			
			function finishLastMove(){
				$('#rotater').finish();
				$('#stage').finish();
			}
			
			/**
			* Get the position of the player relative to the stage 
			* @return {Object} loc x and y position of player
			*/					
			function getPlayerLocation(){//transformPlayerToStage
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var loc = {x:playerOnStage.x, y:playerOnStage.y}
				return loc;
			}
			
			
			
			
/* ------------------------------   EVALUATION FUNCTIONS ---------------------------------*/						
			
			
			/**
			* Checks for intersection of character and stage elements, sets g_canMoveForward global(t/f) 
			* @return {Array} hitObstacle[1] items that the character intersects
			*/			
			function checkForHit(){
				var hitObstacle = getHits();
				if(hitObstacle[0]){
					g_canMoveForward = false;
					resetPosition(hitObstacle[2]);
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
					var hit = $('#player').objectHitTest({"object":$(k)});
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
			
			
			function checkForInteraction(){
				g_player.stopWalk();		
				var predictedObjectArray = g_lastObstacles;
				var playerOnStage = g_player.transformPlayerToStage($('#stage').position(), g_stageRotation, g_stageWidth, g_stageHeight);
				var playerRect = g_player.getTransformedRect(playerOnStage, g_stageRotation, g_quadSize);
				var possibleInteraction = false;
				/*
					There is an Array of items that are in the quadrants that are within interactive distance of the character.
					We need to check to see which ones are within 10 pixels and those that are can be interacted with.
				*/
				for(var i = 0; i<predictedObjectArray.length; i++){
					var spriteToCheck = g_stageSpriteArray[predictedObjectArray[i]]._classReference;
					var targetRect = spriteToCheck.rect;
					switch(g_stageRotation){
							case 0:
								if((targetRect.bottom >= playerRect.top - 10 && targetRect.bottom <= playerRect.bottom && targetRect.bottom < playerRect.top) && targetRect.right >= playerRect.left && targetRect.left<= playerRect.right){
									possibleInteraction = true;
								}
								break;
							case 90:
								if((targetRect.right>= playerRect.left - 10 && targetRect.right <= playerRect.right ) && targetRect.top <= playerRect.bottom && targetRect.bottom >= playerRect.top){
									possibleInteraction = true;
								}
								break;
							case 180:
								if((targetRect.top <= playerRect.bottom + 10 && targetRect.top > playerRect.bottom) && targetRect.right >= playerRect.left && targetRect.left <= playerRect.right){
											
										possibleInteraction = true;
								}
								break;
							case 270:
								if((targetRect.left<= playerRect.right + 10 && targetRect.left > playerRect.left) && targetRect.top <= playerRect.bottom && targetRect.bottom >= playerRect.top){
									possibleInteraction = true;
								}
								break;
					}
					if(possibleInteraction){
							
						/*
							After determining that there is an object in front of the character, we need to determine whether the item is interactive.
							If the object has an "Interactive" class in it's class chain then it checks to see if it is a door.
							If it is a door then it checks the visibility. The reason for this is that the door elements are in pairs.
							By opening or closing a door, one of the doors is made visible while the other is made invisible
						*/
						var isInteractive = $('#' + g_stageSpriteArray[predictedObjectArray[i]]._name).hasClass( "interactive" );	
						if(isInteractive){
							e_InteractionResponse(spriteToCheck);
							e_InteractionExtendedActions(g_stageSpriteArray[predictedObjectArray[i]]);
							break;
								
								
						}
						possibleInteraction = false;
					}
						
						
				}
					
				//g_thoughtBubble.fireLatestThought('test');
					
					
				// OCD start checking to see if it can begin firing a thought.
					
				// looking at items in quadrant in relation to the player
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
				/* console.log("+++++++++++");
				console.log(rect); */
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
				//console.log(data)
				if(tile.getClass() != "Tile"){
					g_hitTestQuadrants[data.t][data.l].push(id);
					if(data.hDiff == 1 ){
						g_hitTestQuadrants[data.t][data.l + 1].push(id);
					}
					if(data.vDiff == 1){
						g_hitTestQuadrants[data.t + 1][data.l].push(id);
					}
					if(data.hDiff == 1 && data.vDiff == 1){
						g_hitTestQuadrants[data.t + 1][data.l + 1].push(id);;
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