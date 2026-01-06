var StickyTile = OnOffTileController.extend({ // stickTile instances are able to be picked up by the player and placed by the player
  construct: function() { 
		this.SC.construct();
		this.gameEngineGetPlayerRectCallback; // reference to the getPlayerTransformRect function in the main gameEngine
		this.gameEngineLiftedCallback; // reference to the stickyObjectLifted function in the main gameEngine
		this.gameEngineDroppedCallback; // reference to the stickyObjectDropped function in the main gameEngine
		this._attached;// boolean - whether the insance is being held by the PLayer
		this._holdingOffset; // object - 4 direction x and y point offest from the main holding position for each frame of the Player's animation
		this._className = "Sticky Tile";
  },
  
  
  /**
  * @description Conduit for the mobile "tap", sends a reference to the pickUpItem function in the main gameEngine
  */ 
   onPressForInteraction:function(){
      pickUpItem(this);//pickUpItem_mobile(this);
  }, 
 
  /**
  * @description Set the this._attached property to true of false
  * @param {Boolean} bool
  */  
  setAttached: function(bool){
	this._attached = bool;  
  },
 
  /**
  * @description Set the callback property this.gameEngineGetPlayerRectCallback to help position the instance to the Player instance
  * @param {Function} func // reference to getPlayerTransformRect funcion
  */  
  setGameEngineGetPlayerRectCallback: function(func){
	this.gameEngineGetPlayerRectCallback = func;  
  },
  
  
  /**
  * @description Set the callback property this.gameEngineLiftedCallback to let main game engine respond to the lift
  * @param {Function} func // reference to stickyObjectLifted funcion
  */  
  setGameEngineLiftedCallback: function(func){    
	this.gameEngineLiftedCallback = func;  
  },
  
 
  /**
  * @description Set the callback property this.gameEngineDroppedCallback to let main game engine respond to the drop
  * @param {Function} func // reference to stickyObjectDropped funcion
  */ 
  setGameEngineDroppedCallback: function(func){
	this.gameEngineDroppedCallback = func;  
  },
 
 
  /**
  * @description Set the property this._holdingOffset, used for placing the instance in relation to the Player instance
  * @param {Object} offsetObj 
  */   
  setHoldingOffset:function(offsetObj){
      this._holdingOffset = offsetObj;
  },
  
  /**
  * @description Set the rect Object(top,right,bottom,left)for the Tile Selector
  * @param {Object} rect
  */ 
  setDroppedRect: function(rect) {
      var top = 0;
      var right = 0;
      var bottom = 0;
      var left = 0;
      switch(g_stageRotation){
			case 0:
			console.log(g_player.getStickyOffset());
				top = rect.top + (45 + g_player.getStickyOffset());
				left = rect.right - (this._width/2);
				bottom = top + this._height;
				right = left + this._width;
				break;
			case 90:
				top = rect.top - (this._width/2);
				left = rect.left + (45 + g_player.getStickyOffset());
				bottom = rect.top + this._width;
				right = left + this._height;	
				break;
			case 180:
				top = rect.bottom - ((45 + this._height) + g_player.getStickyOffset());
				left = rect.left- (this._width/2);
				bottom = top + this._height
				right = left + this._width;
				
				break;
			case 270:
				top = rect.bottom- (this._width/2);
				left = rect.right - ((45 + this._height) + g_player.getStickyOffset());
				bottom = top + this._width
				right = left + this._height;
				break;
      }
      this.rect.top = Math.floor(top);
      this.rect.right = Math.floor(right);
      this.rect.bottom = Math.floor(bottom);
      this.rect.left = Math.floor(left);

  },
  
  
  /**
  * @description Attaches or removes the instance from the Player
  */  
  attachUnattach: function(){
      this._attached = ! this._attached;
      this.frames.unshift(this.frames.pop());
      this._imageDiv.showFrameNum(this.frames[0]);
      this._imageDiv.hideFrameNum(this.frames[1]);
      if(this._attached){  
          this.removeQuads();
          this.gameEngineLiftedCallback(this);
      }else{
          this.gameEngineDroppedCallback(this);
      }
  },
  
  /**
  * @description Public function that calls the private function this.interact, if it has a listening object(something that it should turn on or off) then tell that instance to interact
  */   
  actedUpon: function(){
      this.interact();
      //console.log(this.listener.getID());
      if(this.listener.getID() != "sprite_tile0"){
      	this.listener.interact();
      }
      
  },
  
  

  /**
  * @description Reposition this._div so that it appears to integrate with the Player instance, in particular when moving or interacting
  * @param {Object} rect// the Player's rect that has been transformed to the rotation of the stage
  */   
  stickToPlayer: function(rect){

      var rotation = g_stageRotation;
      rotation = String(rotation);
      switch(g_stageRotation){
			case 0:
				this._div.css({ "top": (rect.top + (45 + g_player.getStickyOffset()) + this._holdingOffset[rotation][1]) + "px", "left": (rect.right - (this._width/2)+ this._holdingOffset[rotation][0])+"px" });
				//this._div.animate( {left:"+=0", top:"+="+distance }, duration, 'swing',this.gameEngineMovementCallback);
				this._div.css({ WebkitTransform: 'rotate(' + 0 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 0 + 'deg)'});
				break;
			case 90:
				this._div.css({ "top": (rect.top - (this._width/2)+ this._holdingOffset[rotation][0]) + "px", "left": (rect.left + (45 + g_player.getStickyOffset())+ this._holdingOffset[rotation][1])+"px" });
				this._div.css({ WebkitTransform: 'rotate(' + 270 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 270 + 'deg)'});
				break;
			case 180:
				this._div.css({ "top": (rect.bottom - ((45 + this._height) + g_player.getStickyOffset())+ this._holdingOffset[rotation][1]) + "px", "left": (rect.left- (this._width/2)+ this._holdingOffset[rotation][0]) +"px" });
				this._div.css({ WebkitTransform: 'rotate(' + 180 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 180 + 'deg)'});
				break;
			case 270:
				this._div.css({ "top": (rect.bottom- (this._width/2)+ this._holdingOffset[rotation][0]) + "px", "left": (rect.right - ((45 + this._height) + g_player.getStickyOffset())+ this._holdingOffset[rotation][1]) +"px" });
				this._div.css({ WebkitTransform: 'rotate(' + 90 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 90 + 'deg)'});
				break;
	}
	
	
	
  },
  
  /**
  * @description Reposition this._div so that it appears to integrate with the Player instance, in particular when turning
  * @param {Object} rect// the Player's rect that has been transformed to the rotation of the stage
  */ 
  stickForTurn: function(rect){
      switch(g_stageRotation){
			case 0:
				this._div.css({ "top": (rect.top + 30) + "px", "left": (rect.left + 35)+"px" });
				//this._div.animate( {left:"+=0", top:"+="+distance }, duration, 'swing',this.gameEngineMovementCallback);
				this._div.css({ WebkitTransform: 'rotate(' + 0 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 0 + 'deg)'});
				break;
			case 90:
				this._div.css({ "top": (rect.bottom - 35) + "px", "left": (rect.left + 30)+"px" });
				this._div.css({ WebkitTransform: 'rotate(' + 270 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 270 + 'deg)'});
				break;
			case 180:
				this._div.css({ "top": (rect.bottom - 30) + "px", "left": (rect.right - 35) +"px" });
				this._div.css({ WebkitTransform: 'rotate(' + 180 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 180 + 'deg)'});
				break;
			case 270:
				this._div.css({ "top": (rect.top + 35) + "px", "left": (rect.right - 30) +"px" });
				this._div.css({ WebkitTransform: 'rotate(' + 90 + 'deg)'});
   				 // For Mozilla browser: e.g. Firefox
    			this._div.css({ '-moz-transform': 'rotate(' + 90 + 'deg)'});
				break;
	}
	

  }
  
  
  

  
});