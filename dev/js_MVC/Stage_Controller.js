/**
* @class Stage_Controller
* @description The Controller for the Stage Instance
*/
const Stage_Controller = Tile_Controller.extend({
construct() { 
	this.SC.construct();
	this._className = "Stage";
	
},


/**
* @description Creates a Controller with associated View and populates the stage with the View
* @param {Object} data // object containing properties to populate various Controller/View
* @return null
*/
addTile(data) {
		var className = data.className;

		
		/* OnOffTileController*/
				
		if(className.match(/OnOffTileController/gi) !== null){
			var newController = new OnOffTileControl_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);
			newController.setListenerString(data.listenerString);
			var re = new RegExp(data.listener,"gi");
			var spriteArray = this._mainController.getStageSpriteArray();
			for(var i = 0; i< spriteArray.length; i++){
				if(spriteArray[i]._name.match(re)!=null){			
					break;
				}
			}
			newController.setListenerString(data.listenerString);
			newController.setThoughtType(data.thoughtType);
			newController.setObjectType(data.objectType);
			/* var newTile = new OnOffTileController();
			var re = new RegExp(listener,"gi");
			for(var i = 0; i< stageSpriteArray.length; i++){
				if(stageSpriteArray[i]._name.match(re)!=null){			
					break;
				}
			}
			newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
			newTile.setListenerString(listenerString);
			newTile.setThoughtType(thoughtType); */
				
		/* OnOffTile*/
		
		}else if(className.match(/OnOffTile/gi) !== null){
			var newController = new OnOffTile_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);
			newController.setThoughtType(data.thoughtType);
			newController.setObjectType(data.objectType);
		
		/* StickyTile*/
			
		}else if(className.match(/sticky/gi) !== null){
			var newController = new StickyTile_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);
			newController.setMainController(this._mainController);
			newController.setHoldingOffset(data.stickyHoldingOffset);
			newController.setListenerString(data.listenerString);
			newController.setThoughtType(data.thoughtType);
			newController.setObjectType(data.objectType);
		
		/* MovableTile*/
			
		}else if(className.match(/movable/gi) !== null){
			var newController = new MovableTile_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);
			newController.setMoveObject(data.moveObject);
			newController.setThoughtType(data.thoughtType);
			newController.setObjectType(data.objectType);

		
		/* Door */
			
		}else if(className.match(/door/gi) !== null){
			var newController = new Door_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);	
			newController.setListenerString(data.listenerString);
			newController.setVisibility(data.visibility);
			newController.setDefaultVisibility(data.visibility);
			newController.setThoughtType(data.thoughtType);
			newController.setObjectType(data.objectType);

			
			
		/* HingedDoor */
			
		}else if(className.match(/hingedActive/gi) !== null){
			var newController = new HingedDoor_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);	
			newController.setListenerString1(data.listenerString1);
			newController.setListenerString2(data.listenerString2);
			newController.setVisibility(data.visibility); 
			newController.setDefaultVisibility(data.visibility);

			
			
		/* HingedDoorInactive */
			
		}else if(className.match(/hingedInactive/gi) !== null){	
			var newController = new HingedDoorInactive_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);	
			newController.setVisibility(data.visibility);
			newController.setDefaultVisibility(data.visibility); 

			
		/* InteractiveTile*/
				
		}else if(className.match(/obstacle/gi) !== null){
			var newController = new InteractiveTile_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);	
			newController.setThoughtType(data.thoughtType);	
			newController.setObjectType(data.objectType);	
			
				
		/* MobileControl or SansImage*/
				
		}else if(className.match(/mobileControl/gi) !== null){
			var newController = new Tile_Controller();
			var newView = new Mobile_View();
			newController.bindView(newView,data);			
			
		
		/* DropTargetRevealedTile*/
						
		}else if(className.match(/targetRevealed/gi) !== null){	
			var newController = new DropTargetRevealed_Controller();
			var newView = new IDOverride_View();
			newController.bindView(newView,data);		
			
		
		/* DropTarget*/
						
		}else if(className.match(/dropTarget/gi) !== null){	
			var newController = new DropTarget_Controller();
			var newView = new NonGraphic_View();
			newController.bindView(newView,data);
			newController.setMainController(this._mainController);
			newController.setDropTargetReaction(data.dropTargetFunction);			
			
		/* Tile */		
				
		}else{
			var newController = new Tile_Controller();
			var newView = new Tile_View();
			newController.bindView(newView,data);	
			/* var newTile = new Tile();
			newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath); */
		}
		
		newController.createQuadRegistry();
		return (newController);
		
		/* newTile.createQuadRegistry();
		return (newTile); */
},


