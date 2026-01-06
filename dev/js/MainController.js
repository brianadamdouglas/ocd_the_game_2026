var MainController = Class.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
construct: function() { 
		this._canMoveForward = true;
		this._stageSpriteArray = new Array();//Array of all the tiles on the stage
		this._lastObstacles = new Array(); // obstacles to check for interaction
		this._hitTestQuadrants = new Array(); //multidimentional array(rows/cols) that divides the stage for hitTest speed improvements
		this._player; // refernce to player object
		this._rotater; // refernce to rotater object
		this._subStage;
		this._startScreen;
		this._stage; // refernce to stage object
		this._activeStickyObject = null;
		this._lastRotation;
		
		this._angle = 0;
		this._stageRotation = 0;//rotation of the rotater selector
		this._moveDistance = 10;
		this._quadSize = 100; // width and heigh of a hitTest Quadrant
		
		this._thoughtBubble; // reference to the thoughts object
		this._mask;
		this._lastInteractTime;
		this._walkInterval;
		this._MIND;	
		this._topZIndex = 1000;
		this._maxLoad = 903968//1003968;
		this._startScreenInformation;
		this._startScreenDisclaimer;
		this._timer;
  },
  
init: function(){
		this.addStartScreen();// i am placing this first in the execution list beacuse I need these elements to install first.
		this.addPlayer();
		this.addRotater();
		this.addStage();
		this.createHitTestQuadrants();
		this.buildStage();
		this.registerPairs();
		this.registerHingedDoors();
		this.addMobileButton();//not part of core
		this.addMask();
		this.addThoughtBubble();//not part of core
		this.addOCD_control();//not part of core
		$(document).keypress(catchKeyPress);
		$(document).keydown(catchKeyDown);
		$(document).keyup(catchKeyUp);
},
		
addStartScreen:	function (){
		e_initializeStartScreen(g_startScreenElements);
},
	
	
	/**
	* @description Adds the player to the stage
	*/			
addPlayer:function (playerInfo){
		var data = {
			classAcronym:playerInfo.type,
			className:gameBoardClasses[classAcronym],
			imagePath:gameBoardImageLookup[classAcronym],
			spriteID:'player',
			container:"body",
			x:playerInfo.x,
			y:playerInfo.y,
			w:playerInfo.w,
			h:playerInfo.h,
			stopFrame:playerInfo.stopFrame,
			walkFrames:playerInfo.walkFrames,
			turnLeftFrame:playerInfo.turnLeftFrame,
			turnRightFrame:playerInfo.turnRightFrame,
			interactFrame:playerInfo.interactFrame,
			stickyLiftOffset:playerInfo.stickyLiftOffset,
			stickyLiftOffset:playerInfo.stickyLiftOffset
		}
		this._player = new Player_OCD_Controller();
		var newView = new Player_OCD_View();
		this._player.bindView(newView,data);
		
},
	

	
	/**
	* @description Builds the stage based on instructions from gameBoard.js
	*/			
buildStage:	function (gameboard){
		var max = gameboard.length;
		for(var i = 0; i<max; i++){
			this.addSprite(i);
		}
},
	
	/**
	* @description Adds a rotater element to the mask(#mask)container
	*/			
addRotater:	function(x,y,w,h){	
		var data = {
			container:"mask",
			spriteID:"rotater",
			className:"rotater",
			x:x,
			y:y,
			w:w,
			h:h
		}	
		
		this._rotater = new Rotater_Controller();
		var newView = new Rotater_View();
		this._rotater.bindView(newView,data);
},
	
	/**
	* @description Adds a stage element to the rotation(#rotator) container
	*/			
addStage:function (x,y,w,h){		
		var data = {
			container:"rotater",
			spriteID:"stage",
			className:"stage",
			x:x,
			y:y,
			w:w,
			h:h
		}
		this._stage = new Stage_Controller();
		var newView = new Stage_View();
		this._stage.bindView(newView,data);
		
		/* g_stage.setGameEngineMovementCallback(checkForHit);
		g_stage.setGameEngineCanMoveCallback(setCanMoveForward);
		g_stage.setGameEngineMovementProgressCallback(e_stageMovementProgressCallback); */
},
	
	/**
			* @description Adds a sprite to the stage and a reference to the sprite to the g_stageSpriteArray
			* @param {Number} id 
			*/			
