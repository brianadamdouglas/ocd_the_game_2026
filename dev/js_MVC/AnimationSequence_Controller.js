const AnimationSequence_Controller = SlideShow_Controller.extend({
/**
* Constructor
* This class creates a time delayed animation, that we can reset unlike an animated gif. There is no way to replay an animated gif except to reload the entire gif. 
*/
construct() {
  	this.SC.construct();
	this._animateInterval;// interval that is used to turn the images, or "frames" on and off
	this._className = "AnimationSequence_Controller";
	this._animationComplete;
},

bindView(view, data){
	//this.SC.bindView(view, data);
	this.init(data);
	this._view = view;
	this._view.init(this,data);
	this.postBindView();
},

postBindView(){
	this.hideSequence();
	this._animationComplete = true;
},




/**
* @description Starts the animation sequence firing
* 
*/   
startAnimating(){
	clearInterval(this._animateInterval);
	this.showSequence();
	this._animationComplete = false;
	this._animateInterval = setInterval(this.animateNextFrame.bind(this), 1500); // use .bind to correct scope
	
	//this.images[0].show();
	
},

/**
* @description Animates the frames sequentially. It hides the first indexed frame(image) number and shows the next. The frames Array gets shifted and pushed
* so that the next time aroud the visible frame(image) gets hidden.
* 
*/  
animateNextFrame(){
  if(!this._animationComplete){
  	/* this._view.getImageController().hideFrameNum(this._frames[0]);
	this._view.getImageController().showFrameNum(this._frames[1]);
	this._frames.push(this._frames.shift()); */
	
	this.nextFrame();
	if(this._frames[1] === 0){
		this._animationComplete = true;
	}
  }else{
      this._animationComplete = false;
	  clearInterval(this._animateInterval);
	  this.hideSequence();
	  //this._classContainer.hideBubble(this);
	  g_eventHandler.dispatchAnEvent("clearCurrentAnimation",{}) // make this a specific OCD animationSequence class
	  g_eventHandler.dispatchAnEvent("hideBubble",{animation:this}) // make this a specific OCD animationSequence class
  }
  	
},

pauseAnimation:function(){
	clearInterval(this._animateInterval);
},

resumeAnimation:function(){
	this._animateInterval = setInterval(this.animateNextFrame.bind(this), 1500);
},

kill:function(){
	this.pauseAnimation();
	this.resetFrames();
}



});