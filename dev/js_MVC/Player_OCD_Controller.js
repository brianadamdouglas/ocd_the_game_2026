/**
* @class Player_OCD_Controller
* @description The Controller class for the player in the OCD game
*/
const Player_OCD_Controller = Player_Controller.extend({
construct() { 
	this.SC.construct();
	
	/*GAME SPECIFIC PROPERTIES*/
	this._className = "Player_OCD"; // name of class for look up purposes
	this._hitTestHeadView; // DispatchingNonGraphic_View containing rect for the head for hit testing
	this._hitTestTorsoView; // DispatchingNonGraphic_View containing rect for the torso for hit testing
	this._headRect; // the rect of the head used for hit test detection
	this._torsoRect; // the rect of the torso used for hit test detection
	this._turnLeftFrame; // the frame number in the view that associates with turning left
	this._turnRightFrame; // the frame number in the view that associates with turning right
	this._interactFrame; // the frame number in the view that associates with interacting 
	this._stickyLiftOffset; // an array of values that determine the x offset of sticky items
	this._visibleFrameNumber; // the controller uses this number aquire the appropriate offset value from this._stickyLiftOffset 
	//this.gameEngineStopWalkingCallback;
	/*GAME SPECIFIC PROPERTIES*/
	

},


/**
* @description Bind a View class instance to the Controller, slightly different from the Parent Bind method in that it initializes the instance with data
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return null
*/
bindView(view, data){
  this.init(data);
  this._view = view;
  this._view.init(this,data);
},


/**
* @description Initializes the instance
* @param {Object} data // package of data
* @return 
*/
init(data){;
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	
	this.setIsHoldingObject(false);
	this._stopFrame = data.stopFrame;
	this._turnLeftFrame = data.turnLeftFrame;
	this._turnRightFrame = data.turnRightFrame;
	this._interactFrame = data.interactFrame;
	this._stickyLiftOffset = data.stickyLiftOffset;
	this._visibleFrameNumber = 0;
	this.setWalkFrames(data.walkFrames);
	this.addListners();
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("setNonGraphicRect", this);
},


/**
* @description Bind a DispatchingNonGraphic_View class instance to the Controller, in this case for a bounding box for the head, used for hit testing
* @param {DispatchingNonGraphic_View} view // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return null
*/
bindHitTestHeadView(view, data){
  this._hitTestHeadView = view;
  this._hitTestHeadView.init(this,data);
},


/**
* @description Bind a DispatchingNonGraphic_View class instance to the Controller, in this case for a bounding box for the torso, used for hit testing
* @param {DispatchingNonGraphic_View} view // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return null
*/
bindHitTestTorsoView(view, data){
  this._hitTestTorsoView = view;
  this._hitTestTorsoView.init(this,data);
},


/**
* @description Populate a property with data based on a non-graphical rect. Used for hitTest purposes
* @param {Object} data // package of data that include top,left,right and bottom coordinates
* @return null
*/
setNonGraphicRect:function(data){ 
	if(data.id === "playerHead"){
		this._headRect = data.rect;
	}else if(data.id === "playerTorso"){
		this._torsoRect = data.rect;
	}
},

/**
* @description Instructs the View to turn off the current frame and display the frame associated with turning left
* @return null
*/ 
startTurnLeft(){
  this._view.getImageController().hideFrameNum(this._stopFrame);
  this._view.getImageController().showFrameNum(this._turnLeftFrame);
  this._visibleFrameNumber = this._turnLeftFrame;
  
}, 



/**
* @description Instructs the View to turn off the current frame and display the frame associated with turning right
* @return null
*/ 
startTurnRight(){
  this._view.getImageController().hideFrameNum(this._stopFrame);
  this._view.getImageController().showFrameNum(this._turnRightFrame);
  this._visibleFrameNumber = this._turnRightFrame;
  
}, 

/**
* @description Instructs the View to turn off the current frame and display the frame associated with turning interacting
* @return null
*/   
startInteract(){
  this._view.getImageController().hideFrameNum(this._stopFrame);
  this._view.getImageController().showFrameNum(this._interactFrame);
  this._visibleFrameNumber = this._interactFrame;
  
},

/**
* @description Instructs the View to turn off the current frame and display the next frame that is part of the _walkFrames Array
* @return null
*/    
walk(){
  this._view.getImageController().hideFrameNum(this._walkFrames[0]);
  this._walkFrames.push(this._walkFrames.shift());
  this._view.getImageController().showFrameNum(this._walkFrames[0]);
  this._visibleFrameNumber = this._walkFrames[0];
},

/**
* @description Instructs the View to turn off the current frame and display the frame associated with standing
* @return null
*/  
stopWalk(){
  this._walkFrames.unshift(this._walkFrames.pop());
  for(var i = 0; i<this._walkFrames.length; i++){
      this._view.getImageController().hideFrameNum(this._walkFrames[i]);
  }
  this._view.getImageController().hideFrameNum(this._turnLeftFrame);
  this._view.getImageController().hideFrameNum(this._turnRightFrame);
  this._view.getImageController().hideFrameNum(this._interactFrame);
  this._view.getImageController().showFrameNum(this._stopFrame);
  this._visibleFrameNumber = this._stopFrame;
}, 

/**
* @description Returns an index from the this._stickyLiftOffset Array which contains another array with an x,y point
* @return {Interger}
*/  
getStickyOffset(){
 return this._stickyLiftOffset[this._visibleFrameNumber]
}, 



		

/**
* @description Returns a rect(t,r,b,l) of the Controller Head View transformed to the stage rotation. It does this by figuring out this._div transformed and applying the differemce based on rotation
* @param {Object} data // package of data that include positioning and size 
* @param {Interger} stageRotation // the rotation of the Rotater View
* @return {Object} rect 
*/
getTransformedHeadRect(data, stageRotation){
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
* @description Returns a rect(t,r,b,l) of the Controller Torso View transformed to the stage rotation. It does this by figuring out this._div transformed and applying the differemce based on rotation
* @param {Object} data // package of data that include positioning and size 
* @param {Interger} stageRotation // the rotation of the Rotater View
* @return {Object} rect 
*/
getTransformedTorsoRect(data, stageRotation){
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