addSprite: function (id){
		this._stageSpriteArray.push(this.createSprite(id));
				
},
			
			
	/**
	* @description Creates a sprite
	* @param {Numner} id 
	* @return {Object} _name:Name of Sprite, _classReference: what type of Tile class it is
	*/			
createSprite: function (id){
		var data = {
			classAcronym:g_gameboard[id].type,
			className:gameBoardClasses[classAcronym],	
			imagePath:gameBoardImageLookup[classAcronym],
			listener:g_gameboard[id].listener,
			listenerString:g_gameboard[id].listener,//used for door objects though I may pass all listeners to be registered over to other function
			listener1:g_gameboard[id].listener1,
			listenerString1:g_gameboard[id].listener1,
			listener2:g_gameboard[id].listener2,
			listenerString2:g_gameboard[id].listener2,
			thoughtType:g_gameboard[id].thoughtType,
			visibility:g_gameboard[id].state,
			stickyHoldingOffset:g_gameboard[id].stickyHoldingOffset,
			IDOverride :g_gameboard[id].IDOverride,
			dropTargetFunction:g_gameboard[id].dropTargetFunction,
			moveObject:g_gameboard[id].moveObject,
			spriteID = 'sprite_tile'+id,
			stage = "stage",		
			x = g_gameboard[id].x,
			y = g_gameboard[id].y,
			w = g_gameboard[id].w,
			h = g_gameboard[id].h
		}
		
		
		var newTile = this._stage.addTile(data);			
		if(newTile.getClass() != "Tile" && newTile.getClass() != "MobileControl"){
			this.registerRect(newTile, id);// use the id to lookup from stage SpriteArray
		}
		return {_name:newTile.getID(), _classReference:newTile};
		
		
		
},
	
	
	/**
	* @description Registers pairs of sprites that listen and control(Doors, plugs, etc.)
	*/			
registerPairs: function(){
		var max = g_gameboard.length;
		for(var i = 0; i<max; i++){
			var spriteToCheck = this._stageSpriteArray[i]._classReference;
			if(spriteToCheck.hasListener()){
				var listener = spriteToCheck.getListenerString();
				var re = new RegExp(listener,"gi");
				for(var j = 0; j< this._stageSpriteArray.length; j++){
					var name = this._stageSpriteArray[j]._name;
					if(name.match(re)!=null){			
						break;
					}
				}
				spriteToCheck.setListener(this._stageSpriteArray[j]._classReference);	
			}
		}
},
	
	
	/**
	* @description Catches keystroke events(Key Down)
	*/
catchKeyDown: function (event){
	var key = (event.which)
	if(String.fromCharCode(key) == "W"){
		this.finishLastMove();
		this._player.startWalk();
		//g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
	}
	if(String.fromCharCode(key) == "X"){
		this.finishLastMove();	
		this._player.startTurnRight()
		this.rotateStage(this._angle -= 180, 180);
	}
	if(String.fromCharCode(key) == "A"){
		this.finishLastMove();
		this._player.startTurnLeft();
		this.rotateStage(g_angle += 90);
	}
	if(String.fromCharCode(key) == "D"){
		this.finishLastMove();
		this._player.startTurnRight()
		this.rotateStage(this._angle -= 90);
	}
	/*button press / interact with object*/
	if(String.fromCharCode(key) == "K"){ // pick up item
		this.pickUpItem();				
	}
	
	if(String.fromCharCode(key) == "L"){ // interact with items
			
		if(!this._player.getIsHoldingObject()){
			this.interactWithStationaryItem();
		}else{
			this.stickyObjectDoSomething();
		}
		
	}	
},
	
	
	/**
	* @description Catches keystroke events(Key Up)
	*/
catchKeyUp:	function(event){
	var key = (event.which)
	if(key == 87){
		//finishLastMove();
		this._player.stopWalk();
		//g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
	}
	if(key != 87){
		this._player.stopWalk();
	}
	if(key == 75){//lift up item
		if(this._player.getIsHoldingObject()){
			this.stageMovementProgressCallback();
		}	
	}
		
},

/**
			* @description Catches keystroke events(Press)
			*/