/**
* @description Dispatches an Event as the Stage Instance moves 
* @return null 
*/
movementProgress:function(){
  g_eventHandler.dispatchAnEvent("movementProgress",{});
  
},

/**
* @description Dispatches an Event when the Stage Instance movement completes 
* @return null 
*/
movementComplete:function(){
  g_eventHandler.dispatchAnEvent("checkForHit",{});
},

/**
* @description Dispatches an Event relating to possibility of the Stage instance being able to move forward 
* @param {Boolean} bool 
* @return null 
*/
movementPossible:function(bool){
  g_eventHandler.dispatchAnEvent("setCanMoveForward", {bool:bool});
},


/**
* @description Moves the Stage instance down the screen by a specified number of pixels
* @param {Number} distance 
* @param {Number} stageRotation 
* @param {Boolean} canMoveForward 
*/			
moveStage(distance, stageRotation, canMoveForward){
  var options = {
  	duration: 50,
  	easing: 'swing',
  	progress:this.movementProgress,
  	complete:this.movementComplete
	};
	var myViewDiv = this._view.getDiv();
			if(canMoveForward){	
				//var duration = 100;
				switch(stageRotation){
					case 0:
						myViewDiv.animate( {left:"+=0", top:"+="+distance }, options);
						break;
					case 90:
						myViewDiv.animate( {left:"+="+distance, top:"+=0" },options);
						break;
					case 180:
						myViewDiv.animate( {left:"+=0", top:"-="+distance }, options);
						break;
					case 270:
						myViewDiv.animate( {left:"-="+distance, top:"+=0" }, options);
						break;
				}
			}
			
},


/**
* @description Moves the Stage instance by a specified number of pixels after the repositionStage is complete. There is no callback. **I should probably have it at least fire a callback to move an item if held
* @param {Number} horizontal 
* @param {Number} vertical 
*/ 
moveStageSansCallback(horizontal, vertical){
 var myViewDiv = this._view.getDiv();
 myViewDiv.animate( {left:"+="+horizontal, top:"+="+vertical }, .5, "easeInOutCirc");
},


