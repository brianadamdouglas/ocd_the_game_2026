var StackedAnimations_Controller = Tile_Controller.extend({
construct: function() { 
	this.SC.construct();
	this._animations;
	this._currentAnimation;
	this._className = "Thought Bubble";
},

init: function(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	

	this.addListners();
	this._currentAnimation = "";
	this._animations = new Object();

},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("clearCurrentAnimation", this);
	g_eventHandler.addAListener("pauseAnimationSequence", this);
	g_eventHandler.addAListener("resumeAnimationSequence", this);
},



/**
* Add a new animation sequence to the thought bubble
* @param {String} name // the name of the animation to be stored as a name:value pair in the this._animations Object 
* @param {String} id // the id in the DOM for the new animation
* @param {String} className // space delimited string of CSS class names
* @param {Interger} x // the x position of the animation Selector
* @param {Interger} y // the y position of the animation Selector
* @param {Interger} width // the width of the animation Selector
* @param {Interger} height // the height of the animation Selector
* @param {Array} imgs // an array of image urls for the sequence
* @param {String} startFrame // the frame to display first on the animation
*/    
addAnimationSequence: function(data){ //name, id, className, x, y, width, height, imgs, startFrame
	data.container = this.getViewID();
	data.id = data.name;
    this._animations[data.name] = this._view.addAnimationSequence(data);
    //g_eventHandler.addAListener("resetAnimationFrames", this._animations[name]);
   
},

/**
* Tell the specified Animation Sequence to play
* @param {String} type // the name of the property of the _animations Object to run 
*/   
runAnimationSequence: function(type){
   //this._view.startAnimating(type);
   this._currentAnimation =  this._animations[type];
   this._animations[type].startAnimating();
},

/**
* Tell the specified Animation Sequence to play
* @param {String} type // the name of the property of the _animations Object to run 
*/   
pauseAnimationSequence: function(type){
   //this._view.startAnimating(type);
   if(this._currentAnimation != ""){
   	//this._currentAnimation.pauseAnimation();
   }
   
},

/**
* Tell the specified Animation Sequence to play
* @param {String} type // the name of the property of the _animations Object to run 
*/   
resumeAnimationSequence: function(type){
   //this._view.startAnimating(type);
   if(this._currentAnimation != ""){
   	this._currentAnimation.resumeAnimation();
   }
},

clearCurrentAnimation:function(){
	this._currentAnimation = "";
}









});