catchKeyPress: function(event){
	var key = (event.which)

	if(String.fromCharCode(key) == "w"){
		this.finishLastMove();
		this._stage.moveStage(this._moveDistance, this._stageRotation, this._canMoveForward);
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
* @description Rotate the stage
* @param {Number} degrees
* @param {Number} rot Used for determening rotation speed
*/
rotateStage: function(degrees, rot){
	this._canMoveForward = true;
	var remainder = (degrees/360)%1;
	if(remainder < 0){
		var percent = 1 + remainder;	
	}else{
		var percent = remainder;
	}
	this._lastRotation = this._stageRotation
	this._stageRotation = 360 * percent;
	this.getPlayerPositionWhileTurning();
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
										complete:this.checkForHitRotate
								});
	
},
			
			
			
/**
* @description Resets the position of the stage if the character has intersected object
* @param {Class} hitObstacle
*/			
resetPosition: function(hitObstacle){//array
	var hits = hitObstacle[2];
	var targetRect = hits[0]._classReference.getRect();
	var targetRectAdjusted = this.returnStageRectAdjustedForOffset(targetRect);
	var targetName = hits[0]._classReference.getID();//using for debugging, remove later
	var playerPointOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, g_stageWidth, g_stageHeight);
	var playerRectAdjusted = this._player.getTransformedRect(playerPointOnStage, this._stageRotation);	
	this._stage.repositionStage(targetRectAdjusted, playerRectAdjusted, this._stageRotation);

},



/**
* @description Finishes any existing animations of the stage
*/			
finishLastMove: function(){
	$('#rotater').finish();
	$('#stage').finish();
},

/**
* @description Get the position of the player relative to the stage, used for the OCD functions
* @return {Object} loc x and y position of player
*/					
getPlayerLocation: function (){//transformPlayerToStage
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, g_stageWidth, g_stageHeight);
	var loc = {x:playerOnStage.x, y:playerOnStage.y}
	return loc;
},

/* ------------------------------   INTERACTION FUNCTIONS ---------------------------------*/			
	
/**
* @description Attaches a sticky object to the PLAYER, appears that the player will pick up an object
* @param {StickyTile} stickyObject
*/
stickyObjectLifted: function(stickyObject){
	this._activeStickyObject = stickyObject;
	this._player.setIsHoldingObject(true);
	this.stageMovementProgressCallback();
},	


/**
* @description Unattach a sticky object to the PLAYER, appears that the player drops an object
* @param {StickyTile} stickyObject
*/
stickyObjectDropped: function(stickyObject){
	this._activeStickyObject = null; 
	var data = this.getPlayerTransformRect();
	stickyObject.setDroppedRect(data);
	var id = stickyObject.getID().replace("sprite_tile","");
	var hitTarget = this.checkForDropTarget(stickyObject); // need some sort of boolean return at this point to not alow item to register on stage
	if(!hitTarget){
		this.registerRect(stickyObject, Number(id)); 
	}
},	

/**
* @description Some sticky objects are OnOffControllers. This propogates the interaction of that object with it's listener.
*/
stickyObjectDoSomething: function (){
	this._activeStickyObject.actedUpon();
},


/**
* @description The player can drop a Sticky Object on a Drop Target. Each Drop Target has a custom function associated with it. These are 
* found in the gameEngineExtension.js file
* @param {StickyTile} stickyObject
*/
checkForDropTarget: function(stickyObject){
	var results = this.checkForInteraction();
	if(results.length > 0){
		for(var i = 0; i< results.length; i++){
			var spriteToCheck = results[i].sprite;
			var hitDropTarget =  this.dropTargetActions(spriteToCheck, stickyObject);
			if(hitDropTarget){
				this._player.setIsHoldingObject(false);	
				return true;	
			}
		}
	}
	return false;
	
},


