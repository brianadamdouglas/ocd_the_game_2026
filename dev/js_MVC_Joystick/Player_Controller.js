/**
* @class Player_Controller
* @description The Parent Controller class for the player
*/
var Player_Controller = Tile_Controller.extend({
construct: function() { 
	this.SC.construct();
	this._walkFrames = new Array();
	this._walkInterval;
	this._stopFrame;
	this._holdingObject;
	this._className = "Player";


},


/**
* @description Initializes the instance
* @return 
*/
init: function(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	this.setIsHoldingObject(false);
	var imagesLength = imgs.length - 1; // How do I set this up to be dynamic?
	this.set_walkFrames(imagesLength)
},



/**
* @description Sets this._holdingObject to true of false
* @return null
*/     
setIsHoldingObject: function(b) {
  	this._holdingObject = b;
},


/**
* @description Returns this._holdingObject
* @return {Boolean}
*/     
getIsHoldingObject: function() {
  	return this._holdingObject;
},


/**
* @description Populate the _walkFrames array
* @param {Interger} len // the number of walk frames
*/   
setWalkFrames: function(len) {
  	for(var i = 1; i<=len;i++){
		this._walkFrames.push(i);
	}
},


/**
* @description Instructs the View to turn off the current frame and start the walking animation
* @return null
*/  
startWalk: function(){
  this._view.getImageController().hideFrameNum(this._stopFrame);
  this.walk();
}, 


/**
* @description Instructs the View to turn off the current frame and display the frame associated with standing
* @return null
*/  
stopWalk: function(){
  this._walkFrames.unshift(this._walkFrames.pop());
  for(var i = 0; i<this._walkFrames.length; i++){
      this._view.getImageController().hideFrameNum(this._walkFrames[i]);
  }
  this._view.getImageController().showFrameNum(this._stopFrame);
}, 

/**
* @description Walk animation that cycles through this._walkFrames and displays position 0 in the View 
* @return null
*/   
walk: function(){
  this._view.getImageController().hideFrameNum(this._walkFrames[0]);
  this._walkFrames.push(this._walkFrames.shift());
  this._view.getImageController().showFrameNum(this._walkFrames[0]);
},


/**
* @description Calculates the position of the Player View(which is satically placed) to the stage which is constantly rotating
* @param {Object} position // a jQuery styled position object
* @param {Interger} stageRotation // the rotation of the Rotator View
* @param {Interger} stageWidth // the width of the Stage View
* @param {Interger} stageHeight // the height of the Stage View
* @return {Object} data //contains x,y,w,h
*/				
transformPlayerToStage: function(position, stageRotation, stageWidth, stageHeight){
  var loc = {x:position.left, y:position.top}; //send in the position of the stage
  //console.log(loc);
  var playerW = this.getViewWidth();
  var playerH = this.getViewHeight();
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
* @description Returns a rect(t,r,b,l) of the Player View as it relates to the Stage View
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

