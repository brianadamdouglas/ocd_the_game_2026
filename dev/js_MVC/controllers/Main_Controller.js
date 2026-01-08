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
		const classAcronym = playerInfo.type;
		const data = {
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
			startFrame:0
		}
		
		const hitTestHeadData = playerInfo.hitTestHeadData;
		hitTestHeadData.container = data.id;
		const hitTestTorsoData = playerInfo.hitTestTorsoData;
		hitTestTorsoData.container = data.id;
		
		this._player = new Player_OCD_Controller();
		const newView = new Player_View();
		this._player.bindView(newView,data);
		const newHittestViewHead =  new DispatchingNonGraphic_View();
		this._player.bindHitTestHeadView(newHittestViewHead, hitTestHeadData);
		const newHittestViewTorso =  new DispatchingNonGraphic_View();
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
	const temp = array.slice(0);
	for(let i = 0; i<5; i++){
		const randomPosition = this.getRandomInt(0, temp.length);
		const tempIndex = temp.splice( randomPosition, 1 );
		this._preTriggeredControls.push(tempIndex);
	}
}

	turnOnRandomizedItems(){
	for(let i = 0; i<this._preTriggeredControls.length; i++){
		const type = this._startMatrix[this._preTriggeredControls[i]].getObjectType();
		if(type === "immobile"){
			this.interactionResponse(this._startMatrix[this._preTriggeredControls[i]]);
			if(this.getRandomInt(0,5) === 1){
				this.interactionExtendedActions(this._startMatrix[this._preTriggeredControls[i]],this.getRandomInt(1,2));
			}
		}else{
			this.interactionExtendedActions(this._startMatrix[this._preTriggeredControls[i]], this.getRandomInt(1,2));
		}
	}
}

	addAssociatedThought(data){
	const relatedThoughts = this._mainModel.getRelatedMatrix()[data.type];
	if(relatedThoughts.length > 0){
		const position = this.getRandomInt(0,relatedThoughts.length);
		const thoughtToAdd = relatedThoughts[position];
		if(this.getRandomInt(0,4) === 1){
			if(thoughtToAdd !== undefined){
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
		const data = {
			container:"rotater",
			id:"stage",
			className:"stage",
			x:x,
			y:y,
			w:w,
			h:h
		}
		this._stage = new Stage_Controller();
		const newView = new NonGraphic_View();
		this._stage.bindView(newView,data);
		this._stage.setMainController(this);
}
	
	/**
* @description Adds a sprite to the stage and a reference to the sprite to the g_stageSpriteArray
* @param {Number} id 
	*/			
	addSprite(id){
		this._stageSpriteArray.push(this.createSprite(id));
				
}
			
			
	/**
	* @description Registers sprite listeners and thought types
	* @param {Object} newTile The tile object to register
	*/
	registerSpriteListeners(newTile){
		if(newTile.getThoughtType !== undefined && newTile.getThoughtType() !== undefined){
			this.updateMatrixViewPointer(newTile.getThoughtType(), newTile);
		}
	}

	/**
	* @description Registers sprite rect for hit testing
	* @param {Object} newTile The tile object to register
	* @param {Number} id The sprite ID
	*/
	registerSpriteRect(newTile, id){
		if(newTile.getClass() !== "Tile" && newTile.getClass() !== "Mobile"){
			const rectData = {controller: newTile, id: id};
			this.registerRect(rectData);
		}
	}

	/**
	* @description Handles special sprite cases (e.g., swipeInterface)
	* @param {Object} newTile The tile object
	* @param {Object} spriteData The sprite data object
	*/
	handleSpecialSprites(newTile, spriteData){
		if(spriteData.IDOverride === "swipeInterface"){
			this._swipeInterface = newTile;
		}
	}

	/**
* @description Creates a sprite
* @param {Numner} id 
* @return {Object} _name:Name of Sprite, _classReference: what type of Tile class it is
	*/			
	createSprite(id){
		const gamePiece = this._mainModel.getGameBoard()[id];
		const spriteData = this.buildSpriteData(gamePiece, id);
		const newTile = this._stage.addTile(spriteData);
		
		this.registerSpriteListeners(newTile);
		this.registerSpriteRect(newTile, id);
		this.handleSpecialSprites(newTile, spriteData);
		
		return {_name: newTile.getViewID(), _classReference: newTile};
}

	/**
* @description Builds the sprite data object from game piece information
* @param {Object} gamePiece The game piece data from the game board
* @param {Number} id The sprite ID
* @return {Object} Complete sprite data object for tile creation
	*/
	buildSpriteData(gamePiece, id){
		const classAcronym = gamePiece.type;
		const startFrame = (gamePiece.startFrame === undefined) ? 0 : gamePiece.startFrame;
		
		return {
			className: this._mainModel.getGameboardClasses()[classAcronym],
			imgs: this._mainModel.getGameboardImageLookup()[classAcronym],
			listener: gamePiece.listener,
			listenerString: gamePiece.listener,
			listener1: gamePiece.listener1,
			listenerString1: gamePiece.listener1,
			listener2: gamePiece.listener2,
			listenerString2: gamePiece.listener2,
			thoughtType: gamePiece.thoughtType,
			objectType: gamePiece.objectType,
			visibility: gamePiece.state,
			stickyHoldingOffset: gamePiece.stickyHoldingOffset,
			IDOverride: gamePiece.IDOverride,
			dropTargetFunction: gamePiece.dropTargetFunction,
			moveObject: gamePiece.moveObject,
			id: 'sprite_tile' + id,
			stage: "stage",
			x: gamePiece.x,
			y: gamePiece.y,
			w: gamePiece.w,
			h: gamePiece.h,
			container: this._stage.getViewID(),
			startFrame: startFrame
		};
	}
	
	
	/**
	* @description Registers pairs of sprites that listen and control(Doors, plugs, etc.)
	*/			
	registerPairs(){
		const max = this._mainModel.getGameBoard().length;
		for(let i = 0; i<max; i++){
			const spriteToCheck = this._stageSpriteArray[i]._classReference;
			if(spriteToCheck.hasListener()){
				const listener = spriteToCheck.getListenerString();
				const re = new RegExp(listener,"gi");
				let matchedIndex = -1;
				for(let j = 0; j< this._stageSpriteArray.length; j++){
					const name = this._stageSpriteArray[j]._name;
					if(name.match(re)!=null){			
						matchedIndex = j;
						break;
					}
				}
				if(matchedIndex !== -1){
					spriteToCheck.setListener(this._stageSpriteArray[matchedIndex]._classReference);
				}
			}
		}
	}
	
	
	/**
	* @description Catches keystroke events(Key Down)
	*/
	catchKeyDown(event){
	const key = (event.which)
	if(String.fromCharCode(key) === "W"){
		this.finishLastMove();
		this._player.startWalk();
		
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
	const key = (event.which)
	if(key === 87){
		this._player.stopWalk();
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
	const key = (event.which)

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
	const remainder = (degrees/360)%1;
	let percent;
	if(remainder < 0){
		percent = 1 + remainder;	
	}else{
		percent = remainder;
	}
	this._lastRotation = this._stageRotation
	this._stageRotation = 360 * percent;
	this.getPlayerPositionWhileTurning();
	let duration;
	if(rot === undefined || rot !== 180){
		duration = 200;
	}else{
		duration = 300;
	}
	

	$('#rotater').animate(
		{target: degrees},
		{
			step(now,fx) {
				$(this).css('-webkit-transform','rotate('+now+'deg)'); 
				$(this).css('-moz-transform','rotate('+now+'deg)');
				$(this).css('transform','rotate('+now+'deg)');
			},
			duration:duration,
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
	const target = hitObstacle[0];//hitObstacle[2];
	const hitType = hitObstacle[1];//hitObstacle[3]//getDiv
	const targetRect = target._classReference.getRect();
	const targetRectAdjusted = this.returnStageRectAdjustedForOffset(targetRect);
	const targetName = target._classReference.getViewDIV();//using for debugging, remove later
	const playerPointOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	let playerRectAdjusted;
	if(hitType=="head"){
		playerRectAdjusted = this._player.getTransformedHeadRect(playerPointOnStage, this._stageRotation);
	}else if (hitType=="torso"){
		playerRectAdjusted = this._player.getTransformedTorsoRect(playerPointOnStage, this._stageRotation);
	}

	const direction = this._stage.repositionStage(targetRectAdjusted, playerRectAdjusted, this._stageRotation, previousMoves);
	this.movementProgress();	
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
	const playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	const loc = {x:playerOnStage.x, y:playerOnStage.y}
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
	const stickyObject = data.controller;
	this._activeStickyObject = null; 
	const rectData = this.getPlayerTransformRect();
	stickyObject.setDroppedRect(rectData, this._stageRotation, this._player);
	const id = stickyObject.getViewID().replace("sprite_tile","");
	const hitTarget = this.checkForDropTarget(stickyObject); // need some sort of boolean return at this point to not alow item to register on stage
	if(!hitTarget){
		const rectData = {controller:stickyObject, id:Number(id)}
		this.registerRect(rectData); 
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
	const results = this.checkForInteraction();
	if(results.length > 0){
		for(let i = 0; i< results.length; i++){
			const spriteToCheck = results[i].sprite;
		const hitDropTarget =  this.dropTargetActions(spriteToCheck, stickyObject);
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
	let results;
	if(target === undefined){
		results = this.checkForInteraction();
	}else{
		results = this.checkForInteraction(target);
	}
	if(results.length > 0){
		for(let i = 0; i< results.length; i++){
			const spriteToCheck = results[i].sprite;
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
	* @description Calculates thought intensity based on the interacted object's thought type
	* @param {Object} interactedObject The object that was interacted with
	* @return {Number} The intensity value for the thought
	*/
	calculateThoughtIntensity(interactedObject){
		if(interactedObject.getThoughtType() === "frontDoor"){
			return 1;
		} else {
			return this.getRandomInt(1, 4);
		}
	}

	/**
	* @description Processes interaction results and triggers thoughts if appropriate
	* @param {Array} results Array of interaction results
	* @param {Object} target Optional target object
	*/
	processInteractionResults(results, target){
		for(let i = 0; i < results.length; i++){
			this.interactionResponse(results[i].sprite, results[i].direction);
			const interactedObject = (target === undefined) ? 
				results[i].interactedObject._classReference : target;
			
			if(this.getRandomInt(0, 4) !== 1){
				if(interactedObject.getThoughtType() !== undefined){
					const intensity = this.calculateThoughtIntensity(interactedObject);
					this.interactionExtendedActions(interactedObject, intensity);
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
		
		let results;
		if(target === undefined){
			results = this.checkForInteraction();
		} else {
			results = this.checkForInteraction(target);
		}
		
		if(results.length > 0){
			this.processInteractionResults(results, target);
		}
	}






	/**
* @description Checks to see if the Object in front of the player can be interacted with. In the mobile version there is a single target that gets
	* passed, the item that the user touches. In the stand alone it checks for through an array of possible items in the quadrants that the 
	* player occupies.
* @param {Interactive Tile} target // Interactive Tile or its children(Sticky, OnOff, OnOffController)
* @return {Array} results //an array of interacted objects
	*/
	
	/**
	* @description Gets the sprite to check based on target parameter
	* @param {Number} predictedObjectIndex Index in stageSpriteArray
	* @param {Object} target Optional target object
	* @return {Object} The sprite reference to check
	*/
	getSpriteToCheck(predictedObjectIndex, target){
		if(target === undefined){
			return this._stageSpriteArray[predictedObjectIndex]._classReference;
		} else {
			return target;
		}
	}

	/**
	* @description Checks if target is within interaction range based on stage rotation
	* @param {Object} targetRect Rectangle of the target object
	* @param {Object} playerRect Rectangle of the player
	* @return {Boolean} true if target is within interaction range
	*/
	isWithinInteractionRange(targetRect, playerRect){
		const catchableDistance = 20;
		const tolerance = 5;
		
		switch(this._stageRotation){
			case 0:
				return (targetRect.bottom >= playerRect.top - catchableDistance && 
				       targetRect.bottom <= playerRect.bottom) && 
				       (targetRect.right >= playerRect.left - tolerance && 
				       targetRect.left <= playerRect.right + tolerance);
			case 90:
				return (targetRect.right >= playerRect.left - catchableDistance && 
				       targetRect.right <= playerRect.right) && 
				       (targetRect.top <= playerRect.bottom + tolerance && 
				       targetRect.bottom >= playerRect.top - tolerance);
			case 180:
				return (targetRect.top <= playerRect.bottom + catchableDistance && 
				       targetRect.top > playerRect.bottom) && 
				       (targetRect.right >= playerRect.left - tolerance && 
				       targetRect.left <= playerRect.right + tolerance);
			case 270:
				return (targetRect.left <= playerRect.right + catchableDistance && 
				       targetRect.left > playerRect.left) && 
				       (targetRect.top <= playerRect.bottom + tolerance && 
				       targetRect.bottom >= playerRect.top - tolerance);
			default:
				return false;
		}
	}

	/**
	* @description Calculates interaction direction based on stage rotation
	* @param {Object} targetRect Rectangle of the target object (not used but kept for consistency)
	* @param {Object} playerRect Rectangle of the player (not used but kept for consistency)
	* @return {String|null} Direction string ("UP", "LEFT", "DOWN", "RIGHT") or null
	*/
	calculateInteractionDirection(targetRect, playerRect){
		switch(this._stageRotation){
			case 0: return "UP";
			case 90: return "LEFT";
			case 180: return "DOWN";
			case 270: return "RIGHT";
			default: return null;
		}
	}

	/**
	* @description Checks if an object can be interacted with
	* @param {Object} spriteToCheck The sprite to check
	* @param {Number} predictedObjectIndex Index in stageSpriteArray
	* @param {Object} target Optional target object
	* @return {Boolean} true if object can be interacted with
	*/
	canInteractWithObject(spriteToCheck, predictedObjectIndex, target){
		let isInteractive;
		if(target === undefined){
			isInteractive = $('#' + this._stageSpriteArray[predictedObjectIndex]._name).hasClass("interactive");
		} else {
			isInteractive = target.getViewDIV().hasClass("interactive");
		}
		
		const isDoor = spriteToCheck.getViewDivClass && spriteToCheck.getViewDivClass("door");
		const hasListener = spriteToCheck.hasListener && spriteToCheck.hasListener();
		
		return isInteractive || isDoor || hasListener;
	}

	/**
	* @description Builds an interaction result object
	* @param {Object} spriteToCheck The sprite that was checked
	* @param {Number} predictedObjectIndex Index in stageSpriteArray
	* @param {Object} target Optional target object
	* @param {String} direction Interaction direction
	* @return {Object} Interaction result object
	*/
	buildInteractionResult(spriteToCheck, predictedObjectIndex, target, direction){
		if(target === undefined){
			return {
				sprite: spriteToCheck, 
				interactedObject: this._stageSpriteArray[predictedObjectIndex], 
				direction: direction
			};
		} else {
			return {
				sprite: spriteToCheck, 
				interactedObject: target, 
				direction: direction
			};
		}
	}

	checkForInteraction(target){ //boolean
		let predictedObjectArray;
		if(target === undefined){
			predictedObjectArray = this._lastObstacles;
		} else {
			predictedObjectArray = [target];
		}
		
		const playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
		const playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);
		const results = [];
		
		for(let i = 0; i < predictedObjectArray.length; i++){
			const spriteToCheck = this.getSpriteToCheck(predictedObjectArray[i], target);
			const targetRect = spriteToCheck.getRect();
			
			if(this.isWithinInteractionRange(targetRect, playerRect)){
				const direction = this.calculateInteractionDirection(targetRect, playerRect);
				
				if(this.canInteractWithObject(spriteToCheck, predictedObjectArray[i], target)){
					const result = this.buildInteractionResult(spriteToCheck, predictedObjectArray[i], target, direction);
					results.push(result);
				}
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
	
	if(this.checkFinishLine()){
		this.gameOver();
		return;
	}
	
	const hitObstacle = this.getHits();
	if(hitObstacle[0]){
		this.handleObstacleCollisions(hitObstacle);
	}else{
		this._canMoveForward = true;
	}
	this._lastObstacles = hitObstacle[1];
	
}

	/**
* @description Checks if the player has crossed the finish line
* @return {Boolean} true if player is in finish line area
	*/
	checkFinishLine(){
		const rectToCheck = this.getPlayerTransformRect();
		return rectToCheck.bottom < 150 && 
		       rectToCheck.left > 850 && 
		       rectToCheck.right < 1020;
	}

	/**
* @description Handles collisions with obstacles, stopping player movement and resetting position
* @param {Array} hitObstacle Array containing hit information [hasHit, quadrants, hits, playerSegment]
	*/
	handleObstacleCollisions(hitObstacle){
		const hits = hitObstacle[2];
		const previousMoves = [];
		
		for(let i = 0; i < hits.length; i++){
			const isObstacle = hits[i][0]._classReference.getViewDIV().hasClass("obstacle");
			if(isObstacle){
				this._canMoveForward = false;
				previousMoves.push(this.resetPosition(hits[i], hitObstacle[3], previousMoves));
				clearInterval(this._touchWalkInterval);
				this._player.stopWalk();
			}
		}
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
	
	const mergedQuadrants = this.returnPossibleTargets();
				
	const hits = [];
	let lastPlayerSegment = '';
	for(let i = 0; i < mergedQuadrants.length; i++){
		const sprite = this._stageSpriteArray[mergedQuadrants[i]];
		const spriteSelector = '#' + sprite._name;
		const spriteName = sprite._name;
		
		const collisionResult = this.checkPlayerBodyCollision(spriteSelector, sprite);
		
		if(collisionResult.hit){
			if(this.checkFinishLineCollision(spriteName)){
				this.gameOver();
				return ([true, mergedQuadrants, [], 'finish']);
			}
		 
			if(sprite._classReference.getViewVisibility()){
				hits.push([sprite, collisionResult.segment]);
				lastPlayerSegment = collisionResult.segment;
			}
		}
	}
	return this.buildHitResult(hits, mergedQuadrants, lastPlayerSegment);
}

	/**
* @description Builds the hit result array based on whether any hits were detected
* @param {Array} hits Array of detected hits
* @param {Array} mergedQuadrants Array of quadrant indices
* @param {String} lastPlayerSegment The player segment that caused the last hit
* @return {Array} [hasHit, mergedQuadrants, hits, lastPlayerSegment] or [false, mergedQuadrants]
	*/
	buildHitResult(hits, mergedQuadrants, lastPlayerSegment){
		if(hits.length > 0){
			return ([true, mergedQuadrants, hits, lastPlayerSegment]);
		} else {
			return ([false, mergedQuadrants]);
		}
	}

	/**
* @description Checks if the player's body parts (head/torso) collide with a sprite
* @param {String} spriteSelector jQuery selector for the sprite element
* @param {Object} sprite The sprite object from stageSpriteArray
* @return {Object} {hit: Boolean, segment: String} Object indicating if collision occurred and which body part
	*/
	checkPlayerBodyCollision(spriteSelector, sprite){
		let hit = false;
		let playerSegment = '';
		
		if($('#playerHead').objectHitTest({"object":$(spriteSelector), "transparency":false}) && 
		   sprite._classReference.getViewVisibility()){
			playerSegment = 'head';
			hit = true;
		}
		
		if($('#playerTorso').objectHitTest({"object":$(spriteSelector), "transparency":false}) && 
		   sprite._classReference.getViewVisibility()){
			playerSegment = 'torso';
			hit = true;
		}
		
		return {hit, segment: playerSegment};
	}

	/**
* @description Checks if the sprite is the finish line and triggers game over
* @param {String} spriteName The name of the sprite to check
* @return {Boolean} true if this is a finish line collision
	*/
	checkFinishLineCollision(spriteName){
		return spriteName === "finishText" && !this._gameOver;
	}

	/**
* @description Gets rotation of the stage
* @param {jQuery Object} obj 
* @return {Number} g_angle
	*/
	getRotationDegrees(obj) {
	const matrix = obj.css("-webkit-transform") ||
    obj.css("-moz-transform")    ||
    obj.css("-ms-transform")     ||
    obj.css("-o-transform")      ||
    obj.css("transform");
    if(matrix !== 'none') {
		const values = matrix.split('(')[1].split(')')[0].split(',');
		const a = values[0];
		const b = values[1];
		const angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    } else { var angle = 0; }
    return angle;
}


	returnStageRectAdjustedForOffset(rect){
	const newRect = {top:0,right:0,bottom:0,left:0};
	for(let i in rect){
		newRect[i] = rect[i];
	}
	return (newRect);
}


	/**
* @description Determines the quadrants that a tile is displayed in. It is used for both the player as well as every other itme on the stage.
* @param {Object} rect (top,right,bottom,left) 
* @return {object} data
	*/
	returnRoundedRectAndDifferences(rect){
	const t = Math.floor(rect.top/this._quadSize);// subtract g_containerOffsetToAlignCharacter to offset the border
	const r = Math.floor(rect.right/this._quadSize);
	const b = Math.floor(rect.bottom/this._quadSize);
	const l = Math.floor(rect.left/this._quadSize);
	const vDiff = b - t;
	const hDiff = r - l;
	const data = {t:t,
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
	const quadsColumns = (this._mainModel.getStageWidth()/this._quadSize) + 1;
	const quadsRows = (this._mainModel.getStageHeight()/this._quadSize) + 1;
	for(let i = 0; i < quadsRows; i++){
		this._hitTestQuadrants[i] = [];
		for(let j = 0; j<quadsColumns; j++){
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
	const id = data.id;
	const tile = data.controller;
	const tileToAdd = tile;
	const rect = tileToAdd.getRect();
	const rectData = this.returnRoundedRectAndDifferences(rect);
	if(tile.getClass() !== "Tile"){
		this._hitTestQuadrants[rectData.t][rectData.l].push(id);
		tileToAdd.registerAQuad([rectData.t,rectData.l,id]);
		if(rectData.hDiff === 1 ){
			this._hitTestQuadrants[rectData.t][rectData.l + 1].push(id);
			tileToAdd.registerAQuad([rectData.t,(rectData.l+ 1),id]);
		}
		if(rectData.vDiff === 1){
			this._hitTestQuadrants[rectData.t + 1][rectData.l].push(id);
			tileToAdd.registerAQuad([(rectData.t+1),rectData.l,id]);
		}
		if(rectData.hDiff === 1 && rectData.vDiff === 1){
			this._hitTestQuadrants[rectData.t + 1][rectData.l + 1].push(id);
			tileToAdd.registerAQuad([(rectData.t+1),(rectData.l+ 1),id]);
		}
	}
	
}


	/**
* @description Removes a tile from a quadrant, or quadrants. This is used by Sticky Objects and Movable Objects, and is necessary to reset their position
	* for hit test purposes, if it finds a match, it then removes the item from the quadrant's array
* @param {Array} data // an Array of quadrants that the specific tile is to be removed from
	*/
	removeRect(data){
	const temp = this._hitTestQuadrants[data.quads[0]][data.quads[1]];
	for(let i = 0; i<temp.length; i++){
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
	
	const rect = {
		top:data.y,
		right:(data.x+data.w),
		bottom:(data.y+data.h),
		left:data.x		
	}
	const rectData = this.returnRoundedRectAndDifferences(rect);
	
	// Bounds checking to prevent array access errors
	if(!this._hitTestQuadrants || rectData.t < 0 || rectData.l < 0 || 
	   !this._hitTestQuadrants[rectData.t] || !this._hitTestQuadrants[rectData.t][rectData.l]){
		return [];
	}
	
	const quadrantsToMerge = [];
	quadrantsToMerge.push(this._hitTestQuadrants[rectData.t][rectData.l]);
	if(rectData.hDiff === 1 && this._hitTestQuadrants[rectData.t] && this._hitTestQuadrants[rectData.t][rectData.l + 1]){
		quadrantsToMerge.push(this._hitTestQuadrants[rectData.t][rectData.l + 1]);
	}
	if(rectData.vDiff === 1 && this._hitTestQuadrants[rectData.t + 1] && this._hitTestQuadrants[rectData.t + 1][rectData.l]){
		quadrantsToMerge.push(this._hitTestQuadrants[rectData.t + 1][rectData.l]);
	}
	if(rectData.hDiff === 1 && rectData.vDiff === 1 && 
	   this._hitTestQuadrants[rectData.t + 1] && this._hitTestQuadrants[rectData.t + 1][rectData.l + 1]){
		quadrantsToMerge.push(this._hitTestQuadrants[rectData.t + 1][rectData.l + 1]);
	}
	const mergedQuadrants = this.mergeQuadrants(quadrantsToMerge);
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
	
	const playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	const point = playerOnStage;
	const possibleTargets = this.registerPlayer(point);
	return possibleTargets;
}



	/**
* @description Merges the targets that the player overlays and removes duplicates
* @param {Array} a multidimensional array of up to 4 quadrants.
* @return {Array} cleanedQuadrants //an array of g_stageSpriteArray indexes
	*/				
	mergeQuadrants(a){
	const mergedQuadrants = [];
	const alreadyExists = false;
	for(let i = 0; i<a.length; i++){
		for(let j = 0; j<a[i].length; j++){
			mergedQuadrants.push(a[i][j]);
			
		}
	}
	const cleanedQuadrants = [];
	const arrayLength = mergedQuadrants.length;
	for(let k = 0; k<arrayLength; k++){
		const last = mergedQuadrants.shift();
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
	for(let i = 0; i<a.length; i++){
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
	const playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._stageRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
	const playerRect = this._player.getTransformedRect(playerOnStage, this._stageRotation, this._quadSize);	
	return (playerRect);
}


	getPlayerPositionWhileTurning(){
	if(this._player.getIsHoldingObject()){
		const playerOnStage = this._player.transformPlayerToStage($('#stage').position(), this._lastRotation, this._mainModel.getStageWidth(), this._mainModel.getStageHeight());
		const playerRect = this._player.getTransformedRect(playerOnStage, this._lastRotation, this._quadSize);	
		this._activeStickyObject.stickForTurn(playerRect);
	}
}


  /**
* @description Returns a point(x,y) of the player on the stage
* @return {Array} point //a loc of the player
	*/			


	transformObjectToStageRotation(position, stageRotation, objectWidth, objectHeight){
		const loc = {x:position.left, y:position.top};
		const objectW = objectWidth;
		const objectH = objectHeight;
  // this case/switch returns a point that is always transformed to align with the top and left of the given stage space
  let x, y, w, h;
  switch(stageRotation){
				  case 0:
		x = -(loc.x +(objectW/2));
		y = -(loc.y + (objectH/2));
		w = objectW;
		h = objectH;
					  break;
				  case 90:
		x = -(loc.y + (objectH/2));
		y = (loc.x - (objectW/2));
		w = objectH;
		h = objectW;
					  break;
				  case 180:
		x = loc.x - (objectW/2);
		y = loc.y - (objectH/2);	  
		w = objectW;
		h = objectH;						
					  break;
				  case 270:
		x = (loc.y - (objectH/2));
		y = -(loc.x +(objectW/2));
		w = objectH;
		h = objectW;				  
					  break;
  }
		const data = {x:Math.round((x)),y:Math.round((y)),w:w,h:h}		
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
		}
		
	}
}


	/**
* @description Extended functionality that specifies GAME SPECIFIC interaction response calls beyond interactions from e_InteractionResponse
* @param {Class} interactedObject //a reference to a class instance, in this case the sprite the player has intereacted with 
	*/		
	interactionExtendedActions(interactedObject, intensity){
	const thoughtType = interactedObject.getThoughtType();
	const objectType = interactedObject.getObjectType();
	if(thoughtType === undefined){
		return;
	}
	
	this._MIND.addThought(interactedObject.getViewID(),thoughtType,objectType,intensity, this.getPlayerLocation());
	
	
	
	
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
	const max = this._mainModel.getGameBoard().length;
		for(let i = 0; i<max; i++){
			const spriteToCheck = this._stageSpriteArray[i]._classReference;
			if(spriteToCheck.hasMultipleListeners()){
				for(let count = 1; count<3; count++){
					const listener = spriteToCheck["getListenerString" + count]();
					const re = new RegExp(listener,"gi");
					let matchedIndex = -1;
					for(let j = 0; j< this._stageSpriteArray.length; j++){
						const name = this._stageSpriteArray[j]._name;
						if(name.match(re)!=null){			
							matchedIndex = j;
							break;
						}
					}
					if(matchedIndex !== -1){
						spriteToCheck["setListener" + count](this._stageSpriteArray[matchedIndex]._classReference);
					}
				} 
					
			} 
		}
	}
/* ------------------------------   EXTENTION FUNCTIONS FOR DROP TARGET ---------------------------------*/		
	/**
* @description Extended function - fires when a player drops an object on a hamper.
	*/			
	dropTargetHamper(data){
	const droppedItemController = data.droppedItemController;
	const temp = data.target.getViewLoc();
	const loc = {x:temp.left, y:temp.top}
	this._topZIndex++;
	droppedItemController.setViewLoc(((loc.x + 5) +  this.getRandomInt(0,25)) , ((loc.y + 3) +  this.getRandomInt(0,10)));
	droppedItemController.getViewDIV().css('z-index', String(this._topZIndex));
}


	/**
* @description Extended function - fires when a player drops an object on the bookcase
	*/			
	dropTargetBookcase(data){
	const droppedItemController = data.droppedItemController;
	droppedItemController.getViewDIV().hide();
	for(let i in this._stageSpriteArray){
		if(this._stageSpriteArray[i]._name === "bookInBookcase"){
			this._stageSpriteArray[i]._classReference.actedUpon();
			
		}
	}
	
}

	getRandomInt(min, max) {
		 return Math.floor(Math.random() * (max - min)) + min;
}

	/**
* @description Adds the thought bubble to the stage
	*/			
	addThoughtBubble(){
	const thoughtInfo = this._mainModel.getThoughtInfo();
	const classAcronym = thoughtInfo.type;
		
	const imageControllerData = {
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
	
	const stackedAnimationControllerData = {		
		id:'stackedAnimations',
		container:"",		
		x:thoughtInfo.x,
		y:thoughtInfo.y,
		w:thoughtInfo.w,
		h:thoughtInfo.h
	}
	this._thoughtBubble = new ThoughtBubble_Controller();
	const newView = new ThoughtBubble_View();
	this._thoughtBubble.bindView(newView,imageControllerData, stackedAnimationControllerData);
	
	this.addThoughtAnimations();

}

	/**
* @description Add the thought animation sequences to the thought bubble
	*/				
	addThoughtAnimations(){
	const thoughtAnimations = this._mainModel.getThoughtAnimations();
	for(let i = 0; i<thoughtAnimations.length; i++){
		const frames = [];
		// this loop looks at teh frame count established in the gameboard.js and uses it to build out array of images, rather than listing them all
		for(let j = 0; j< thoughtAnimations[i].frameCount; j++){
			frames.push(thoughtAnimations[i].frameRoot + j + thoughtAnimations[i].frameType);
		}
		const data = {
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
	const maskInfo = this._mainModel.getMaskInfo();
	const classAcronym = maskInfo.type;
	const data = {
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
	const newView = new StageMask_View();
	this._mask.bindView(newView,data);	
	this._mask.hide(); 

}

	addOCD_control(){//NOT PART OF CORE
	this._MIND = new MIND();
	this._MIND.init(this._player,this._thoughtBubble, this);
}



	addTimer(){
	const data = {
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
	const newView = new Timer_View();
	this._timer.bindView(newView,data);

	
	
}

	addAudio(){
	const data = {
		trackName:"myAudio"
	}

	this._audio = new Audio_Controller();
	const newView = new Audio_View();
	this._audio.bindView(newView,data);
	
	this._audio.setAudioVolume(10);
	
	this.addVolumeControl(this._audio);

	
	
}

	addVolumeControl(audioInstance){
	const volumeControlInfo = this._mainModel.getVolumeControlInfo();
	const classAcronym = volumeControlInfo.type;
	const diffX = (375 - volumeControlInfo.w) - 5;
	const diffY = (559 - volumeControlInfo.h) - 5;
	const data = {
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
	const newView = new Button_View();
	this._volumeControl.bindView(newView,data); 
	

	
	
}

	addEndScreen(){
	const goodScreenInfo = g_gameboardModel.getGoodEndScreenElements();
	const goodData = {
		className:"endScreenGood",	
		id:'endScreenGood',
		container:"body",	
		x:0,
		y:0,
		w:375,
		h:559,
	}
	
	this._endScreenGood = new Combination_Controller();
	const goodView = new Combination_View();
	this._endScreenGood.bindView(goodView,goodData);
	this._endScreenGood.hide();

	
	
	for(let i = 0; i< goodScreenInfo.length; i++){
		const classAcronym = goodScreenInfo[i].type;
		const dataNested = {
			container:"endScreenGood", 
			id:'endScreenGood_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:goodScreenInfo[i].x, 
			y:goodScreenInfo[i].y, 
			w:goodScreenInfo[i].w, 
			h:goodScreenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:goodScreenInfo[i].buttonFunction, 
			IDOverride:goodScreenInfo[i].IDOverride
		};
		
		
		this._endScreenGood.addTile(dataNested);
		
		
	} 
	
	
	this._endScreenGood.getInterfaceElement("goodEndScreenButton").getView().show();
	
	
	
	
	
	const badScreenInfo = g_gameboardModel.getBadEndScreenElements();
	const badData = {
		className:"endScreenBad",	
		id:'endScreenBad',
		container:"body",	
		x:0,
		y:0,
		w:375,
		h:559,
	}
	
	this._endScreenBad = new Combination_Controller();
	const badView = new Combination_View();
	this._endScreenBad.bindView(badView,badData);
	this._endScreenBad.hide();

	
	
	for(let i = 0; i< badScreenInfo.length; i++){
		const classAcronym = badScreenInfo[i].type;
		const dataNested = {
			container:"endScreenBad", 
			id:'endScreenBad_tile'+i, 
			className:this._mainModel.getGameboardClasses()[classAcronym], 
			x:badScreenInfo[i].x, 
			y:badScreenInfo[i].y, 
			w:badScreenInfo[i].w, 
			h:badScreenInfo[i].h, 
			imgs:this._mainModel.getGameboardImageLookup()[classAcronym], 
			buttonFunction:badScreenInfo[i].buttonFunction, 
			IDOverride:badScreenInfo[i].IDOverride
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
		// Account for game-container offset if it exists
		// pageX/pageY are document-relative, but stage position might be container-relative
		let adjustedTouchX = touchX;
		let adjustedTouchY = touchY;
		
		const gameContainer = document.getElementById('game-container');
		if (gameContainer) {
			const containerRect = gameContainer.getBoundingClientRect();
			// Adjust touch coordinates to be relative to the container
			adjustedTouchX = touchX - (containerRect.left + window.pageXOffset);
			adjustedTouchY = touchY - (containerRect.top + window.pageYOffset);
		}
		
		const centerX = data.x +38;
		const centerY = data.y +45;
		let targetX, targetY, x, y;
	switch(this._stageRotation){
				  case 0:
		targetX = adjustedTouchX - this._mainModel.getRotaterX();
		targetY = adjustedTouchY - this._mainModel.getRotaterY();
		x = centerX + targetX;
		y = centerY + targetY;
					  
					  break;
				  case 90:
		targetX = adjustedTouchX - this._mainModel.getRotaterX();
		targetY = adjustedTouchY - this._mainModel.getRotaterY();
		x = centerX + targetY;
		y = centerY - targetX;
					  
					  break;
				  case 180:
		targetX = adjustedTouchX - this._mainModel.getRotaterX();
		targetY = adjustedTouchY - this._mainModel.getRotaterY();
		x = centerX - targetX;
		y = centerY - targetY;	
					  			
					  break;
				  case 270:
		targetX = adjustedTouchX - this._mainModel.getRotaterX();
		targetY = adjustedTouchY - this._mainModel.getRotaterY();
		x = centerX - targetY;
		y = centerY + targetX;			  
					  break;
					  
	}	
	const inFront = (targetY < 0) ? true : false;
	const result = {
		x:x,
		y:y,
		inFront:inFront
	}
	
	return result;		  
	
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
	if(this._thoughtBubble){
		this._thoughtBubble.setViewLoc(x,y);
	}
}

	updateMask(degrees, point){
	if(this._mask){
		this._mask.setViewRotaion(degrees);
		this._mask.setViewLoc(point[0],point[1]);
	}
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
	g_eventHandler.dispatchAnEvent("pauseAudio",{});
	this._gameOver = true;
	
	// Stop all movement immediately
	this._player.stopWalk();
	if(this._touchWalkInterval){
		clearInterval(this._touchWalkInterval);
	}
	this.finishLastMove();
	
	const rectToCheck = this.getPlayerTransformRect();
	if(rectToCheck.bottom < 150 && rectToCheck.left > 850 && rectToCheck.right < 1020){
		const decision = this.getRandomInt(0,10);
		if(decision >= 7){
			this._endScreenGood.makeActive();
		}else{
			this._endScreenBad.makeActive();
		}
	}else{
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
			}else{
		const active = this._endScreenGood.getActive();
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
			g_eventHandler.dispatchAnEvent("pauseClock",{});
			g_eventHandler.dispatchAnEvent("pauseAudio",{});
			if(!this._gameOver){
				g_eventHandler.dispatchAnEvent("pauseThought",{});
			}else{
		const active = this._endScreenGood.getActive();
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
	const rectToCheck = this.getPlayerTransformRect();
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
}




 
}