class Touch_Controller extends Tile_Controller { //was Class
 
	constructor() { 
	super();
	this._mainController;
	this._player;
	this._stage;
	this._lastInteractTime;
	this._walkInterval
	this._className = "Touch";
}

	init(mainController, player, stage){
		this._mainController = mainController;
		this._player = player;
		this._stage = stage;
		this.addSwipeInterface();
	}

	/**
* @description Extended function that specifies GAME SPECIFIC interaction for the mobile button that catches swipe and tap events 
	*/			
	addSwipeInterface(){
	$('#'+'swipeInterface').on("swipeup",this.moveUp.bind(this));
	$('#'+'swipeInterface').on("swipedown",this.moveDown.bind(this));
	$('#'+'swipeInterface').on("swipeleft",this.moveLeft.bind(this));
	$('#'+'swipeInterface').on("swiperight",this.moveRight.bind(this));
	$('#'+'swipeInterface').on("tap",this.stopAndDropOrWalk.bind(this));
	$('#'+'swipeInterface').on("taphold",this.stickyObjectInteract.bind(this));
	
}

	stickyObjectInteract(){
	this._mainController.stickyObjectDoSomething();
}


	/**
* @description Extended function that specifies GAME SPECIFIC actions for moving the Player up the stage 
	*/			
	moveUp(){

	clearInterval(this._walkInterval);

	this._player.stopWalk();
	this._mainController.finishLastMove();
	this._walkInterval = setInterval(this.moveForward.bind(this), 90); // use .bind to correct scope
	this._mainController.setTouchWalkInterval(this._walkInterval);
	this._player.startWalk();
	this._stage.moveStage(this._mainController.getMoveDistance(), this._mainController.getStageRotation(), this._mainController.getCanMoveForward());
}


	/**
* @description Extended function that specifies GAME SPECIFIC actions for turning the Player left 
	*/					
	moveLeft(){
	this.stopMoving();
	this._mainController.finishLastMove();
	this._player.startTurnLeft();
	var angle = this._mainController.getStageRotation();
	this._mainController.rotateStage(angle += 90);
}


	/**
* @description Extended function that specifies GAME SPECIFIC actions for turning the Player right 
	*/			
	moveRight(){
	this.stopMoving();
	this._mainController.finishLastMove();
	this._player.startTurnRight();
	var angle = this._mainController.getStageRotation();
	this._mainController.rotateStage(angle -= 90);
}



	/**
* @description Extended function that specifies GAME SPECIFIC actions for turning the Player 180 degrees around 
	*/			
	moveDown(){
	this.stopMoving();
	this._mainController.finishLastMove();
	this._player.startTurnRight();
	var angle = this._mainController.getStageRotation();
	this._mainController.rotateStage(angle -= 180, 180);
}



	/**
* @description Extended function that specifies GAME SPECIFIC actions for dropping a Sticky Object or if not holding a Sticky Object, moving forward one step
	*/	
	stopAndDropOrWalk(event){
	var d = new Date();
	var timeStamp = d.getTime();
	var clickInterval = timeStamp - this._lastInteractTime;
	this._lastInteractTime = timeStamp;
	//always stop walking
	
	this.stopMoving();
	
	// determine what they might have touched
	// need the player position for a relative point
	var playerOnStage = this._mainController.transformObjectToStageRotation($('#stage').position(), this._mainController.getStageRotation(), 76, 90);
	//console.log($('#stage').position());
	var point = this._mainController.getTransformedPoint(playerOnStage, event.pageX, event.pageY, this._mainController.getStageRotation());
	//console.log(point);
	//if the item is in front of them they check to see if it is something to interact with.
	if(point.inFront){
		console.log(point);
		var itemsToTest = this.registerTouch(point);
		//console.log(itemsToTest);
		var touchedObject = this.getTouchPointHits(itemsToTest[0], point.x, point.y);
		if(touchedObject !== null){
			var sticky = touchedObject[1];
			if(!sticky){// if the interactive item is not a sticky item
				this._mainController.interactWithStationaryItem(touchedObject[0]._classReference);
			}else{
				this._mainController.pickUpItem(touchedObject[0]._classReference);
				
			}			
		}else{ // the user youched inactive space so either drop the object they are holding or move forward
			if(this._player.getIsHoldingObject()){
				if(clickInterval<250){
					this._mainController.pickUpItem();
				}else{
					this._player.startWalk();
					this.moveForward();
				}
			}else{
				this._player.startWalk();
				this.moveForward();
			}
		}					
	}else{
		if(this._player.getIsHoldingObject()){
			if(clickInterval<250){	
				this._mainController.pickUpItem();
			}else{
				this._player.startWalk();
				this.moveForward();
			}
				
		}else{
			this._player.startWalk();
			this.moveForward();	
		}
	}
	

	/* document.getElementById("myAudio").play();
	document.getElementById("myAudio").volume = 0.2; */

}


	/**
* @description Extended function that specifies GAME SPECIFIC actions for moving the Player forward once 
	*/					
	moveForward(){
	this._player.walk();
	this._stage.moveStage(this._mainController.getMoveDistance(), this._mainController.getStageRotation(), this._mainController.getCanMoveForward());
}



	/**
* @description Extended function that specifies GAME SPECIFIC actions for stopping the movement of the Player
	*/	
	stopMoving(){
	clearInterval(this._walkInterval);
	this._player.stopWalk();

}

	/**
* @description Returns the quadrant that the user has touched
* @param {Point} initData
* @param {Number} id // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
	*/			
	registerTouch(initData){
	
	var rect = {top:initData.y,right:initData.x,bottom:initData.y,left:initData.x}
	var data = this._mainController.returnRoundedRectAndDifferences(rect);
	console.log(data)
	var quadrant = [];
	quadrant.push(this._mainController.getHitTestQuadrants()[data.t][data.l]);
	return(quadrant); 
	
}

	/**
* @description Returns any objects that are under the point on stage that the user has touched
* @param {Point} quadrants
* @param {Number} id // we put the id's that reference the g_stageSpriteArray. I found it was nesting objects otherwise
	*/	
	getTouchPointHits(quadrants, x, y){
		
	var hits = [];
	for(var i = 0; i<quadrants.length; i++){
		var spriteArray = this._mainController.getStageSpriteArray();
		//console.log(quadrants[i]);
		var k = '#' + spriteArray[quadrants[i]]._name;			
		var rect = spriteArray[quadrants[i]]._classReference.getRect();
		if(x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom){
			var isInteractive = $(k).hasClass( "interactive" );
			var isSticky = $(k).hasClass( "sticky" );
			if(isInteractive){
				return ([spriteArray[quadrants[i]], isSticky]);
			}
			

		}  
	}
	return (null);
	
		
		
}

}