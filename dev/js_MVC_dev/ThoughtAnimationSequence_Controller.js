var ThoughtAnimationSequence_Controller = AnimationSequence_Controller.extend({
/**
* Constructor
* This class creates a time delayed animation, that we can reset unlike an animated gif. There is no way to replay an animated gif except to reload the entire gif. 
*/
construct: function() {
  	this.SC.construct();
	
},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("resetFrames", this);
	g_eventHandler.addAListener("kill", this);
	g_eventHandler.addAListener("pauseThought", this);
},



pauseThought:function(){
	this.pauseAnimation();
}


});