/**
* @description Player picks up a Sticky Object. In the stand alone version this occurs by the user pressing the "K" key when standing in front of an object.
* In the mobile version this occurs by the user touching the object they want to pick up.
* The item will lift if they are within the specified distance for interactions.
* @param {StickyTile} target
*/
pickUpItem: function(target){ //boolean
	this._player.stopWalk();
	
	if(this._player.getIsHoldingObject()){
		this._player.startInteract();
		this.stageMovementProgressCallback();
		this._player.setIsHoldingObject(false);
		this._activeStickyObject.attachUnattach();
		return;
	}	
	
	if(this._player.getIsHoldingObject()){ // if they are holding an object then it they can not interact
		return;
	}
	this._player.startInteract();	
	if(target == undefined){
		var results = this.checkForInteraction();
	}else{
		var results = this.checkForInteraction(target);
	}
	if(results.length > 0){
		for(var i = 0; i< results.length; i++){
			var spriteToCheck = results[i].sprite;
			if(spriteToCheck.checkForClass("sticky")){
				this._player.setIsHoldingObject(true);	
				spriteToCheck.attachUnattach();	
				this.interactionResponse(results[i].sprite);
				break;
			}
			
		}
	}
},





/**
* @description Player interacts with a stationary object, such as an OnOffTile. The item will activate if they are within the specified distance for interactions.
* In the mobile version this occurs by the user touching the object they want to activate.
* The item will lift if they are within the specified distance for interactions.
* @param {Interactive Tile} target // Interactive Tile or its children( OnOff, OnOffController)
*/
interactWithStationaryItem: function(target){ //boolean
	this._player.stopWalk();
	this._player.startInteract();	
	
	if(target == undefined){
		var results = this.checkForInteraction();	
	}else{
		var results = this.checkForInteraction(target);
	}
	
	if(results.length > 0){
		for(var i = 0; i< results.length; i++){
			this.interactionResponse(results[i].sprite,results[i].direction);
			var interactedObject = (target == undefined)? results[i].interactedObject._classReference : target;
			this.interactionExtendedActions(interactedObject);
		}
	}
		
	//g_thoughtBubble.fireLatestThought('test');
		
		
	// OCD start checking to see if it can begin firing a thought.
		
	// looking at items in quadrant in relation to the player
},






/**
* @description Checks to see if the Object in front of the player can be interacted with. In the mobile version there is a single target that gets
* passed, the item that the user touches. In the stand alone it checks for through an array of possible items in the quadrants that the 
* player occupies.
* @param {Interactive Tile} target // Interactive Tile or its children(Sticky, OnOff, OnOffController)
* @return {Array} results //an array of interacted objects
*/
checkForInteraction: function(target){ //boolean

	if(target==undefined){
		var predictedObjectArray = this._lastObstacles;
	}else{
		var predictedObjectArray = [target];
	}
	
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, g_stageWidth, g_stageHeight);
	var playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);
	var possibleInteraction = false;
	var direction; // use for pushing/pulling items
	var results = new Array();
	/*
		There is an Array of items that are in the quadrants that are within interactive distance of the character.
		We need to check to see which ones are within 10 pixels and those that are can be interacted with.
	*/
	
	for(var i = 0; i<predictedObjectArray.length; i++){
		if(target==undefined){
			var spriteToCheck = this._stageSpriteArray[predictedObjectArray[i]]._classReference;
		}else{
			var spriteToCheck = predictedObjectArray[i];
		}
		
		var targetRect = spriteToCheck.getRect();
		var catchableDistance = 20;
		switch(this._stageRotation){
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
			if(target == undefined){
				var isInteractive = $('#' + this._stageSpriteArray[predictedObjectArray[i]]._name).hasClass( "interactive" );
			}else{
				var isInteractive = target.getDiv().hasClass( "interactive" );
			}
			
			
			if(isInteractive){
				if(target == undefined){
					results.push({sprite:spriteToCheck, interactedObject:this._stageSpriteArray[predictedObjectArray[i]], direction:direction});
				}else{
					results.push({sprite:spriteToCheck, interactedObject:target, direction:direction});
				}
						
			}
			possibleInteraction = false;
		}
			
			
	}
	
	return results;
		
},

/* ------------------------------   EVALUATION FUNCTIONS ---------------------------------*/	




/**
* @description Checks for intersection of character and stage elements, primarily implemented to clear animation on mobile when the player completes their turning 
* it is the callback function of rotateStage
*/	
checkForHitRotate: function(){
	this._player.stopWalk();
	this.checkForHit();
},
			

