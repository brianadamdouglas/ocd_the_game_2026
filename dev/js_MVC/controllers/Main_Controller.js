class Main_Controller extends Controller {
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
	constructor() { 
		super();
		this._canMoveForward = true;
		this._stageSpriteArray = [];//Array of all the tiles on the stage
		this._lastObstacles = []; // obstacles to check for interaction
		this._hitTestQuadrants = []; //multidimentional array(rows/cols) that divides the stage for hitTest speed improvements
		this._player; // refernce to player object
		this._rotater; // refernce to rotater object
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
		this._touchWalkInterval;
		this._MIND;	
		this._topZIndex = 1000;
		this._maxLoad = 903968//1003968;
		this._startScreenInformation;
		this._startScreenDisclaimer;
		this._timer;
		this._audio;
		this._gameActive;
		this._gameOver;
		this._volumeControl;
		this._endScreenGood;
		this._endScreenBad;
		this._swipeInterface; //swipeInterface
		this._gameActive;
		this._tileCount;
		this._currentTile;
		this._startMatrix;
		this._potentialThoughtArray = [];
		this._preTriggeredControls = [];
		this._mainModel;
  }
  
	init(model){
		this._gameActive = false;
		this._gameOver = false;
		this._mainModel = model;
		this.addListners();
		this.addPlayer(this._mainModel.getPlayerInfo());
		this.addRotater(this._mainModel.getRotaterX(),this._mainModel.getRotaterY(),this._mainModel.getStageWidth(),this._mainModel.getStageHeight()); 
		this.addStage(this._mainModel.getStageStartX(),this._mainModel.getStageStartY(),this._mainModel.getStageWidth(),this._mainModel.getStageHeight());
		this.createHitTestQuadrants();
		this.addStartMatrix(this._mainModel.getThoughtMatrix()); 
		this.addPotentialThoughtArray(this._mainModel.getPotentialThoughtArray());
		this.populatePretriggeredControls(this._potentialThoughtArray);
		this.buildStage(this._mainModel.getGameBoard());
}

	init2(){
		this.registerPairs();
		this.registerHingedDoors(); 
		//this.addMobileButton();//WILL BE INITIATED ON MAIN.js
		this.addMask();
		this.addThoughtBubble();//not part of core
		this.addOCD_control();//not part of core
		this.addEndScreen();
		this.addTimer();
		this.addAudio();
		$(document).keypress(this.catchKeyPress.bind(this));
		$(document).keydown(this.catchKeyDown.bind(this));
		$(document).keyup(this.catchKeyUp.bind(this));
		g_afterAssetsLoad();
}



	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("movementProgress", this);
	g_eventHandler.addAListener("checkForHit", this);
	g_eventHandler.addAListener("setCanMoveForward", this);
	g_eventHandler.addAListener("removeRect", this);
	g_eventHandler.addAListener("registerRect", this);
	g_eventHandler.addAListener("stickyObjectLifted", this);
	g_eventHandler.addAListener("stickyObjectDropped", this);
	g_eventHandler.addAListener("gameOver", this);
	g_eventHandler.addAListener("addNextSprite", this);
	g_eventHandler.addAListener("addAssociatedThought", this);
	g_eventHandler.addAListener("showGameDisplay", this);
	g_eventHandler.addAListener("screenRotatedPortrait", this);
	g_eventHandler.addAListener("screenRotatedLandscape", this);
	g_eventHandler.addAListener("checkPositionForFinish", this);
	g_eventHandler.addAListener("restartGame", this);
	g_eventHandler.addAListener("updateMovableTiles", this);
	
	
	
}

		

	
	
	/**
	* @description Adds the player to the stage
	*/			
	addPlayer(playerInfo){
		var classAcronym = playerInfo.type;
		var data = {
			className:this._mainModel.getGameboardClasses()[classAcronym],
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym],
			id:'player',
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
			stickyLiftOffset:playerInfo.stickyLiftOffset,
			startFrame:0
		}
		
		var hitTestHeadData = playerInfo.hitTestHeadData;
		hitTestHeadData.container = data.id;
		var hitTestTorsoData = playerInfo.hitTestTorsoData;
		hitTestTorsoData.container = data.id;
		
		this._player = new Player_OCD_Controller();
		var newView = new Player_View();
		this._player.bindView(newView,data);
		var newHittestViewHead =  new DispatchingNonGraphic_View();
		this._player.bindHitTestHeadView(newHittestViewHead, hitTestHeadData);
		var newHittestViewTorso =  new DispatchingNonGraphic_View();
		this._player.bindHitTestTorsoView(newHittestViewTorso, hitTestTorsoData); 
		this._player.hide();
}

	addStartMatrix(matrix){
	this._startMatrix = matrix;
}

	addPotentialThoughtArray(array){
	this._potentialThoughtArray = array;
}

	populatePretriggeredControls(array){
	this._preTriggeredControls = [];
	var temp = array.slice(0);
	for(var i = 0; i<5; i++){
		var randomPosition = this.getRandomInt(0, temp.length);
		var tempIndex = temp.splice( randomPosition, 1 );
		this._preTriggeredControls.push(tempIndex);
	}
	//console.log(this._preTriggeredControls)
	//console.log(this._potentialThoughtArray);
}

	turnOnRandomizedItems(){
	for(var i = 0; i<this._preTriggeredControls.length; i++){
		var type = this._startMatrix[this._preTriggeredControls[i]].getObjectType();
		if(type === "immobile"){
			this.interactionResponse(this._startMatrix[this._preTriggeredControls[i]]);
			if(this.getRandomInt(0,5) === 1){
				this.interactionExtendedActions(this._startMatrix[this._preTriggeredControls[i]],this.getRandomInt(1,2));
			}
		}else{
			this.interactionExtendedActions(this._startMatrix[this._preTriggeredControls[i]], this.getRandomInt(1,2));
		}
		//console.log(this._startMatrix[this._preTriggeredControls[i]].getObjectType());
	}
}

	addAssociatedThought(data){
	var relatedThoughts = this._mainModel.getRelatedMatrix()[data.type];
	if(relatedThoughts.length > 0){
		var position = this.getRandomInt(0,relatedThoughts.length);
		var thoughtToAdd = relatedThoughts[position];
		if(this.getRandomInt(0,4) === 1){
			if(thoughtToAdd !== undefined){
				console.log("add thought at random : " + thoughtToAdd);
				this.interactionExtendedActions(this._startMatrix[thoughtToAdd], 1);
			}
			
		}
	}

}

	updateMatrixViewPointer(type, view){
	this._startMatrix[type] = view;
}
	

	
	/**
	* @description Builds the stage based on instructions from gameBoard.js
	*/			
	buildStage(gameboard){
		this._tileCount = gameboard.length;
		this._currentTile = 0;
		this.addSprite(this._currentTile);
		/* var max = gameboard.length;
		for(var i = 0; i<max; i++){
			this.addSprite(i);
		} */
}

	addNextSprite(gameboard){
		this._currentTile++;
		if(this._currentTile < this._tileCount){
			this.addSprite(this._currentTile);
		}else if(this._currentTile === this._tileCount){
			this.init2();
		}
		
}
	
	/**
	* @description Adds a rotater element to the mask(#mask)container
	*/			
	addRotater(x,y,w,h){	
		const data = {
			container:"mask",
			id:"rotater",
			className:"rotater",
			x:x,
			y:y,
			w:w,
			h:h
		}	
		
		this._rotater = new Tile_Controller();
		const newView = new NonGraphic_View();
		this._rotater.bindView(newView,data);
		// Rotator is hidden initially and will be shown when game starts (showGameDisplay)
		this._rotater.hide();
	}
	
	/**
	* @description Adds a stage element to the rotation(#rotator) container
	*/			
	addStage(x,y,w,h){		
		var data = {
			container:"rotater",
			id:"stage",
			className:"stage",
			x:x,
			y:y,
			w:w,
			h:h
		}
		this._stage = new Stage_Controller();
		var newView = new NonGraphic_View();
		this._stage.bindView(newView,data);
		this._stage.setMainController(this);
		
		/* g_stage.setGameEngineMovementCallback(checkForHit);
		g_stage.setGameEngineCanMoveCallback(setCanMoveForward);
		g_stage.setGameEngineMovementProgressCallback(e_movementProgress); */
}
	
	/**
* @description Adds a sprite to the stage and a reference to the sprite to the g_stageSpriteArray
* @param {Number} id 
	*/			
	addSprite(id){
		this._stageSpriteArray.push(this.createSprite(id));
				
}
			
			
	/**
* @description Creates a sprite
* @param {Numner} id 
* @return {Object} _name:Name of Sprite, _classReference: what type of Tile class it is
	*/			
	createSprite(id){
		var gamePiece = this._mainModel.getGameBoard()[id];
		var classAcronym = gamePiece.type;
		var startFrame = (gamePiece.startFrame === undefined) ? 0 : gamePiece.startFrame
		var data = {
			className:this._mainModel.getGameboardClasses()[classAcronym],
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym],
			listener:gamePiece.listener,
			listenerString:gamePiece.listener,//used for door objects though I may pass all listeners to be registered over to other function
			listener1:gamePiece.listener1,
			listenerString1:gamePiece.listener1,
			listener2:gamePiece.listener2,
			listenerString2:gamePiece.listener2,
			thoughtType:gamePiece.thoughtType,
			objectType:gamePiece.objectType,
			visibility:gamePiece.state,
			stickyHoldingOffset:gamePiece.stickyHoldingOffset,
			IDOverride:gamePiece.IDOverride,
			dropTargetFunction:gamePiece.dropTargetFunction,
			moveObject:gamePiece.moveObject,
			id:'sprite_tile'+id,
			stage:"stage",		
			x:gamePiece.x,
			y:gamePiece.y,
			w:gamePiece.w,
			h:gamePiece.h,
			container:this._stage.getViewID(),
			startFrame:startFrame
		}
		
		
		var newTile = this._stage.addTile(data);
		if(newTile.getThoughtType !== undefined && newTile.getThoughtType() !== undefined){
			this.updateMatrixViewPointer(newTile.getThoughtType(), newTile);
			//console.log([newTile.getThoughtType(), newTile.getViewID()]);
		}			
		if(newTile.getClass() !== "Tile" && newTile.getClass() !== "Mobile"){
			var data = {controller:newTile, id:id}
			this.registerRect(data)
			//this.registerRect(newTile, id);// use the id to lookup from stage SpriteArray
		}
		
		if(data.IDOverride === "swipeInterface"){
			this._swipeInterface = newTile; //swipeInterface
		}
		
		return {_name:newTile.getViewID(), _classReference:newTile};
		
		
		
}
	
	
	/**
	* @description Registers pairs of sprites that listen and control(Doors, plugs, etc.)
	*/			
	registerPairs(){
		var max = this._mainModel.getGameBoard().length;
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
}
	
	
	/**
	* @description Catches keystroke events(Key Down)
	*/
	catchKeyDown(event){
	var key = (event.which)
	if(String.fromCharCode(key) === "W"){
		this.finishLastMove();
		this._player.startWalk();
		
		/* var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
		var playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);
		console.log(playerRect); */
	}
	if(String.fromCharCode(key) === "X"){
		this.finishLastMove();	
		this._player.startTurnRight()
		this.rotateStage(this._angle -= 180, 180);
	}
	if(String.fromCharCode(key) === "A"){
		this.finishLastMove();
		this._player.startTurnLeft();
		this.rotateStage(this._angle  += 90);
	}
	if(String.fromCharCode(key) === "D"){
		this.finishLastMove();
		this._player.startTurnRight()
		this.rotateStage(this._angle -= 90);
	}
	/*button press / interact with object*/
	if(String.fromCharCode(key) === "K"){ // pick up item
		this.pickUpItem();				
	}
	
	if(String.fromCharCode(key) === "L"){ // interact with items
			
		if(!this._player.getIsHoldingObject()){
			this.interactWithStationaryItem();
		}else{
			this.stickyObjectDoSomething();
		}
		
	}	
}
	
	
	/**
	* @description Catches keystroke events(Key Up)
	*/
	catchKeyUp(event){
	var key = (event.which)
	if(key === 87){
		//finishLastMove();
		this._player.stopWalk();
		//g_stage.moveStage(g_moveDistance, g_stageRotation, g_canMoveForward);
	}
	if(key !== 87){
		this._player.stopWalk();
	}
	if(key === 75){//lift up item
		if(this._player.getIsHoldingObject()){
			this.movementProgress();
		}	
	}
		
}

	/**
			* @description Catches keystroke events(Press)
			*/
	catchKeyPress(event){
	var key = (event.which)

	if(String.fromCharCode(key) === "w"){
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
	rotateStage(degrees, rot){
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
	if(rot !== 180){
		var _duration = 200;
	}else{
		var _duration = 300;
	}
	

	$('#rotater').animate(
		{target: degrees},
		{
			step(now,fx) {
				$(this).css('-webkit-transform','rotate('+now+'deg)'); 
				$(this).css('-moz-transform','rotate('+now+'deg)');
				$(this).css('transform','rotate('+now+'deg)');
			},
			duration:_duration,
			easing:'easeOutCirc',
			complete:this.checkForHitRotate.bind(this)
		}
	);
}
			
			
			
	/**
* @description Resets the position of the stage if the character has intersected object
* @param {Class} hitObstacle
	*/			
	resetPosition(hitObstacle,type,previousMoves){  //function(hitObstacle,previousMoves){//array
	var target = hitObstacle[0];//hitObstacle[2];
	var type = hitObstacle[1];//hitObstacle[3]//getDiv
	//console.log([target,type]);
	var targetRect = target._classReference.getRect();
	var targetRectAdjusted = this.returnStageRectAdjustedForOffset(targetRect);
	var targetName = target._classReference.getViewDIV();//using for debugging, remove later
	var playerPointOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	if(type=="head"){
		var playerRectAdjusted = this._player.getTransformedHeadRect(playerPointOnStage, this._stageRotation);
	}else if (type=="torso"){
		var playerRectAdjusted = this._player.getTransformedTorsoRect(playerPointOnStage, this._stageRotation);
	}

	var direction = this._stage.repositionStage(targetRectAdjusted, playerRectAdjusted, this._stageRotation, previousMoves);
	this.movementProgress();	
	//console.log(previousMoves);	
	return direction	
}





	/**
* @description Finishes any existing animations of the stage
	*/			
	finishLastMove(){
	$('#rotater').finish();
	$('#stage').finish();
}



	/**
* @description Get the position of the player relative to the stage, used for the OCD functions
* @return {Object} loc x and y position of player
	*/					
	getPlayerLocation(){//transformPlayerToStage
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	var loc = {x:playerOnStage.x, y:playerOnStage.y}
	return loc;
}
/* ------------------------------   INTERACTION FUNCTIONS ---------------------------------*/			
	
	/**
* @description Attaches a sticky object to the PLAYER, appears that the player will pick up an object
* @param {StickyTile} stickyObject
	*/
	stickyObjectLifted(data){
	this._activeStickyObject = data.controller;
	this._player.setIsHoldingObject(true);
	this.movementProgress();
}


	/**
* @description Unattach a sticky object to the PLAYER, appears that the player drops an object
* @param {StickyTile} stickyObject
	*/
	stickyObjectDropped(data){
	var stickyObject = data.controller;
	this._activeStickyObject = null; 
	var rectData = this.getPlayerTransformRect();
	stickyObject.setDroppedRect(rectData, this._stageRotation, this._player);
	var id = stickyObject.getViewID().replace("sprite_tile","");
	var hitTarget = this.checkForDropTarget(stickyObject); // need some sort of boolean return at this point to not alow item to register on stage
	if(!hitTarget){
		var data = {controller:stickyObject, id:Number(id)}
		this.registerRect(data); 
	}
}

	/**
* @description Some sticky objects are OnOffControllers. This propogates the interaction of that object with it's listener.
	*/
	stickyObjectDoSomething(){
	this._activeStickyObject.actedUpon();
}


	/**
* @description The player can drop a Sticky Object on a Drop Target. Each Drop Target has a custom function associated with it. These are 
	* found in the gameEngineExtension.js file
* @param {StickyTile} stickyObject
	*/
	checkForDropTarget(stickyObject){
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
	
}


	/**
* @description Player picks up a Sticky Object. In the stand alone version this occurs by the user pressing the "K" key when standing in front of an object.
	* In the mobile version this occurs by the user touching the object they want to pick up.
	* The item will lift if they are within the specified distance for interactions.
* @param {StickyTile} target
	*/
	pickUpItem(target){ //boolean
	this._player.stopWalk();
	
	if(this._player.getIsHoldingObject()){
		this._player.startInteract();
		this.movementProgress();
		this._player.setIsHoldingObject(false);
		if(this.getRandomInt(0,4) !== 1){
			this.interactionExtendedActions(this._activeStickyObject, this.getRandomInt(1,4));
		}
		this._activeStickyObject.attachUnattach();	
		return;
	}	
	
	if(this._player.getIsHoldingObject()){ // if they are holding an object then it they can not interact
		return;
	}
	this._player.startInteract();	
	if(target === undefined){
		var results = this.checkForInteraction();
	}else{
		var results = this.checkForInteraction(target);
	}
	if(results.length > 0){
		for(var i = 0; i< results.length; i++){
			var spriteToCheck = results[i].sprite;
			if(spriteToCheck.getViewDivClass("sticky")){
				this._player.setIsHoldingObject(true);	
				spriteToCheck.attachUnattach();	
				this.interactionResponse(results[i].sprite);
				break;
			}
			
		}
	}
}





	/**
* @description Player interacts with a stationary object, such as an OnOffTile. The item will activate if they are within the specified distance for interactions.
	* In the mobile version this occurs by the user touching the object they want to activate.
	* The item will lift if they are within the specified distance for interactions.
* @param {Interactive Tile} target // Interactive Tile or its children( OnOff, OnOffController)
	*/
	interactWithStationaryItem(target){ //boolean
	this._player.stopWalk();
	this._player.startInteract();	
	
	if(target === undefined){
		var results = this.checkForInteraction();	
	}else{
		var results = this.checkForInteraction(target);
	}
	
	if(results.length > 0){
		
		for(var i = 0; i< results.length; i++){
			this.interactionResponse(results[i].sprite,results[i].direction);
			var interactedObject = (target === undefined)? results[i].interactedObject._classReference : target;
			//console.log(interactedObject);
			if(this.getRandomInt(0,4) !== 1){
				var intensity;
				//console.log(interactedObject.getThoughtType());
				if(interactedObject.getThoughtType() === "frontDoor"){
					intensity = 1;
				}else{
					intensity = this.getRandomInt(1,4);
				}
				if(interactedObject.getThoughtType() !== undefined){
					this.interactionExtendedActions(interactedObject, intensity);
				}
				
			}
		}
	}
		
	//g_thoughtBubble.fireLatestThought('test');
		
		
	// OCD start checking to see if it can begin firing a thought.
		
	// looking at items in quadrant in relation to the player
}






	/**
* @description Checks to see if the Object in front of the player can be interacted with. In the mobile version there is a single target that gets
	* passed, the item that the user touches. In the stand alone it checks for through an array of possible items in the quadrants that the 
	* player occupies.
* @param {Interactive Tile} target // Interactive Tile or its children(Sticky, OnOff, OnOffController)
* @return {Array} results //an array of interacted objects
	*/
	checkForInteraction(target){ //boolean

	if(target==undefined){
		var predictedObjectArray = this._lastObstacles;
	}else{
		var predictedObjectArray = [target];
	}
	
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	var playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);
	var possibleInteraction = false;
	var direction; // use for pushing/pulling items
	var results = [];
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
			if(target === undefined){
				var isInteractive = $('#' + this._stageSpriteArray[predictedObjectArray[i]]._name).hasClass( "interactive" );
			}else{
				var isInteractive = target.getViewDIV().hasClass( "interactive" );
			}
			
			
			if(isInteractive){
				if(target === undefined){
					results.push({sprite:spriteToCheck, interactedObject:this._stageSpriteArray[predictedObjectArray[i]], direction:direction});
				}else{
					results.push({sprite:spriteToCheck, interactedObject:target, direction:direction});
				}
						
			}
			possibleInteraction = false;
		}
			
			
	}
	
	return results;
		
}
/* ------------------------------   EVALUATION FUNCTIONS ---------------------------------*/	




	/**
* @description Checks for intersection of character and stage elements, primarily implemented to clear animation on mobile when the player completes their turning 
	* it is the callback function of rotateStage
	*/	
	checkForHitRotate(){
	
	this._player.stopWalk();
	this.checkForHit();
}
			

	/**
* @description Checks for intersection of character and stage elements, sets g_canMoveForward global(t/f) 
* @return {Array} hitObstacle[1] items that the character intersects
	*/			
	checkForHit(){
	
	// Don't process hits if game is over
	if(this._gameOver){
		return;
	}
	
	this.movementProgress();
	
	// Check if player has crossed the finish line
	var rectToCheck = this.getPlayerTransformRect();
	// Finish line area: x:924, y:113, w:88, h:15
	// Check if player is in the finish area (bottom < 150, left > 850, right < 1020)
	if(rectToCheck.bottom < 150 && rectToCheck.left > 850 && rectToCheck.right < 1020){
		this.gameOver();
		return;
	}
	
	var hitObstacle = this.getHits();
	if(hitObstacle[0]){
		var hits = hitObstacle[2];
		var previousMoves = [];
		
		for(var i = 0; i<hits.length ; i++){ // updated 8/20 so that it checks all items of possible interaction
			var isObstacle = hits[i][0]._classReference.getViewDIV().hasClass( "obstacle" );
			//console.log(isObstacle);
			if(isObstacle){	
				this._canMoveForward = false;
				previousMoves.push(this.resetPosition(hits[i], hitObstacle[3],  previousMoves));//previousMoves.push(this.resetPosition(hitObstacle, previousMoves));
				clearInterval(this._touchWalkInterval); // potential event dispatch that gets propogated by the eventHandler
				this._player.stopWalk();
			}
		}
		
		
	}else{
		this._canMoveForward = true;
	}
	this._lastObstacles = hitObstacle[1];
	
}


	/**
* @description Calculates which items the character has intersected 
* @return {Array} [{Boolean}, {Array} obstacles]
	*/			
	getHits(){
	// Don't process if game is over
	if(this._gameOver){
		return ([false, []]);
	}
	
	var mergedQuadrants = this.returnPossibleTargets();
			//console.log(mergedQuadrants);
				
	var hits = [];
	for(var i = 0; i<mergedQuadrants.length; i++){
		var k = '#' + this._stageSpriteArray[mergedQuadrants[i]]._name;
		var spriteName = this._stageSpriteArray[mergedQuadrants[i]]._name;
			
		var hit = false;
		// for some reason on that one wall segment it does not register the head.
		 
		if($('#playerHead').objectHitTest({"object":$(k), "transparency":false})  && this._stageSpriteArray[mergedQuadrants[i]]._classReference.getViewVisibility()){
			var playerSegment = 'head';
			hit = true;
		} 
		 
		if($('#playerTorso').objectHitTest({"object":$(k), "transparency":false}) && this._stageSpriteArray[mergedQuadrants[i]]._classReference.getViewVisibility()){
			var playerSegment = 'torso';
			hit = true;
		}
		
		// Check if player collided with finishText
		if(hit && spriteName === "finishText" && !this._gameOver){
			this.gameOver();
			return ([true, mergedQuadrants, [], 'finish']);
		}
			
		if(hit && this._stageSpriteArray[mergedQuadrants[i]]._classReference.getViewVisibility()){// if it hits an item
			hits.push([this._stageSpriteArray[mergedQuadrants[i]], playerSegment]);
		}
	}
	if(hits.length > 0){
		return ([true, mergedQuadrants,hits,playerSegment]);
	}else{
		return ([false, mergedQuadrants]);
	}
}





	/**
* @description Gets rotation of the stage
* @param {jQuery Object} obj 
* @return {Number} g_angle
	*/
	getRotationDegrees(obj) {
	var matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return angle;
}


	returnStageRectAdjustedForOffset(rect){
	var newRect = {top:0,right:0,bottom:0,left:0};
	for(var i in rect){
		newRect[i] = rect[i];
	}
	//console.log(newRect);
	return (newRect);
}


	/**
* @description Determines the quadrants that a tile is displayed in. It is used for both the player as well as every other itme on the stage.
* @param {Object} rect (top,right,bottom,left) 
* @return {object} data
	*/
	returnRoundedRectAndDifferences(rect){
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
	
}

	/**
	* Sets the global g_canMoveForward variable which determines whether the player needs to turn to move of can proceed.
* @param {bool} Boolean 
	*/
	setCanMoveForward(data){
	this._canMoveForward = data.bool;
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
* @description Divides the stage up into quadrants to speed up the hitTests
	*/
	createHitTestQuadrants(){
	var quadsColumns = (this._mainModel.getStageWidth()/this._quadSize) + 1;
	var quadsRows = (this._mainModel.getStageHeight()/this._quadSize) + 1;
	for(var i = 0; i < quadsRows; i++){
		this._hitTestQuadrants[i] = [];
		for(var j = 0; j<quadsColumns; j++){
			this._hitTestQuadrants[i].push([]);
		}
		
	}
	
	
	
}



	/**
* @description Registers a tile into all the quadrants in which it's rect overlays
* @param {Class} tile
* @param {Object} data // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
	*/			
	registerRect(data){
	var id = data.id;
	var tile = data.controller;
	var tileToAdd = tile;
	var rect = tileToAdd.getRect();
	var data = this.returnRoundedRectAndDifferences(rect);
	//console.log(data)
	if(tile.getClass() !== "Tile"){
		this._hitTestQuadrants[data.t][data.l].push(id);
		tileToAdd.registerAQuad([data.t,data.l,id]);
		if(data.hDiff === 1 ){
			this._hitTestQuadrants[data.t][data.l + 1].push(id);
			tileToAdd.registerAQuad([data.t,(data.l+ 1),id]);
		}
		if(data.vDiff === 1){
			this._hitTestQuadrants[data.t + 1][data.l].push(id);
			tileToAdd.registerAQuad([(data.t+1),data.l,id]);
		}
		if(data.hDiff === 1 && data.vDiff === 1){
			this._hitTestQuadrants[data.t + 1][data.l + 1].push(id);
			tileToAdd.registerAQuad([(data.t+1),(data.l+ 1),id]);
		}
	}
	
}


	/**
* @description Removes a tile from a quadrant, or quadrants. This is used by Sticky Objects and Movable Objects, and is necessary to reset their position
	* for hit test purposes, if it finds a match, it then removes the item from the quadrant's array
* @param {Array} data // an Array of quadrants that the specific tile is to be removed from
	*/
	removeRect(data){
	var temp = this._hitTestQuadrants[data.quads[0]][data.quads[1]];
	for(var i = 0; i<temp.length; i++){
		if(temp[i] === data.quads[2]){
			this._hitTestQuadrants[data.quads[0]][data.quads[1]].splice(i, 1);
			break;
		}
	}
	
}

	/**
* @description Determines the quadrants that the player's rect overlays, a player can overlay at most 4 quadrants
* @param {Object} point // x,y coordinates of the player on the stage.
* @return {Array} mergedQuadrants //a list of all the sprites on the stage that exist in the quadrants that the player overlays
	*/			
	registerPlayer(data){		
	// Don't process if game is over
	if(this._gameOver){
		return [];
	}
	
	var rect = {
		top:data.y,
		right:(data.x+data.w),
		bottom:(data.y+data.h),
		left:data.x		
	}
	var data = this.returnRoundedRectAndDifferences(rect);
	
	// Bounds checking to prevent array access errors
	if(!this._hitTestQuadrants || data.t < 0 || data.l < 0 || 
	   !this._hitTestQuadrants[data.t] || !this._hitTestQuadrants[data.t][data.l]){
		return [];
	}
	
	var quadrantsToMerge = [];
	quadrantsToMerge.push(this._hitTestQuadrants[data.t][data.l]);
	if(data.hDiff === 1 && this._hitTestQuadrants[data.t] && this._hitTestQuadrants[data.t][data.l + 1]){
		quadrantsToMerge.push(this._hitTestQuadrants[data.t][data.l + 1]);
	}
	if(data.vDiff === 1 && this._hitTestQuadrants[data.t + 1] && this._hitTestQuadrants[data.t + 1][data.l]){
		quadrantsToMerge.push(this._hitTestQuadrants[data.t + 1][data.l]);
	}
	if(data.hDiff === 1 && data.vDiff === 1 && 
	   this._hitTestQuadrants[data.t + 1] && this._hitTestQuadrants[data.t + 1][data.l + 1]){
		quadrantsToMerge.push(this._hitTestQuadrants[data.t + 1][data.l + 1]);
	}
	var mergedQuadrants = this.mergeQuadrants(quadrantsToMerge);
	return(mergedQuadrants); 

}


	/**
* @description Returns an Array of g_stageSpriteArray indexes to test for hitTesting
* @return {Array} possibleTargets //a list of all the sprites on the stage that exist in the quadrants that the player overlays
	*/				
	returnPossibleTargets(){
	// Don't process if game is over
	if(this._gameOver){
		return [];
	}
	
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	var point = playerOnStage;
	var possibleTargets = this.registerPlayer(point);
	return possibleTargets;
}



	/**
* @description Merges the targets that the player overlays and removes duplicates
* @param {Array} a multidimensional array of up to 4 quadrants.
* @return {Array} cleanedQuadrants //an array of g_stageSpriteArray indexes
	*/				
	mergeQuadrants(a){
	var mergedQuadrants = [];
	var alreadyExists = false;
	for(var i = 0; i<a.length; i++){
		for(var j = 0; j<a[i].length; j++){
			mergedQuadrants.push(a[i][j]);
			
		}
	}
	var cleanedQuadrants = [];
	var arrayLength = mergedQuadrants.length;
	for(var k = 0; k<arrayLength; k++){
		var last = mergedQuadrants.shift();
			if(!this.checkForDuplicates(last, mergedQuadrants)){
				cleanedQuadrants.push(last);
			}
		
	}
	
	return cleanedQuadrants;
}


	/**
* @description Removes duplicates from an array
* @param {Object} item //an index from the array that is being cleaned
* @param {Array} a //the array to be cleaned
* @return {Boolean} if a duplicate exists return true else false
	*/				
	checkForDuplicates(item, a){
	for(var i = 0; i<a.length; i++){
		if(a[i] === item){
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
	getPlayerTransformRect(){
	var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	var playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);	
	return (playerRect);
}


	getPlayerPositionWhileTurning(){
	if(this._player.getIsHoldingObject()){
		var playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._lastRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
		var playerRect = this._player.getTransformedRect(playerOnStage, this._lastRotation, this._quadSize);	
		this._activeStickyObject.stickForTurn(playerRect);
	}
}


  /**
* @description Returns a point(x,y) of the player on the stage
* @return {Array} point //a loc of the player
	*/			


	transformObjectToStageRotation(position, stageRotation, objectWidth, objectHeight){
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
					  var w = objectW;
					  var h = objectH;						
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

	/**
* @description Extended function that specifies GAME SPECIFIC interaction response calls for InteractiveTile Class and it's decendents 
* @param {Class} spriteToCheck //a reference to a class instance, in this case the sprite the player has intereacted with 
	* @param {String} direction //"up", "down", "left" or "right"
	*/	
	interactionResponse(spriteToCheck, direction){
	if(spriteToCheck.getViewDivClass("door") && spriteToCheck.getViewVisibility()){
		spriteToCheck.actedUpon();
		this.setCanMoveForward({bool:true});
	}else if(spriteToCheck.getViewDivClass("movable")){
		spriteToCheck.actedUpon(direction);
		this.setCanMoveForward({bool:true});
	}else if(spriteToCheck.hasListener()){
		if(!spriteToCheck.getViewDivClass("door") && !spriteToCheck.getViewDivClass("sticky")){
			spriteToCheck.actedUpon();
		}
		
	}else{
		if(this.getRandomInt(0,8) !== 1){
			spriteToCheck.actedUpon();
		}else{
			console.log('your interaction with the item did not work');
		}
		
	}
}


	/**
* @description Extended functionality that specifies GAME SPECIFIC interaction response calls beyond interactions from e_InteractionResponse
* @param {Class} interactedObject //a reference to a class instance, in this case the sprite the player has intereacted with 
	*/		
	interactionExtendedActions(interactedObject, intensity){
	var thoughtType = interactedObject.getThoughtType();
	var objectType = interactedObject.getObjectType();
	if(thoughtType === undefined){
		return;
	}
	//var d = new Date();
	//var timeStamp = d.getTime();
	
	//console.log(thoughtType);
	this._MIND.addThought(interactedObject.getViewID(),thoughtType,objectType,intensity, this.getPlayerLocation());
	
	
	
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
	dropTargetActions(spriteToCheck, droppedClassReference ){
	if(spriteToCheck.getViewDivClass("dropTarget")){
		spriteToCheck.actedUpon(droppedClassReference);
		return true;
	}
	return false;
}

	/**
* @description Extended function that is a callback to the Stage Class moveStage method, which is fired during the tween
	* In this case it is used to sync the active Sticky Object(g_activeStickyObject) with the position of the Player's hand
	*/	
	movementProgress(){
	if(this._player.getIsHoldingObject()){
		this._activeStickyObject.stickToPlayer(this.getPlayerTransformRect(),this._stageRotation, this._player);
	}
}





	/**
* @description creating paired listeners for the hinged doors that are open 
	*/	
	registerHingedDoors(){
	var max = this._mainModel.getGameBoard().length;
		for(var i = 0; i<max; i++){
			var spriteToCheck = this._stageSpriteArray[i]._classReference;
			if(spriteToCheck.hasMultipleListeners()){
				//console.log('yes');
				for(var count = 1; count<3; count++){
					var listener = spriteToCheck["getListenerString" + count]();
					var re = new RegExp(listener,"gi");
					for(var j = 0; j< this._stageSpriteArray.length; j++){
						var name = this._stageSpriteArray[j]._name;
						if(name.match(re)!=null){			
							break;
						}
					}
					//console.log("setListener" + count);
					//console.log(g_stageSpriteArray[j]);
					spriteToCheck["setListener" + count](this._stageSpriteArray[j]._classReference);
				} 
					
			} 
		}
}
/* ------------------------------   EXTENTION FUNCTIONS FOR DROP TARGET ---------------------------------*/		
	/**
* @description Extended function - fires when a player drops an object on a hamper.
	*/			
	dropTargetHamper(data){
	var droppedItemController = data.droppedItemController;
	var temp = data.target.getViewLoc();
	var loc = {x:temp.left, y:temp.top}
	this._topZIndex++;
	droppedItemController.setViewLoc(((loc.x + 5) +  this.getRandomInt(0,25)) , ((loc.y + 3) +  this.getRandomInt(0,10)));
	droppedItemController.getViewDIV().css('z-index', String(this._topZIndex));
	//console.log(droppedClassReference);
}


	/**
* @description Extended function - fires when a player drops an object on the bookcase
	*/			
	dropTargetBookcase(data){
	var droppedItemController = data.droppedItemController;
	droppedItemController.getViewDIV().hide();
	for(var i in this._stageSpriteArray){
		if(this._stageSpriteArray[i]._name === "bookInBookcase"){
			this._stageSpriteArray[i]._classReference.actedUpon();
			
		}
	}
	//$('#'+'bookInBookcase').show();
	
	//console.log(droppedClassReference);
}

	getRandomInt(min, max) {
		 return Math.floor(Math.random() * (max - min)) + min;
}

	/**
* @description Adds the thought bubble to the stage
	*/			
	addThoughtBubble(){
	var thoughtInfo = this._mainModel.getThoughtInfo();
	var classAcronym = thoughtInfo.type;
		
	var imageControllerData = {
		className:this._mainModel.getGameboardClasses()[classAcronym],	
		imagePath :this._mainModel.getGameboardImageLookup()[classAcronym],	
		id:'thoughtBubble',
		container:"body",
		imgs:this._mainModel.getGameboardImageLookup()[classAcronym],	
		x:thoughtInfo.x,
		y:thoughtInfo.y,
		w:thoughtInfo.w,
		h:thoughtInfo.h
	}
	
	var stackedAnimationControllerData = {		
		id:'stackedAnimations',
		container:"",		
		x:thoughtInfo.x,
		y:thoughtInfo.y,
		w:thoughtInfo.w,
		h:thoughtInfo.h
	}
	this._thoughtBubble = new ThoughtBubble_Controller();
	var newView = new ThoughtBubble_View();
	this._thoughtBubble.bindView(newView,imageControllerData, stackedAnimationControllerData);
	
	this.addThoughtAnimations();

}

	/**
* @description Add the thought animation sequences to the thought bubble
	*/				
	addThoughtAnimations(){
	var thoughtAnimations = this._mainModel.getThoughtAnimations();
	for(var i = 0; i<thoughtAnimations.length; i++){
		var frames = [];
		// this loop looks at teh frame count established in the gameboard.js and uses it to build out array of images, rather than listing them all
		for(var j = 0; j< thoughtAnimations[i].frameCount; j++){
			frames.push(thoughtAnimations[i].frameRoot + j + thoughtAnimations[i].frameType);
		}
		var data = {
			container:"",
			name:thoughtAnimations[i].name, 
			id:i, 
			className:thoughtAnimations[i].className, 
			x:thoughtAnimations[i].x, 
			y:thoughtAnimations[i].y, 
			w:thoughtAnimations[i].w, 
			h:thoughtAnimations[i].h, 
			imgs:frames, 
			startFrame:0, 
			classContainer:null
		}
		this._thoughtBubble.addAnimationSequence(data);
	}
}

	/**
* @description Adds the thought bubble to the stage
	*/			
	addMask(){
	var maskInfo = this._mainModel.getMaskInfo();
	var classAcronym = maskInfo.type;
	var data = {
		className:this._mainModel.getGameboardClasses()[classAcronym],	
		imagePath:this._mainModel.getGameboardImageLookup()[classAcronym],
		id:'masker',
		container:"body",	
		imgs:this._mainModel.getGameboardImageLookup()[classAcronym],	
		x:maskInfo.x,
		y:maskInfo.y,
		w:maskInfo.w,
		h:maskInfo.h
	}
	this._mask = new Tile_Controller();
	var newView = new StageMask_View();
	this._mask.bindView(newView,data);	
	this._mask.hide(); 

}

	addOCD_control(){//NOT PART OF CORE
	this._MIND = new MIND();
	this._MIND.init(this._player,this._thoughtBubble, this);
	//var d = new Date();
	//var timeStamp = d.getTime();
	//OCD_object.addThought("range",timeStamp, 1);
	//OCD_object.fireLatestThought(); 
}



	addTimer(){
	var data = {
		className:"timer",		
		id:'timer',
		container:"body",	
		x:162,
		y:0,
		w:60,
		h:30,
		duration:this._mainModel.getTimeLimit()
	}

	this._timer = new Timer_Controller();
	var newView = new Timer_View();
	this._timer.bindView(newView,data);

	
	
}

	addAudio(){
	var data = {
		trackName:"myAudio"
	}

	this._audio = new Audio_Controller();
	var newView = new Audio_View();
	this._audio.bindView(newView,data);
	
	this._audio.setAudioVolume(10);
	
	this.addVolumeControl(this._audio);

	
	
}

	addVolumeControl(audioInstance){
	var volumeControlInfo = this._mainModel.getVolumeControlInfo();
	var classAcronym = volumeControlInfo.type;
	var diffX = (375 - volumeControlInfo.w) - 5;
	var diffY = (559 - volumeControlInfo.h) - 5;
	var data = {
		className:this._mainModel.getGameboardClasses()[classAcronym],	
		imagePath :this._mainModel.getGameboardImageLookup()[classAcronym],	
		id:'volumeControl',
		container:"body",
		imgs:this._mainModel.getGameboardImageLookup()[classAcronym],	
		x:diffX,
		y:diffY,
		w:volumeControlInfo.w,
		h:volumeControlInfo.h,
		buttonFunction:volumeControlInfo.buttonFunction, 
		buttonTarget:audioInstance,
		startFrame:0
	}

	this._volumeControl = new ButtonOnOff_Controller();
	var newView = new Button_View();
	this._volumeControl.bindView(newView,data); 
	

	
	
}

	addEndScreen(){
	var screenInfo = g_gameboardModel.getGoodEndScreenElements();
	var data = {
		className:"endScreenGood",	
		id:'endScreenGood',
		container:"body",	
		x:0,
		y:0,
		w:375,
		h:559,
	}
	
	this._endScreenGood = new Combination_Controller();
	var newView = new Combination_View();
	this._endScreenGood.bindView(newView,data);
	this._endScreenGood.hide();

	
	
	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var dataNested = {
			container:"endScreenGood", 
			id:'endScreenGood_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride
		};
		
		
		this._endScreenGood.addTile(dataNested);
		
		
	} 
	
	
	this._endScreenGood.getInterfaceElement("goodEndScreenButton").getView().show();
	
	
	
	
	
	var screenInfo = g_gameboardModel.getBadEndScreenElements();
	var data = {
		className:"endScreenBad",	
		id:'endScreenBad',
		container:"body",	
		x:0,
		y:0,
		w:375,
		h:559,
	}
	
	this._endScreenBad = new Combination_Controller();
	var newView = new Combination_View();
	this._endScreenBad.bindView(newView,data);
	this._endScreenBad.hide();

	
	
	for(var i = 0; i< screenInfo.length; i++){
		var classAcronym = screenInfo[i].type;
		var dataNested = {
			container:"endScreenBad", 
			id:'endScreenBad_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:screenInfo[i].x, 
			y:screenInfo[i].y, 
			w:screenInfo[i].w, 
			h:screenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:screenInfo[i].buttonFunction, 
			IDOverride:screenInfo[i].IDOverride
		};
		
		
		this._endScreenBad.addTile(dataNested);
		
		
	} 
	
	
	this._endScreenBad.getInterfaceElement("badEndScreenButton").getView().show();
	
}
		/* ------------------------------   POSITIONING AND QUADRANT FUNCTIONS ---------------------------------*/
	
			
		
	/**
* @description Returns a rect(t,r,b,l) of the player on the stage
* @return {Object} rect 
	*/
	getTransformedPoint(data, touchX, touchY, stageRotation){
  	var centerX = data.x +38;
  	var centerY = data.y +45;
	switch(this._stageRotation){
				  case 0:
				  	  var targetX = touchX - this._mainModel.getRotaterX();
					  var targetY = touchY - this._mainModel.getRotaterY();
					  var x = centerX + targetX;
					  var y = centerY + targetY;
					  
					  break;
				  case 90:
					  var targetX = touchX - this._mainModel.getRotaterX();
					  var targetY = touchY - this._mainModel.getRotaterY();
					  var x = centerX + targetY;
					  var y = centerY - targetX;
					  
					  break;
				  case 180:
					  var targetX = touchX - this._mainModel.getRotaterX();
					  var targetY = touchY - this._mainModel.getRotaterY();
					  var x = centerX - targetX;
					  var y = centerY - targetY;	
					  			
					  break;
				  case 270:
					  var targetX = touchX - this._mainModel.getRotaterX();
					  var targetY = touchY - this._mainModel.getRotaterY();
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
		/* ------------------------------   GETTERS ---------------------------------*/
		
	getPlayer(){
	return (this._player);
}

	getStage(){
	return (this._stage);
}

	getStageRotation(){
	return (this._stageRotation);
}

	getCanMoveForward(){
	return (this._canMoveForward);
}

	getMoveDistance(){
	return (this._moveDistance);
}

	getStageSpriteArray(){
	return (this._stageSpriteArray);
}

	getHitTestQuadrants(){
		return this._hitTestQuadrants;
}

	setTouchWalkInterval(intervalRef){
	this._touchWalkInterval = intervalRef;
}

	updateThoughtBubbleLoc(x,y){
	this._thoughtBubble.setViewLoc(x,y);
}

	updateMask(degrees, point){
	this._mask.setViewRotaion(degrees);
	this._mask.setViewLoc(point[0],point[1]);
}

	showGameDisplay(){
	this._gameActive = true;
	this._mask.show();
	this._rotater.show();
	this._player.show();
	g_eventHandler.dispatchAnEvent("startClock",{});
	g_eventHandler.dispatchAnEvent("startAudio",{});
	this._volumeControl.getView().show();
	this.turnOnRandomizedItems();
	g_eventHandler.dispatchAnEvent("changeZIndex",{});
}

	gameOver(){
	console.log("gameOver() called");
	g_eventHandler.dispatchAnEvent("pauseAudio",{});
	this._gameOver = true;
	
	// Stop all movement immediately
	this._player.stopWalk();
	if(this._touchWalkInterval){
		clearInterval(this._touchWalkInterval);
	}
	this.finishLastMove();
	
	var rectToCheck = this.getPlayerTransformRect();
	//console.log(rectToCheck);
	// Check if player crossed finish line (same threshold as finish line detection)
	if(rectToCheck.bottom < 150 && rectToCheck.left > 850 && rectToCheck.right < 1020){
		var decision = this.getRandomInt(0,10);
		console.log("Finish line crossed! Decision:", decision);
		if(decision >= 7){
			console.log("Showing good end screen");
			this._endScreenGood.makeActive();
		}else{
			console.log("Showing bad end screen");
			this._endScreenBad.makeActive();
		}
		 // make this random for good or bad that way it breeds a lack of trust in one's actions
	}else{
		console.log("Timer ran out - showing bad end screen");
		this._endScreenBad.makeActive();
	}
	// Hide game elements
	this._mask.hide();
	this._rotater.hide();
	this._player.hide();
	this._stage.hide();
	this._volumeControl.getView().hide();
	this._timer.hide();
	this._swipeInterface.hide();
	g_eventHandler.dispatchAnEvent("kill",{});
	//freeze all controll
	//finish screen you made it to work but you think about gas being on or you never make it to work
}

	screenRotatedPortrait(){
		if(this._gameActive){
			this._mask.show();
			this._rotater.show();
			this._player.show();
			if(!this._gameOver){
				g_eventHandler.dispatchAnEvent("resumeThought",{});
				g_eventHandler.dispatchAnEvent("resumeAudio",{});
				g_eventHandler.dispatchAnEvent("resumeClock",{});
				this._timer.show();
				this._volumeControl.getView().show();
				//this._timer.resumeClock();
			}else{
				var active = this._endScreenGood.getActive();
				if(active){
					this._endScreenGood.show();
				}else{
					this._endScreenBad.show();
				}
				
				
			}
		}
}

	screenRotatedLandscape(){
		if(this._gameActive){
			this._mask.hide();
			this._rotater.hide();
			this._player.hide();
			//this._timer.pauseClock();
			g_eventHandler.dispatchAnEvent("pauseClock",{});
			g_eventHandler.dispatchAnEvent("pauseAudio",{});
			if(!this._gameOver){
				g_eventHandler.dispatchAnEvent("pauseThought",{});
			}else{
				var active = this._endScreenGood.getActive();
				if(active){
					this._endScreenGood.hide();
				}else{
					this._endScreenBad.hide();
				}
				
			}
			this._timer.hide();
			this._volumeControl.getView().hide();
		}
}

	checkPositionForFinish(data){
/* 	console.log(data.type);
	console.log(this.getPlayerTransformRect()); */
	var rectToCheck = this.getPlayerTransformRect();
	// Check if player is in the finish area (bottom < 150, left > 850, right < 1020)
	if(rectToCheck.bottom < 150 && rectToCheck.left > 850 && rectToCheck.right < 1020){
		this.gameOver();
	}
}

	restartGame(){
	// Reset game over flag
	this._gameOver = false;
	
	// Reset rotation
	$('#rotater').css('-webkit-transform','rotate('+0+'deg)'); 
	$('#rotater').css('-moz-transform','rotate('+0+'deg)');
	$('#rotater').css('transform','rotate('+0+'deg)');
	
	// Reset stage position
	this._stage.setViewLoc(this._mainModel.getStageStartX(),this._mainModel.getStageStartY());
	
	// Reset positions of movable and sticky objects
	g_eventHandler.dispatchAnEvent("resetPosition",{});
	
	// Reset timer
	this._timer.setTotalTime(3);
	
	// Show all game elements that were hidden in gameOver()
	this._mask.show();
	this._rotater.show();
	this._player.show();
	this._stage.show();
	this._timer.show();
	this._volumeControl.getView().show();
	this._swipeInterface.show();
	
	// Hide end screens
	this._endScreenGood.hide();
	this._endScreenBad.hide();
	
	// Start game systems
	g_eventHandler.dispatchAnEvent("startClock",{});
	g_eventHandler.dispatchAnEvent("restartAudio",{});
	g_eventHandler.dispatchAnEvent("resetState",{});
	
	// Reset game state
	this.populatePretriggeredControls(this._potentialThoughtArray);
	this.turnOnRandomizedItems();
	
	console.log('game restarted');	
}




 
}