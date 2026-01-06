var Stage = Base.extend({
  construct: function() { 
		this.SC.construct();
		this.gameEngineMovementCallback; // function
		this.gameEngineCanMoveCallback; //function
		this.gameEngineMovementProgressCallback; // function
		this._className = "Stage";
		
  },

  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection on the stage that houses the player tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width of the animation tiles.
  * @param {Interger} height // Max height of the animation tiles.
  * @return 
  */

  init: function(container, id, className, x, y, width, height) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+id);//making the jQuery selection reference
		this._div.addClass(className);
		this.setDimensions(width,height);
		this.setLoc(x,y);
  },
  
  /**
  * @description Adds a Tile(or child) instance to the Stage. It is not necessary to use all the arguments
  * @param {String} spriteID // the defacto name of the instance's interface on the stage
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width.
  * @param {Interger} height // Max height.
  * @param {Array} imagePath // Path's of all the images.
  * @param {Class} listener 
  * @param {String} listenerString 
  * @param {String} thoughtType
  * @param {Boolean} visibility
  * @param {Array} stageSpriteArray  
  * @param {Object} stickyHoldingOffset  
  * @param {String} IDOverride  
  * @param {String} dropTargetFunction  
  * @param {Object} moveObject  
  * @return 
  */
  addTile: function(spriteID, className, x, y,w,h,imagePath,listener, listenerString, thoughtType, visibility, stageSpriteArray, stickyHoldingOffset, IDOverride, dropTargetFunction, moveObject, listener1, listener2, listenerString1, listenerString2) {
			
			/* OnOffTileController*/
					
			if(className.match(/OnOffTileController/gi) != null){
				var newTile = new OnOffTileController();
				var re = new RegExp(listener,"gi");
				for(var i = 0; i< stageSpriteArray.length; i++){
					if(stageSpriteArray[i]._name.match(re)!=null){			
						break;
					}
				}
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
				newTile.setListenerString(listenerString);
				newTile.setThoughtType(thoughtType);
					
			/* OnOffTile*/
			
			}else if(className.match(/OnOffTile/gi) != null){
				var newTile = new OnOffTile();
				var startFrame = 0;// eventually be set from a game start class
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, startFrame);
				newTile.setThoughtType(thoughtType);
			
			/* StickyTile*/
				
			}else if(className.match(/sticky/gi) != null){
				var newTile = new StickyTile();
				var startFrame = 0;	
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, startFrame);
				newTile.setGameEngineRemoveFromQuadtreeCallback(removeRect)//top level function we are passing a reference to
				newTile.setGameEngineGetPlayerRectCallback(getPlayerTransformRect)//top level function we are passing a reference to
				newTile.setGameEngineLiftedCallback(stickyObjectLifted)//top level function we are passing a reference to
				newTile.setGameEngineDroppedCallback(stickyObjectDropped)//top level function we are passing a reference to
				newTile.setAttached(false);
				newTile.setListenerString(listenerString);
				newTile.setHoldingOffset(stickyHoldingOffset);
				newTile.setThoughtType(thoughtType);
			
			/* MovableTile*/
				
			}else if(className.match(/movable/gi) != null){
				var newTile = new MovableTile();
				var startFrame = 0;	
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, startFrame,moveObject);
				newTile.setGameEngineRemoveFromQuadtreeCallback(removeRect)//top level function we are passing a reference to
				newTile.setGameEngineAddToQuadtreeCallback(registerRect);
				newTile.setThoughtType(thoughtType);
			
			/* Door */
				
			}else if(className.match(/door/gi) != null){	
				//console.log(imagePath)	
				var newTile = new Door();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
				newTile.setListenerString(listenerString);
				newTile.setVisibility(visibility);
				
				
			/* HingedDoor */
				
			}else if(className.match(/hingedActive/gi) != null){	
				//console.log(imagePath)	
				var newTile = new HingedDoor();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
				newTile.setListenerString1(listenerString1);
				newTile.setListenerString2(listenerString2);
				newTile.setVisibility(visibility);
				
				
			/* HingedDoorInactive */
				
			}else if(className.match(/hingedInactive/gi) != null){	
				//console.log(imagePath)	
				var newTile = new HingedDoorInactive();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
				newTile.setVisibility(visibility);
				
			/* InteractiveTile*/
					
			}else if(className.match(/obstacle/gi) != null){		
				var newTile = new InteractiveTile();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath);
					
			/* MobileControl or SansImage*/
					
			}else if(className.match(/mobileControl/gi) != null){		
				var newTile = new MobileControl();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,IDOverride);
			
			/* DropTargetRevealedTile*/
							
			}else if(className.match(/targetRevealed/gi) != null){		
				var newTile = new DropTargetRevealedTile();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath,IDOverride);
			
			/* DropTarget*/
							
			}else if(className.match(/dropTarget/gi) != null){		
				var newTile = new DropTarget();
				var targetFunction = window[dropTargetFunction];
				newTile.init(this.getID(), spriteID, className, x, y,w,h,targetFunction);
				
			/* Tile */		
					
			}else{
				var newTile = new Tile();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath);
			}
			
			newTile.createQuadRegistry();
			return (newTile);
  },
 
  /**
  * @description Set the callback property this.gameEngineMovementCallback to be fired at the end of a tween
  * @param {Function} func // reference to checkForHit function
  */    
  setGameEngineMovementCallback: function(func){
	this.gameEngineMovementCallback = func;   
  },
  
  /**
  * @description Set the callback property this.gameEngineCanMoveCallback
  * @param {Function} func // reference to setCanMoveForward function
  */  
  setGameEngineCanMoveCallback: function(func){
	this.gameEngineCanMoveCallback = func;   
  },
 
  /**
  * @description Set the callback property this.gameEngineMovementProgressCallback which is fired during a tween
  * @param {Function} func // reference to e_stageMovementProgressCallback function
  */    
   setGameEngineMovementProgressCallback: function(func){
	this.gameEngineMovementProgressCallback = func;   
  },
  
  
  /**
  * @description Moves the stage down the screen by a specified number of pixels
  * @param {Number} distance 
  * @param {Number} stageRotation 
  * @param {Boolean} canMoveForward 
  */			
  moveStage: function(distance, stageRotation, canMoveForward){
      var options = {
      	duration: 50,
      	easing: 'swing',
      	progress:this.gameEngineMovementProgressCallback,
      	complete:this.gameEngineMovementCallback
   	};
				if(canMoveForward){	
					//var duration = 100;
					switch(stageRotation){
						case 0:
							this._div.animate( {left:"+=0", top:"+="+distance }, options);
							break;
						case 90:
							this._div.animate( {left:"+="+distance, top:"+=0" },options);
							break;
						case 180:
							this._div.animate( {left:"+=0", top:"-="+distance }, options);
							break;
						case 270:
							this._div.animate( {left:"-="+distance, top:"+=0" }, options);
							break;
					}
				}
				
 },
 
 
  /**
  * @description Moves the stage by a specified number of pixels after the repositionStage is complete. There is no callback. **I should probably have it at least fire a callback to move an item if held
  * @param {Number} horizontal 
  * @param {Number} vertical 
  */ 
 moveStageSansCallback: function(horizontal, vertical){
     this._div.animate( {left:"+="+horizontal, top:"+="+vertical }, .5, "easeInOutCirc");
 },
 

  /**
  * @description Reposition the stage after the Player has collided with an obstacle
  * @param {Object} targetRect 
  * @param {Object} playerRect 
  * @param {Number} stageRotation 
  */ 
 repositionStage:function(targetRect, playerRect, stageRotation, previousMoves){ // previousMoves is an array of moves that may have already happened
     var maximumOverlay = 15;
     var padding = 5;
     switch(stageRotation){
						case 0:
							//if target is above
							if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom && targetRect.bottom - playerRect.top <= maximumOverlay){
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
									this.gameEngineCanMoveCallback(true);
								}
								return 2;	
							// if target is to the left	
							}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right && targetRect.right - playerRect.left <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 3);
								if(canMove){
									var distance = (playerRect.left -  (targetRect.right + (padding * 3)));
									this.moveStageSansCallback(distance,0);
									this.gameEngineCanMoveCallback(true);
								}
								return 3;	
							// if target is to the right	
							}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left && playerRect.right - targetRect.left <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 4);
								if(canMove){
									var distance = ((playerRect.right + (padding * 3)) -  targetRect.left);
									this.moveStageSansCallback(distance,0);
									this.gameEngineCanMoveCallback(true);
								}
								return 4;	
								
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
									this.gameEngineCanMoveCallback(true);
								}
								return 2;
							//player to the left of the object
							}else if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom && targetRect.bottom - playerRect.top <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 3);
								if(canMove){
									var distance = (playerRect.top - (targetRect.bottom + (padding * 3)));
									this.moveStageSansCallback(0,distance);
									this.gameEngineCanMoveCallback(true);
								}
								return 3;
							//player to the right
							}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay ){
								var canMove = this.checkPreviousMoves(previousMoves, 4);
								if(canMove){
									var distance = ((playerRect.bottom + (padding * 3)) - targetRect.top);
									this.moveStageSansCallback(0,distance);
									this.gameEngineCanMoveCallback(true);	
								}
								return 4;	
							}
							break;
						case 180:
							if(targetRect.bottom >= playerRect.top && playerRect.top > targetRect.top && targetRect.bottom - playerRect.top <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 1);
								if(canMove){
									var distance = (playerRect.top - (targetRect.bottom + (padding*3)));// had been *2
									this.moveStageSansCallback(0,distance);
									this.gameEngineCanMoveCallback(true);
								}
								return 1;
							}else if(targetRect.top<= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 2);
								if(canMove){
									var distance = ((playerRect.bottom + padding) - targetRect.top);
									this.moveStageSansCallback(0,distance);
								}
								return 2;
							}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left && playerRect.right - targetRect.left <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 3);
								if(canMove){
									var distance = ((playerRect.right + (padding * 3)) - targetRect.left);
									this.moveStageSansCallback(distance,0);
									this.gameEngineCanMoveCallback(true);
								}
								return 3;
								//g_canMoveForward = true;
							}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.left && targetRect.right - playerRect.left <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 4);
								if(canMove){
									var distance = (playerRect.left- (targetRect.right  + (padding * 3)));
									this.moveStageSansCallback(distance,0);
									this.gameEngineCanMoveCallback(true);
								}
								return 4;
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
									this.gameEngineCanMoveCallback(true);
								}
								return 2;
							}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top && playerRect.bottom - targetRect.top <= maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 3);
								if(canMove){
									var distance = ((playerRect.bottom + (padding * 3)) - targetRect.top);
									this.moveStageSansCallback(0,distance);
									this.gameEngineCanMoveCallback(true);
								}
								return 3;
							}else if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom && targetRect.bottom - playerRect.top <=maximumOverlay){
								var canMove = this.checkPreviousMoves(previousMoves, 4);
								if(canMove){
									var distance = (playerRect.top - (targetRect.bottom  + (padding * 3)));
									this.moveStageSansCallback(0,distance);
									this.gameEngineCanMoveCallback(true);
								}
								return 4;
							}
							
							break;
				}
 },
 
 checkPreviousMoves:function(previousMoves, currentMove){
     for(var i = 0; i<previousMoves.length;i++){
         if(previousMoves[i] == currentMove){
             return false;
         }
     }
     return true;
 }
 
  
  
  
  
  
  
});