/**
* @description Checks for intersection of character and stage elements, sets g_canMoveForward global(t/f) 
* @return {Array} hitObstacle[1] items that the character intersects
*/			
checkForHit: function (){
	this.stageMovementProgressCallback();
	var hitObstacle = this.getHits();
	if(hitObstacle[0]){
		var hits = hitObstacle[2];
		var previousMoves = new Array();
		for(var i = 0; i<hits.length ; i++){ // updated 8/20 so that it checks all items of possible interaction
			var isObstacle = hits[i]._classReference.getDiv().hasClass( "obstacle" );
			if(isObstacle){	
				this._canMoveForward = false;
				previousMoves.push(resetPosition(hitObstacle, previousMoves));
				clearInterval(this._walkInterval);
				this._player.stopWalk();
			}
		}
		
		
	}else{
		this._canMoveForward = true;
	}
	this._lastObstacles = hitObstacle[1];
	
},			


/**
* @description Calculates which items the character has intersected 
* @return {Array} [{Boolean}, {Array} obstacles]
*/			
getHits: function(){
	var mergedQuadrants = this.returnPossibleTargets();
	//console.log(mergedQuadrants);
	
	var hits = new Array();
	for(var i = 0; i<mergedQuadrants.length; i++){
		var k = '#' + this._stageSpriteArray[mergedQuadrants[i]]._name;
		 if($('#player').objectHitTest({"object":$(k), "transparency":false})){
			var hit = true;
			
		}else{
			var hit = false;
		} 
		
		
		if(hit && this._stageSpriteArray[mergedQuadrants[i]]._classReference.getVisibility()){// if it hits an item
			hits.push(this._stageSpriteArray[mergedQuadrants[i]]);
		}
	}
	
	
	if(hits.length > 0){
		return ([true, mergedQuadrants,hits]);
	}else{
		return ([false, mergedQuadrants]);
	}
	
},





/**
* @description Gets rotation of the stage
* @param {jQuery Object} obj 
* @return {Number} g_angle
*/
getRotationDegrees: function(obj) {
	   var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var this._angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var this._angle = 0; }
    return this._angle;
},


returnStageRectAdjustedForOffset: function(rect){
	var newRect = {top:0,right:0,bottom:0,left:0};
	for(var i in rect){
		newRect[i] = rect[i];
	}
	//console.log(newRect);
	return (newRect);
},


/**
* @description Determines the quadrants that a tile is displayed in. It is used for both the player as well as every other itme on the stage.
* @param {Object} rect (top,right,bottom,left) 
* @return {object} data
*/
returnRoundedRectAndDifferences: function(rect){
	var t = Math.floor(rect.top/this._quadSize);// subtract g_containerOffsetToAlignCharacter to offset the border
	var r = Math.floor(rect.right/this._quadSize);
	var b = Math.floor(rect.bottom/this._quadSize);
	var l = Math.floor(rect.left/this._quadSize);
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
	
},

/**
* Sets the global g_canMoveForward variable which determines whether the player needs to turn to move of can proceed.
* @param {bool} Boolean 
*/
setCanMoveForward: function(bool){
	this._canMoveForward = bool;
},

			


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
* @description Divides the stage up into quadrants to speed up the hitTests
*/
createHitTestQuadrants: function(){
	var quadsColumns = (g_stageWidth/this._quadSize) + 1;
	var quadsRows = (g_stageHeight/this._quadSize) + 1;
	for(var i = 0; i < quadsRows; i++){
		this._hitTestQuadrants[i] = new Array();
		for(var j = 0; j<quadsColumns; j++){
			this._hitTestQuadrants[i].push(new Array());
		}
		
	}
	
},



/**
* @description Registers a tile into all the quadrants in which it's rect overlays
* @param {Class} tile
* @param {Number} id // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
*/			
registerRect: function (tile, id){
	var tileToAdd = tile;
	var rect = tileToAdd.getRect();
	var data = this.returnRoundedRectAndDifferences(rect);
	//console.log(tileToAdd);
	//console.log(data)
	if(tile.getClass() != "Tile"){
		this._hitTestQuadrants[data.t][data.l].push(id);
		tileToAdd.registerAQuad([data.t,data.l,id]);
		if(data.hDiff == 1 ){
			this._hitTestQuadrants[data.t][data.l + 1].push(id);
			tileToAdd.registerAQuad([data.t,(data.l+ 1),id]);
		}
		if(data.vDiff == 1){
			this._hitTestQuadrants[data.t + 1][data.l].push(id);
			tileToAdd.registerAQuad([(data.t+1),data.l,id]);
		}
		if(data.hDiff == 1 && data.vDiff == 1){
			this._hitTestQuadrants[data.t + 1][data.l + 1].push(id);
			tileToAdd.registerAQuad([(data.t+1),(data.l+ 1),id]);
		}
	}
	
},


