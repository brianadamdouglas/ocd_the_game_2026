var Player = Base.extend({
  construct: function() { 
		this.SC.construct();
		this.walkFrames = new Array();
		this.walkInterval;
		this._stopFrame;
		this._holdingObject;
		this._className = "Player";


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
  * @param {Array} imgs // Array of image paths for the animations or various frame states
  * @param {Interger} startFrame // frame that the animation is set on
  * @return 
  */

  init: function(container, id, className, x, y, width, height, imgs, startFrame) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		$('body').append(newDiv); 
		this._div = $('#'+id);
		this._div.addClass(className);
		
		
		/* adding image subclass */
		
		this._imageDiv = new ImagesBase();
		this._imageDiv.init(id, id, width, height, imgs, startFrame);
		this._stopFrame = startFrame;
		var imagesLength = imgs.length - 1;
		this.setWalkFrames(imagesLength)
		
		this.rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this.setIsHoldingObject(false);
  },
 

  /**
  * @description Set the location for the Player tile in the Stage Selector
  * @param {Interger} x // the x position of the Player tile Selector
  * @param {Interger} y // the y position of the Player tile Selector
  */   
  setLoc: function(x,y) {
      	this._x = x;
      	this._y = y;
     	this._div.css('left',x);
		this._div.css('top',y);
		this.setRect(x,y);
  },

  
  /**
  * @description Return the dimensions of the PLayer tile;
  * @return {Object} the dimensions Object(width, height); 
  */    
  getDimensions: function() {
      	return {width:this._width,height:this._height};
  },
  
  /**
  * @description Sets this._holdingObject to true of false
  * @return {Boolean} b
  */     
  setIsHoldingObject: function(b) {
      	this._holdingObject = b;
  },


  /**
  * @description Gets this._holdingObject
  */ 
  getIsHoldingObject: function() {
      	return this._holdingObject;
  },
  
  
  /**
  * @description Populate the walkFrames array
  * @param {Interger} x // the x position of the Player tile Selector
  * @param {Interger} y // the y position of the Player tile Selector
  */   
  setWalkFrames: function(len) {
      	for(var i = 1; i<=len;i++){
			this.walkFrames.push(i);
		}
  },
 

  /**
  * @description Start the walking animation, rather than have the legs move every frame we set it to a bit slower interval
  * 
  */  
  startWalk: function(){
      this._imageDiv.hideFrameNum(this._stopFrame);
      this.walk();
  }, 
 
  /**
  * @description Stop the walking animation
  * 
  */  
  stopWalk: function(){
      this.walkFrames.unshift(this.walkFrames.pop());
      for(var i = 0; i<this.walkFrames.length; i++){
          this._imageDiv.hideFrameNum(this.walkFrames[i]);
      }
      this._imageDiv.showFrameNum(this._stopFrame);
  }, 
 
  /**
  * @description Walk animation that cycles 2 frames at present
  * 
  */   
  walk: function(){
      this._imageDiv.hideFrameNum(this.walkFrames[0]);
      this.walkFrames.push(this.walkFrames.shift());
      this._imageDiv.showFrameNum(this.walkFrames[0]);
  },
  
  
  /**
  * @description Returns a point(x,y) of the player on the stage
  * @return {Object} data //contains x,y,w,h
  */				
  transformPlayerToStage: function(position, stageRotation, stageWidth, stageHeight){
	  var loc = {x:position.left, y:position.top}; //send in the position of the stage
	  //console.log(loc);
	  var playerW = this._width;
	  var playerH = this._height;
	  // this case/switch returns a point that is always transformed to align with the top and left of the given stage space
	  switch(stageRotation){
					  case 0:
						  var x = -(loc.x +(playerW/2));
						  var y = -(loc.y + (playerH/2));
						  var w = playerW;
						  var h = playerH;
						  break;
					  case 90:
						  var x = -(loc.y + (playerH/2));
						  var y = (loc.x - (playerW/2));
						  var w = playerH;
						  var h = playerW;
						  break;
					  case 180:
						  var x = loc.x - (playerW/2)
						  var y = loc.y - (playerH/2)	  
						  var w = playerW;
						  var h = playerH;						
						  break;
					  case 270:
						  var x = (loc.y - (playerH/2));
						  var y = -(loc.x +(playerW/2));
						  var w = playerH;
						  var h = playerW;				  
						  break;
	  }
	  var data = {x:Math.round((x)),y:Math.round((y)),w:w,h:h}	
	  //console.log(data);	
	  return data;

  },
			
  /**
  * @description Returns a rect(t,r,b,l) of the player on the stage
  * @return {Object} rect 
  */
  getTransformedRect: function(data, stageRotation){
	  var topRounded = Math.floor(data.y);
	  var rightRounded = Math.floor(data.x+data.w);
	  var bottomRounded = Math.floor(data.y+data.h);
	  var leftRounded = Math.floor(data.x);		
	  return {top:topRounded, right:rightRounded, bottom:bottomRounded, left:leftRounded};
  }
  
  
  
  
  
  
});

