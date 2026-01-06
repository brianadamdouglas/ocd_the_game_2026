var ThoughtBubble_Controller = Tile_Controller.extend({
construct: function() { 
	this.SC.construct();
	this._animationsController;
	this._animating = false;
	this._className = "Thought Bubble";
},

/**
* @description Bind a View class instance to the Controller
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return null
*/
bindView: function(view, imageControllerData, stackedAnimationControllerData){
  this.init();
  this._view = view;
  this._view.init(this,imageControllerData,stackedAnimationControllerData);
  this._animationsController = this._view.getStackedAnimationController();
},


/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("hideBubble", this);
	g_eventHandler.addAListener("pauseThought", this);
	g_eventHandler.addAListener("resumeThought", this);
	g_eventHandler.addAListener("kill", this);
},


/**
* Reveal the Thought Bubble
* 
*/   
revealBubble: function() {
  this._view.revealBubble();
  
},

/**
* Hide the Thought Bubble
* 
*/   
hideBubble: function(animation) {
  this._animating = false;
  this._view.hideBubble(animation);
  
},


/**
* Begin the animation and reveal the bubble for the selected thought
* @param {String} type // the name of the property of the _animations Object toe run 
*/     
fireLatestThought: function(type){
   this._animating = true;
   this.revealBubble();
   this._animationsController.runAnimationSequence(type);
},

/**
* Begin the animation and reveal the bubble for the selected thought
* @param {String} type // the name of the property of the _animations Object toe run 
*/     
pauseThought: function(){
	//console.log('pause thought');
	if(this._animating){
		this.hide();
		g_eventHandler.dispatchAnEvent("pauseAnimationSequence",{});
	}
},

/**
* Begin the animation and reveal the bubble for the selected thought
* @param {String} type // the name of the property of the _animations Object toe run 
*/     
resumeThought: function(type){
	if(this._animating){
		this.show();
		g_eventHandler.dispatchAnEvent("resumeAnimationSequence",{});
	}
	
},

/**
* Add a new animation sequence to the thought bubble
* @param {Object} data // the name of the animation to be stored as a name:value pair in the this._animations Object 
*/    
addAnimationSequence: function(data){ //name, id, className, x, y, width, height, imgs, startFrame
   this._animationsController.addAnimationSequence(data);
},

kill:function(){
	this._animating = false;
	this.hide();
}




});