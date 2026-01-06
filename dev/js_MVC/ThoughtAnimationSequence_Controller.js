class ThoughtAnimationSequence_Controller extends AnimationSequence_Controller {
	/**
	* Constructor
	* This class creates a time delayed animation, that we can reset unlike an animated gif. There is no way to replay an animated gif except to reload the entire gif. 
	*/
	constructor() {
  	super();
	
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("resetFrames", this);
	g_eventHandler.addAListener("kill", this);
	g_eventHandler.addAListener("pauseThought", this);
}



	pauseThought(){
	this.pauseAnimation();
}


}