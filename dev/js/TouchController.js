var TouchController = Class.extend({
 
construct: function() { 
	this._mainController;
	this._player;
	this._stage;
	this._lastInteractTime;
},

init:function(mainController, player, stage){
	this._mainController = mainController;
	this._player = player;
	this._stage = stage;
},

/**
* @description Extended function that specifies GAME SPECIFIC interaction for the mobile button that catches swipe and tap events 
*/			
addMobileButton: function(){
	$('#'+'swipeInterface').on("swipeup",this.moveUp);
	$('#'+'swipeInterface').on("swipedown",this.moveDown);
	$('#'+'swipeInterface').on("swipeleft",this.moveLeft);
	$('#'+'swipeInterface').on("swiperight",this.moveRight);
	$('#'+'swipeInterface').on("tap",this.stopAndDropOrWalk);
	$('#'+'swipeInterface').on("taphold",this._mainController.stickyObjectDoSomething);
	
},


/**
* @description Extended function that specifies GAME SPECIFIC actions for moving the Player up the stage 
*/			
moveUp: function(){
	clearInterval(g_walkInterval);
	this._player.stopWalk();
	this._mainController.finishLastMove();
	this._walkInterval = setInterval(this.moveForward, 90); // use .bind to correct scope
	this._player.startWalk();
	this._stage.moveStage(this._mainController.getMoveDistance(), this._mainController.getStageRotation(), this._mainController.getCanMoveForward());
}


/**
* @description Extended function that specifies GAME SPECIFIC actions for turning the Player left 
*/					
moveLeft: function(){
	this.stopMoving();
	this._mainController.finishLastMove();
	this._player.startTurnLeft();
	this._mainController.rotateStage(this._mainController.getAngle() += 90);
}


/**
* @description Extended function that specifies GAME SPECIFIC actions for turning the Player right 
*/			
moveRight: function(){
	this.stopMoving();
	this._mainController.finishLastMove();
	this._player.startTurnRight()
	this._mainController.rotateStage(this._mainController.getAngle() -= 90);
}



/**
* @description Extended function that specifies GAME SPECIFIC actions for turning the Player 180 degrees around 
*/			
moveDown: function(){
	this.stopMoving();
	this._mainController.finishLastMove();
	this._player.startTurnRight()
	this._mainController.rotateStage(this._mainController.getAngle() -= 180, 180);
}



/**
* @description Extended function that specifies GAME SPECIFIC actions for dropping a Sticky Object or if not holding a Sticky Object, moving forward one step
*/	
e_stopAndDropOrWalk: function(event){
	
	var d = new Date();
	var timeStamp = d.getTime();
	var clickInterval = timeStamp - this._lastInteractTime;
	this._lastInteractTime = timeStamp;
	console.log(clickInterval);
	//always stop walking
	
	this._mainController.stopMoving();
	
	// determine what they might have touched
	// need the player position for a relative point
	var playerOnStage = this._mainController.transformObjectToStageRotation($('#stage').position(), this._mainController.getStageRotation(), 76, 90);
	//console.log($('#stage').position());
	var point = this._mainController.getTransformedPoint(playerOnStage, event.pageX, event.pageY, this._mainController.getStageRotation());
	//console.log(point);
	//if the item is in front of them they check to see if it is something to interact with.
	if(point.inFront){
		var itemsToTest = this._mainController.registerTouch(point);
		var touchedObject = this._mainController.getTouchPointHits(itemsToTest[0], point.x, point.y);
		if(touchedObject != null){
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
	

	//document.getElementById("myAudio").play();
	//document.getElementById("myAudio2").play();
	//document.getElementById("myAudio2").volume = 0.2;

}


/**
* @description Extended function that specifies GAME SPECIFIC actions for moving the Player forward once 
*/					
moveForward: function(){
	this._player.walk();
	this._stage.moveStage(this._mainController.getMoveDistance(), this._mainController.getStageRotation(), this._mainController.getCanMoveForward());
}



/**
* @description Extended function that specifies GAME SPECIFIC actions for stopping the movement of the Player
*/	
stopMoving: function(){
	clearInterval(this._walkInterval);
	this._player.stopWalk();

}

});
