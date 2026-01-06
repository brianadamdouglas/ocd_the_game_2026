class StickyTile_Controller extends OnOffTileControl_Controller { // stickTile instances are able to be picked up by the player and placed by the player
	constructor() { 
	super();
	this._attached = false;// boolean - whether the insance is being held by the PLayer
	this._holdingOffset; // object - 4 direction x and y point offest from the main holding position for each frame of the Player's animation
	this._className = "StickyTile";
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
		g_eventHandler.addAListener("resetPosition", this);
	}


	/**
* @description Conduit for the mobile "tap", sends a reference to the interactWithStationaryItem function in the main gameEngine
	*/ 
	onPressForInteraction(){
		g_eventHandler.dispatchAnEvent("pickUpItem",{controller:this});
	}
  


	/**
* @description Set the this._attached property to true of false
* @param {Boolean} bool
	*/  
	setAttached(bool){
	this._attached = bool;  
}



	/**
* @description Set the property this._holdingOffset, used for placing the instance in relation to the Player instance
* @param {Object} offsetObj 
	*/   
	setHoldingOffset(offsetObj){
  this._holdingOffset = offsetObj;
}

	/**
* @description Set the rect Object(top,right,bottom,left)for the Tile Selector
* @param {Object} rect
	*/ 
	setDroppedRect(rect, rotation, player) {
  var top = 0;
  var right = 0;
  var bottom = 0;
  var left = 0;
  switch(rotation){
		case 0:
			top = rect.top + (45 + player.getStickyOffset());
			left = rect.right - (this.getViewWidth()/2);
			bottom = top + this.getViewHeight();
			right = left + this.getViewWidth();
			break;
		case 90:
			top = rect.top - (this.getViewWidth()/2);
			left = rect.left + (45 + player.getStickyOffset());
			bottom = rect.top + this.getViewWidth();
			right = left + this.getViewHeight();	
			break;
		case 180:
			top = rect.bottom - ((45 + this.getViewHeight()) + player.getStickyOffset());
			left = rect.left- (this.getViewWidth()/2);
			bottom = top + this.getViewHeight()
			right = left + this.getViewWidth();
			
			break;
		case 270:
			top = rect.bottom- (this.getViewWidth()/2);
			left = rect.right - ((45 + this.getViewHeight()) + player.getStickyOffset());
			bottom = top + this.getViewWidth()
			right = left + this.getViewHeight();
			break;
  }
  this._rect.top = Math.floor(top);
  this._rect.right = Math.floor(right);
  this._rect.bottom = Math.floor(bottom);
  this._rect.left = Math.floor(left);
  

}


	/**
* @description Attaches or removes the instance from the Player
	*/  
	attachUnattach(){
  this._attached = ! this._attached;
  this._frames.unshift(this._frames.pop());
  this._view.getImageController().showFrameNum(this._frames[0]);
  this._view.getImageController().hideFrameNum(this._frames[1]);
  if(this._attached){  
      this.removeQuads();
      g_eventHandler.dispatchAnEvent("stickyObjectLifted",{controller:this});
  }else{  
      g_eventHandler.dispatchAnEvent("stickyObjectDropped",{controller:this});
  }
}

	/**
* @description Public function that calls the private function this.interact, if it has a listening object(something that it should turn on or off) then tell that instance to interact
	*/   
	actedUpon(){
  this.interact();
  if(this.listener.getViewID() !== "sprite_tile0"){
  	this.listener.interact();
  }
  
}



	/**
* @description Reposition this._div so that it appears to integrate with the Player instance, in particular when moving or interacting
* @param {Object} rect// the Player's rect that has been transformed to the rotation of the stage
	*/   
	stickToPlayer(rect, rotation, player){

  var stringRotation = String(rotation);
  switch(rotation){
		case 0:
			this.setViewCSS({ "top": (rect.top + (45 + player.getStickyOffset()) + this._holdingOffset[stringRotation][1]) + "px", "left": (rect.right - (this.getViewWidth()/2)+ this._holdingOffset[stringRotation][0])+"px" });
			//this._div.animate( {left:"+=0", top:"+="+distance }, duration, 'swing',this.gameEngineMovementCallback);
			this.setViewCSS({ WebkitTransform: 'rotate(' + 0 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 0 + 'deg)'});
			break;
		case 90:
			this.setViewCSS({ "top": (rect.top - (this.getViewWidth()/2)+ this._holdingOffset[stringRotation][0]) + "px", "left": (rect.left + (45 + player.getStickyOffset())+ this._holdingOffset[stringRotation][1])+"px" });
			this.setViewCSS({ WebkitTransform: 'rotate(' + 270 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 270 + 'deg)'});
			break;
		case 180:
			this.setViewCSS({ "top": (rect.bottom - ((45 + this.getViewHeight()) + player.getStickyOffset())+ this._holdingOffset[stringRotation][1]) + "px", "left": (rect.left- (this.getViewWidth()/2)+ this._holdingOffset[stringRotation][0]) +"px" });
			this.setViewCSS({ WebkitTransform: 'rotate(' + 180 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 180 + 'deg)'});
			break;
		case 270:
			this.setViewCSS({ "top": (rect.bottom- (this.getViewWidth()/2)+ this._holdingOffset[stringRotation][0]) + "px", "left": (rect.right - ((45 + this.getViewHeight()) + player.getStickyOffset())+ this._holdingOffset[stringRotation][1]) +"px" });
			this.setViewCSS({ WebkitTransform: 'rotate(' + 90 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 90 + 'deg)'});
			break;
}



}

	/**
* @description Reposition this._div so that it appears to integrate with the Player instance, in particular when turning
* @param {Object} rect// the Player's rect that has been transformed to the rotation of the stage
	*/ 
	stickForTurn(rect){
	switch(this._mainController.getStageRotation()){
		case 0:
			this.setViewCSS({ "top": (rect.top + 30) + "px", "left": (rect.left + 35)+"px" });
			//this._div.animate( {left:"+=0", top:"+="+distance }, duration, 'swing',this.gameEngineMovementCallback);
			this.setViewCSS({ WebkitTransform: 'rotate(' + 0 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 0 + 'deg)'});
			break;
		case 90:
			this.setViewCSS({ "top": (rect.bottom - 35) + "px", "left": (rect.left + 30)+"px" });
			this.setViewCSS({ WebkitTransform: 'rotate(' + 270 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 270 + 'deg)'});
			break;
		case 180:
			this.setViewCSS({ "top": (rect.bottom - 30) + "px", "left": (rect.right - 35) +"px" });
			this.setViewCSS({ WebkitTransform: 'rotate(' + 180 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 180 + 'deg)'});
			break;
		case 270:
			this.setViewCSS({ "top": (rect.top + 35) + "px", "left": (rect.right - 30) +"px" });
			this.setViewCSS({ WebkitTransform: 'rotate(' + 90 + 'deg)'});
				 // For Mozilla browser: e.g. Firefox
			this.setViewCSS({ '-moz-transform': 'rotate(' + 90 + 'deg)'});
			break;
	}


}

	resetPosition(){
	this.removeQuads();
	this.getView().resetPosition();
	this.createQuads();
}

  
  

  
}