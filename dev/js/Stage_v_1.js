var Stage = Base.extend({
  construct: function() { 
		this.SC.construct();
		this.gameEngineMovementCallback; // function
		this.gameEngineCanMoveCallback; //function
		this._className = "Stage";
		
  },

  /**
  * Initializes the instance
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
  
  
  addTile: function(spriteID, className, x, y,w,h,imagePath,listener, listenerString, thoughtType, visibility, stageSpriteArray) {
			if(className.match(/OnOffTileListener/gi) != null){
				var newTile = new OnOffTileListener();
				//console.log(imagePath);
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
					
					
			}else if(className.match(/OnOffTileController/gi) != null){
				var newTile = new OnOffTileController();
				var re = new RegExp(listener,"gi");
				for(var i = 0; i< stageSpriteArray.length; i++){
					if(stageSpriteArray[i]._name.match(re)!=null){			
						break;
					}
				}
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
				//console.log(listener, listenerString);
				newTile.setListenerString(listenerString);
				//newTile.setListener(stageSpriteArray[i]._classReference);	
				newTile.setThoughtType(thoughtType);
					
					
			}else if(className.match(/OnOffTile/gi) != null){
				var newTile = new OnOffTile();
				var startFrame = Math.round(Math.random());	
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, startFrame);
				newTile.setThoughtType(thoughtType);
				
			}else if(className.match(/door/gi) != null){		
				var newTile = new Door();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath, 0);
				newTile.setListenerString(listenerString);
				newTile.setVisibility(visibility);
					
			}else if(className.match(/obstacle/gi) != null){		
				var newTile = new InteractiveTile();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath);
					
					
			}else{
				//console.log(imagePath);
				var newTile = new Tile();
				newTile.init(this.getID(), spriteID, className, x, y,w,h,imagePath);
			}
			
			return (newTile);
  },
  
  setGameEngineMovementCallback: function(func){
	this.gameEngineMovementCallback = func;   
  },
  
  setGameEngineCanMoveCallback: function(func){
	this.gameEngineCanMoveCallback = func;   
  },
  /**
			* Moves the stage down the screen by a specified number of pixels
			* @param {Number} distance 
			*/			
  moveStage: function(distance, stageRotation, canMoveForward){
				if(canMoveForward){	
					var duration = 60;
					switch(stageRotation){
						case 0:
							this._div.animate( {left:"+=0", top:"+="+distance }, duration, 'swing',this.gameEngineMovementCallback);
							break;
						case 90:
							this._div.animate( {left:"+="+distance, top:"+=0" }, duration, 'swing',this.gameEngineMovementCallback);
							break;
						case 180:
							this._div.animate( {left:"+=0", top:"-="+distance }, duration, 'swing',this.gameEngineMovementCallback);
							break;
						case 270:
							this._div.animate( {left:"-="+distance, top:"+=0" }, duration, 'swing',this.gameEngineMovementCallback);
							break;
					}
				}
				
 },
 
 moveStageSansCallback: function(horizontal, vertical){
     this._div.animate( {left:"+="+horizontal, top:"+="+vertical }, 0);
 },
 
 repositionStage:function(targetRect, playerRect, distance, stageRotation){
     switch(stageRotation){
						case 0:
							//if target is above
							if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom){
								this.moveStageSansCallback(0,-distance);
							//if target is below	
							}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top){
								this.moveStageSansCallback(0,distance);
								this.gameEngineCanMoveCallback(true);	
							// if target is to the left	
							}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right){
								this.moveStageSansCallback(distance,0);
								this.gameEngineCanMoveCallback(true);
							// if target is to the right	
							}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left){
								this.moveStageSansCallback(-distance,0);
								this.gameEngineCanMoveCallback(true);
								
								
							}
							
							break;
						case 90:
							if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right){
								this.moveStageSansCallback(-distance,0);
							}else if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left){
								this.moveStageSansCallback(distance,0);
								this.gameEngineCanMoveCallback(true);
							}else if(targetRect.bottom >= playerRect.top && playerRect.bottom < targetRect.bottom){
								this.moveStageSansCallback(0,-distance);
								this.gameEngineCanMoveCallback(true);
							}else if(targetRect.top <= playerRect.botom && playerRect.top > targetRect.top){
								this.moveStageSansCallback(0,distance);
								this.gameEngineCanMoveCallback(true);
								
							}
							break;
						case 180:
							if(targetRect.bottom >= playerRect.top && playerRect.top > targetRect.top){
								this.moveStageSansCallback(0,-distance);
								this.gameEngineCanMoveCallback(true);
							}else if(targetRect.top<= playerRect.bottom && playerRect.top < targetRect.top){
								this.moveStageSansCallback(0,distance);
							}else if(targetRect.left < playerRect.right && playerRect.left < targetRect.left){
								this.moveStageSansCallback(distance,0);
								this.gameEngineCanMoveCallback(true);
								//g_canMoveForward = true;
							}else if(targetRect.right > playerRect.left && playerRect.right > targetRect.left){
								this.moveStageSansCallback(-distance,0);
								this.gameEngineCanMoveCallback(true);
							}
							
							break;
						case 270:
							if(targetRect.left <= playerRect.right && playerRect.left < targetRect.left){
								this.moveStageSansCallback(distance,0);
							}else if(targetRect.right >= playerRect.left && playerRect.right > targetRect.right){
								this.moveStageSansCallback(-distance,0);
								this.gameEngineCanMoveCallback(true);
							}else if(targetRect.top <= playerRect.bottom && playerRect.top < targetRect.top){
								this.moveStageSansCallback(0,distance);
								this.gameEngineCanMoveCallback(true);
							}else if(targetRect.bottom >= playerRect.top && playerRect.bottom > targetRect.bottom){
								this.moveStageSansCallback(0,-distance);
								this.gameEngineCanMoveCallback(true);
							}
							
							break;
				}
 }
 
  
  
  
  
  
  
});