/**
* @description Removes a tile from a quadrant, or quadrants. This is used by Sticky Objects and Movable Objects, and is necessary to reset their position
* for hit test purposes, if it finds a match, it then removes the item from the quadrant's array
* @param {Array} data // an Array of quadrants that the specific tile is to be removed from
*/
removeRect: function(data){
	var temp = this._hitTestQuadrants[data[0]][data[1]];
	for(var i = 0; i<temp.length; i++){
		if(temp[i] == data[2]){
			this._hitTestQuadrants[data[0]][data[1]].splice(i, 1);
			break;
		}
	}
	
},

/**
* @description Determines the quadrants that the player's rect overlays, a player can overlay at most 4 quadrants
* @param {Object} point // x,y coordinates of the player on the stage.
* @return {Array} mergedQuadrants //a list of all the sprites on the stage that exist in the quadrants that the player overlays
*/			
registerPlayer: function(data){		
	var rect = {
		top:data.y,
		right:(data.x+data.w),
		bottom:(data.y+data.h),
		left:data.x		
	}
	var data = this.returnRoundedRectAndDifferences(rect);
	var quadrantsToMerge = new Array();
	quadrantsToMerge.push(this._hitTestQuadrants[data.t][data.l]);
	if(data.hDiff == 1){
		quadrantsToMerge.push(this._hitTestQuadrants[data.t][data.l + 1]);
	}
	if(data.vDiff == 1){
		quadrantsToMerge.push(this._hitTestQuadrants[data.t + 1][data.l]);
	}
	if(data.hDiff == 1 && data.vDiff == 1){
		quadrantsToMerge.push(this._hitTestQuadrants[data.t + 1][data.l + 1]);
	}
	var mergedQuadrants = this.mergeQuadrants(quadrantsToMerge);
	return(mergedQuadrants); 

},


/**
* @description Returns an Array of g_stageSpriteArray indexes to test for hitTesting
* @return {Array} possibleTargets //a list of all the sprites on the stage that exist in the quadrants that the player overlays
*/				
returnPossibleTargets: function(){
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, g_stageWidth, g_stageHeight);
	var point = playerOnStage;
	var possibleTargets = this.registerPlayer(point);
	return possibleTargets;
},



/**
* @description Merges the targets that the player overlays and removes duplicates
* @param {Array} a multidimensional array of up to 4 quadrants.
* @return {Array} cleanedQuadrants //an array of g_stageSpriteArray indexes
*/				
mergeQuadrants: function(a){
	var mergedQuadrants = new Array();
	var alreadyExists = false;
	for(var i = 0; i<a.length; i++){
		for(var j = 0; j<a[i].length; j++){
			mergedQuadrants.push(a[i][j]);
			
		}
	}
	var cleanedQuadrants = new Array();
	var arrayLength = mergedQuadrants.length;
	for(var k = 0; k<arrayLength; k++){
		var last = mergedQuadrants.shift();
			if(!this.checkForDuplicates(last, mergedQuadrants)){
				cleanedQuadrants.push(last);
			}
		
	}
	
	return cleanedQuadrants;
},


/**
* @description Removes duplicates from an array
* @param {Object} item //an index from the array that is being cleaned
* @param {Array} a //the array to be cleaned
* @return {Boolean} if a duplicate exists return true else false
*/				
checkForDuplicates: function(item, a){
	for(var i = 0; i<a.length; i++){
		if(a[i] == item){
			return true;
		}
	}
	return false;
}


/* ------------------------------   POSITIONING FUNCTIONS ---------------------------------*/

/**
* @description Gets the rect of the Player as transformed to the rotation of the stage
* @return {playerRect} object(top,right,bottom,left)
*/	
getPlayerTransformRect: function(){
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, g_stageWidth, g_stageHeight);
	var playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);	
	return (playerRect);
}	