/**
* @description Reposition the stage after the Player has collided with an obstacle
* @param {Object} targetRect // the rect that the player may be pushing against
* @param {Object} playerRect // the rect of the player on the stage
* @param {Number} stageRotation // rotation of the Rotater instance
* @param {Array} previousMoves // an array of moves that may have already happened
* @return {Interger} // 1-4 for the direction that the Player instance has pushed against
*/ 
repositionStage:function(targetRect, playerRect, stageRotation, previousMoves){ 
 var maximumOverlay = 15;
 var padding = 5;
 switch(stageRotation){
					case 0:
						//if target is above
						if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom && targetRect.bottom - playerRect.top <= maximumOverlay){
							//console.log("passed true");
							var canMove = this.checkPreviousMoves(previousMoves, 1);
							if(canMove){
								var distance = (playerRect.top - (targetRect.bottom + padding));
								this.moveStageSansCallback(0,distance);
							}
							return 1;
						//if target is below	
						}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 2);
							if(canMove){
								var distance = ((playerRect.bottom + (padding*3)) -  targetRect.top); // had been *2
								this.moveStageSansCallback(0,distance);
								this.movementPossible(true);
							}
							
							return 2;	
						// if target is to the left	
						}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right && targetRect.right - playerRect.left <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 3);
							if(canMove){
								var distance = (playerRect.left -  (targetRect.right + (padding * 3)));
								this.moveStageSansCallback(distance,0);
								this.movementPossible(true);
								
							}
							
							return 3;	
						// if target is to the right	
						}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left && playerRect.right - targetRect.left <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 4);
							if(canMove){
								var distance = ((playerRect.right + (padding * 3)) -  targetRect.left);
								this.moveStageSansCallback(distance,0);
								this.movementPossible(true);
							}
							
							return 4;	
							
						}else{
							//this.movementPossible(true);
							//console.log("something is breaking");	
						}
						
						break;
					case 90:
						if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right && targetRect.right - playerRect.left <= maximumOverlay ){
							var canMove = this.checkPreviousMoves(previousMoves, 1);
							if(canMove){
								var distance = (playerRect.left - (targetRect.right + padding));
								this.moveStageSansCallback(distance,0);
							}
							return 1;	
						}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left && playerRect.right - targetRect.left <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 2);
							if(canMove){
								var distance = ((playerRect.right + (padding*3)) - targetRect.left );//had been *2
								this.moveStageSansCallback(distance,0);
								this.movementPossible(true);
							}
							
							return 2;
						//player to the left of the object
						}else if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom && targetRect.bottom - playerRect.top <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 3);
							if(canMove){
								var distance = (playerRect.top - (targetRect.bottom + (padding * 3)));
								this.moveStageSansCallback(0,distance);
								this.movementPossible(true);
							}
							
							return 3;
						//player to the right
						}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay ){
							var canMove = this.checkPreviousMoves(previousMoves, 4);
							if(canMove){
								var distance = ((playerRect.bottom + (padding * 3)) - targetRect.top);
								this.moveStageSansCallback(0,distance);
								this.movementPossible(true);
							}
								
							return 4;	
						}else{
							//this.movementPossible(true);
						}
						break;
					case 180:
						if(targetRect.bottom >= playerRect.top && playerRect.top > targetRect.top && targetRect.bottom - playerRect.top <= maximumOverlay){
							console.log('a');
							var canMove = this.checkPreviousMoves(previousMoves, 1);
							if(canMove){
								var distance = (playerRect.top - (targetRect.bottom + (padding*3)));// had been *2
								this.moveStageSansCallback(0,distance);
								this.movementPossible(true);
							}
							
							return 1;
						}else if(targetRect.top<= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay){
							console.log('b');
							var canMove = this.checkPreviousMoves(previousMoves, 2);
							if(canMove){
								var distance = ((playerRect.bottom + padding) - targetRect.top);
								this.moveStageSansCallback(0,distance);
							}
							return 2;
						}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left && playerRect.right - targetRect.left <= maximumOverlay){
							console.log('c');
							var canMove = this.checkPreviousMoves(previousMoves, 3);
							if(canMove){
								var distance = ((playerRect.right + (padding * 3)) - targetRect.left);
								this.moveStageSansCallback(distance,0);
								this.movementPossible(true);
							}
							
							return 3;
							//g_canMoveForward = true;
						}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.left && targetRect.right - playerRect.left <= maximumOverlay){
							console.log('d');
							var canMove = this.checkPreviousMoves(previousMoves, 4);
							if(canMove){
								var distance = (playerRect.left- (targetRect.right  + (padding * 3)));
								this.moveStageSansCallback(distance,0);
								this.movementPossible(true);
							}
							
							return 4;
						}else{
							//this.movementPossible(true);	
						}
						
						break;
					case 270:
						if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left && playerRect.right - targetRect.left <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 1);
							if(canMove){
								var distance = ((playerRect.right + padding)- targetRect.left);
								this.moveStageSansCallback(distance,0);
							}
							return 1;
						}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right && targetRect.right - playerRect.left <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 2);
							if(canMove){
								var distance = (playerRect.left- (targetRect.right  + (padding*3)));// had been * 2
								this.moveStageSansCallback(distance,0);
								this.movementPossible(true);
							}
							
							return 2;
						}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 3);
							if(canMove){
								var distance = ((playerRect.bottom + (padding * 3)) - targetRect.top);
								this.moveStageSansCallback(0,distance);
								this.movementPossible(true);
							}
							
							return 3;
						}else if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom && targetRect.bottom - playerRect.top <=maximumOverlay){
							var canMove = this.checkPreviousMoves(previousMoves, 4);
							if(canMove){
								var distance = (playerRect.top - (targetRect.bottom  + (padding * 3)));
								this.moveStageSansCallback(0,distance);
								this.movementPossible(true);
							}
							
							return 4;
						}else{
							//this.movementPossible(true);	
						}
						
						break;
					default:
						console.log("defult");	
			}
},


/**
* @description During the hit test, there may be multiple items in the quadrant and the Player may also bump into more than one item in the same direction. This checks to
* see if the player has already had resistance against the previous direction

* @param {Array} previousMoves // an array of moves that may have already happened
* @param {Number} currentMove // 1-4 value based on direction
* @return {Boolean}
*/ 
checkPreviousMoves:function(previousMoves, currentMove){
 for(var i = 0; i<previousMoves.length;i++){
     if(previousMoves[i] === currentMove){
         return false;
     }
 }
 return true;
}







});
