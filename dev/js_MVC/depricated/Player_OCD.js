var Player_OCD = Player.extend({
  construct: function() { 
		this.SC.construct();
		
		/*GAME SPECIFIC PROPERTIES*/
		this._className = "Player_OCD";
		this._hitTestHeadDiv;
		this._hitTestTorsoDiv;
		this._headRect;
		this._torsoRect;
		this._turnLeftFrame;
		this._turnRightFrame;
		this._interactFrame;
		this._stickyLiftOffset;
		this._visibleFrameNumber;
		this.gameEngineStopWalkingCallback;
		/*GAME SPECIFIC PROPERTIES*/
		

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

  init: function(container, id, className, x, y, width, height, imgs, stopFrame, walkframes, turnLeftFrame, turnRightFrame, interactFrame, stickyLiftOffset) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		$('body').append(newDiv); 
		this._div = $('#'+id);
		this._div.addClass(className);
		
		/* this._div.on('swipeleft swiperight tap', '.selector', function(event) {
 			event.stopPropagation();
 			event.preventDefault();
		});  */
		
		/* CHARACTER SPECIFIC HITTEST DIVS */
		/*head*/
 		var hitTestDiv = document.createElement('div');
		hitTestDiv.id = "playerHead";
		O(id).appendChild(hitTestDiv);
		this._hitTestHeadDiv = $('#playerHead');
		var widthDifference = (width - this._hitTestHeadDiv.width())/2;
		this._headRect = {top:0, right:width - widthDifference, bottom:this._hitTestHeadDiv.height(), left:widthDifference };
		console.log(this._headRect);  
		
		/*torso*/
		var hitTestDiv = document.createElement('div');
		hitTestDiv.id = "playerTorso";
		O(id).appendChild(hitTestDiv);
		this._hitTestTorsoDiv = $('#playerTorso');
		var widthDifference = (width - this._hitTestTorsoDiv.width())/2;
		this._torsoRect = {top:height - this._hitTestTorsoDiv.height(), right:width - widthDifference, bottom:height, left:widthDifference };

		/* CHARACTER SPECIFIC HITTEST DIVS */
		
		/* adding image subclass */
		
		this._imageDiv = new ImagesBase();
		this._imageDiv.init(id, id, width, height, imgs, stopFrame);
		
		this._stopFrame = stopFrame;
		this._turnLeftFrame = turnLeftFrame;
		this._turnRightFrame = turnRightFrame;
		this._interactFrame = interactFrame;
		this._stickyLiftOffset = stickyLiftOffset;
		this._visibleFrameNumber = 0;
		this.setWalkFrames(walkframes);

		this.rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this.setIsHoldingObject(false);
		this.hide();
  },
  
  
  /**
  * @description Start the walking animation, rather than have the legs move every frame we set it to a bit slower interval
  * 
  */  
  startTurnLeft: function(){
      this._imageDiv.hideFrameNum(this._stopFrame);
      this._imageDiv.showFrameNum(this._turnLeftFrame);
      this._visibleFrameNumber = this._turnLeftFrame;
      
  }, 
  

  
  /**
  * @description Start the walking animation, rather than have the legs move every frame we set it to a bit slower interval
  * 
  */  
  startTurnRight: function(){
      this._imageDiv.hideFrameNum(this._stopFrame);
      this._imageDiv.showFrameNum(this._turnRightFrame);
      this._visibleFrameNumber = this._turnRightFrame;
      
  }, 
  
  /**
  * @description Start the walking animation, rather than have the legs move every frame we set it to a bit slower interval
  * 
  */  
  startInteract: function(){
      this._imageDiv.hideFrameNum(this._stopFrame);
      this._imageDiv.showFrameNum(this._interactFrame);
      this._visibleFrameNumber = this._interactFrame;
      
  },
  
  /**
  * @description Walk animation that cycles 2 frames at present
  * 
  */   
  walk: function(){
      this._imageDiv.hideFrameNum(this.walkFrames[0]);
      this.walkFrames.push(this.walkFrames.shift());
      this._imageDiv.showFrameNum(this.walkFrames[0]);
      this._visibleFrameNumber = this.walkFrames[0];
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
      this._imageDiv.hideFrameNum(this._turnLeftFrame);
      this._imageDiv.hideFrameNum(this._turnRightFrame);
      this._imageDiv.hideFrameNum(this._interactFrame);
      this._imageDiv.showFrameNum(this._stopFrame);
      this._visibleFrameNumber = this._stopFrame;
  }, 
  
  /**
  * @description Returns an index from the this._stickyLiftOffset Array which contains another array with an x,y point
  * @param{Array}
  */  
   getStickyOffset: function(){
     return this._stickyLiftOffset[this._visibleFrameNumber]
  }, 
  
 

			
  
  /**
  * @description Returns a rect(t,r,b,l) of the player's head transformed to the stage rotation. It does this by figuring out this._div transformed and applying the differemce based on rotation
  * @return {Object} rect 
  */
  getTransformedHeadRect: function(data, stageRotation){
      switch(stageRotation){
					  case 0:
						  var topRounded = Math.floor(data.y + this._headRect.top);
	  					  var rightRounded = Math.floor( data.x+this._headRect.right);
	  					  var bottomRounded = Math.floor(data.y + this._headRect.bottom);
	 					  var leftRounded = Math.floor(data.x + this._headRect.left);		
						  break;
					  case 90:
						  var topRounded = Math.floor((data.y+data.h) - this._headRect.right);
	  					  var rightRounded = Math.floor( data.x+ this._headRect.bottom);
	  					  var bottomRounded = Math.floor((data.y+data.h) - this._headRect.left);
	 					  var leftRounded = Math.floor(data.x + this._headRect.top);	
						  break;
					  case 180:
						  var topRounded = Math.floor((data.y + data.h) - this._headRect.bottom);
	  					  var rightRounded = Math.floor( (data.x+data.w) - this._headRect.left);
	  					  var bottomRounded = Math.floor((data.y + data.h)- this._headRect.top);
	 					  var leftRounded = Math.floor((data.x+data.w) - this._headRect.right); 					
						  break;
					  case 270:
						  var topRounded = Math.floor(data.y + this._headRect.left);
	  					  var rightRounded = Math.floor( (data.x+data.w) - this._headRect.top);
	  					  var bottomRounded = Math.floor(data.y + this._headRect.right);
	 					  var leftRounded = Math.floor((data.x+data.w) - this._headRect.bottom);					  
						  break;
	  }
          //this._headRect = {top:0, right:width - widthDifference, bottom:this._hitTestHeadDiv.height(), left:widthDifference };

	  return {top:topRounded, right:rightRounded, bottom:bottomRounded, left:leftRounded};
  },
  
  /**
  * @description Returns a rect(t,r,b,l) of the player's torso transformed to the stage rotation. It does this by figuring out this._div transformed and applying the differemce based on rotation
  * @return {Object} rect 
  */
  getTransformedTorsoRect: function(data, stageRotation){
      var tempRect;
      switch(stageRotation){
					  case 0:
						  var topRounded = Math.floor(data.y + this._torsoRect.top);
	  					  var rightRounded = Math.floor( data.x+ this._torsoRect.right);
	  					  var bottomRounded = Math.floor((data.y + data.h));
	  					  var leftRounded = Math.floor(data.x + this._torsoRect.left);	
						  break;
					  case 90:
						  var topRounded = Math.floor((data.y + data.h) - this._torsoRect.right);
	  					  var rightRounded = Math.floor( data.x+ data.w );
	  					  var bottomRounded = Math.floor((data.y+data.h) - this._torsoRect.left);
	 					  var leftRounded = Math.floor((data.x) + this._torsoRect.top);	
						  break;
					  case 180:
						  var topRounded = Math.floor(data.y);
	  					  var rightRounded = Math.floor((data.x+data.w) - this._torsoRect.left);
	  					  var bottomRounded = Math.floor((data.y + data.h) - this._torsoRect.top);
	 					  var leftRounded = Math.floor((data.x+data.w) - this._torsoRect.right); 				
						  break;
					  case 270:
						  var topRounded = Math.floor(data.y + this._torsoRect.left);
	  					  var rightRounded = Math.floor( (data.x+data.w) - this._torsoRect.top);
	  					  var bottomRounded = Math.floor(data.y + this._torsoRect.right);
	 					  var leftRounded = Math.floor(data.x);	;				  
						  break;
	  }
	 	
	  return {top:topRounded, right:rightRounded, bottom:bottomRounded, left:leftRounded};
  }
  
  
  
  
  
  
});