getPlayerPositionWhileTurning: function(){
	if(this._player.getIsHoldingObject()){
		var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._lastRotation, g_stageWidth, g_stageHeight);
		var playerRect = this._player.getTransformedRect(playerOnStage, this._lastRotation, g_quadSize);	
		this._activeStickyObject.stickForTurn(playerRect);
	}
}


  /**
* @description Returns a point(x,y) of the player on the stage
* @return {Array} point //a loc of the player
*/			


transformObjectToStageRotation: function(position, stageRotation, objectWidth, objectHeight){
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

},

/**
* @description Extended function that specifies GAME SPECIFIC interaction response calls for InteractiveTile Class and it's decendents 
* @param {Class} spriteToCheck //a reference to a class instance, in this case the sprite the player has intereacted with 
* @param {String} direction //"up", "down", "left" or "right"
*/	
interactionResponse: function(spriteToCheck, direction){
	if(spriteToCheck.checkForClass("door") && spriteToCheck.getVisibility()){
		spriteToCheck.actedUpon();
		this.setCanMoveForward(true);	
		
	}else if(spriteToCheck.checkForClass("movable")){
		spriteToCheck.actedUpon(direction);
		this.setCanMoveForward(true);	
		
	}else if(spriteToCheck.hasListener()){
		if(!spriteToCheck.checkForClass("door") && !spriteToCheck.checkForClass("sticky")){
			spriteToCheck.actedUpon();
		}
		
	}else{
		spriteToCheck.actedUpon();
	}
},


/**
* @description Extended functionality that specifies GAME SPECIFIC interaction response calls beyond interactions from e_InteractionResponse
* @param {Class} interactedObject //a reference to a class instance, in this case the sprite the player has intereacted with 
*/		
interactionExtendedActions: function(interactedObject){
	var thoughtType = interactedObject.getThoughtType();
	if(thoughtType == undefined){
		return;
	}
	//var d = new Date();
	//var timeStamp = d.getTime();
	g_MIND.addThought(thoughtType,2, this.getPlayerLocation());
	
	//perhaps if the thought is already in the queue and they go back it shifts to the front of the queue and the intensity increases
	//g_MIND.setPlayerStartPosition(getPlayerLocation()); 
	//g_MIND.canOCDTrigger();
	
},



/**
* @description Extended function that specifies GAME SPECIFIC interaction response calls for the DropTarget Class
* @param {Class} spriteToCheck //a reference to a class instance, in this case the sprite the player has intereacted with 
* @param {Class} droppedClassReference // a reference to a class, in this case a Sticky Object
* @return {Boolean} // returned to checkForDropTarget in main game engine
*/
dropTargetActions: function(spriteToCheck, droppedClassReference ){
	if(spriteToCheck.checkForClass("dropTarget")){
		spriteToCheck.actedUpon(droppedClassReference);
		return true;
	}
	return false;
},

/**
* @description Extended function that is a callback to the Stage Class moveStage method, which is fired during the tween
* In this case it is used to sync the active Sticky Object(g_activeStickyObject) with the position of the Player's hand
*/	
stageMovementProgressCallback: function(){
	if(this._player.getIsHoldingObject()){
		this._activeStickyObject.stickToPlayer(this.getPlayerTransformRect());
	}
},





/**
* @description creating paired listeners for the hinged doors that are open 
*/	
registerHingedDoors: function(){
	var max = g_gameboard.length;
		for(var i = 0; i<max; i++){
			var spriteToCheck = this._stageSpriteArray[i]._classReference;
			if(spriteToCheck.hasMultipleListeners()){
				for(var count = 1; count<3; count++){
					var listener = spriteToCheck["getListenerString" + count]();
					var re = new RegExp(listener,"gi");
					for(var j = 0; j< this._stageSpriteArray.length; j++){
						var name = this._stageSpriteArray[j]._name;
						if(name.match(re)!=null){			
							break;
						}
					}
					
					//console.log(g_stageSpriteArray[j]);
					spriteToCheck["setListener" + count](this._stageSpriteArray[j]._classReference);
				} 
					
			} 
		}
}







 
});
