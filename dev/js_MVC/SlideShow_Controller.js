const SlideShow_Controller = Tile_Controller.extend({
/**
* Constructor
* This class creates a time delayed animation, that we can reset unlike an animated gif. There is no way to replay an animated gif except to reload the entire gif. 
*/
construct() {
  	this.SC.construct();
	this._imageDivJQ// the jQuery reference for the Images Selection/ used for hiding and revealing the entire div
	this._frames;// an array of intergers that correspond to the images array. The frames array is shifted and pushed to produce the visible frame of the animation
	this._className = "SlideShow";
},

bindView(view, data){
	this.init(data);
	this._view = view;
	this._view.init(this,data);
	this.hideSequence();
},

init(data){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	this._frames = [];
	var imgs = data.imgs;
	if(Array.isArray(imgs)){
		for(var i = 0; i< imgs.length; i++){
			this._frames[i] = i;
		}
	}else{
		this._frames[0] = 0;
	}
	this.addListners();
	

},

/**
* @description Add Listeners to the Global Event Handler
* @return null
*/
addListners:function(){
	g_eventHandler.addAListener("resetFrames", this);
	g_eventHandler.addAListener("kill", this);
},


/**
* @description Hides all the images in the sequence and the image div 
* @param {Interger} startFrame // frame to display initially
*/   
hideSequence(startFrame) {
	if(startFrame !== undefined){
		for(var i = 0; i< this._frames.length; i++){
		    this._view.getImageController().hideFrameNum(i);
		}
		//this.images[startFrame].show();
	}
	this._view.getImageController().getViewDIV().hide(); // WHERE DO I SET THIS UP?

},

showSequence() {
 this.resetFrames();
 this._view.getImageController().showFrameNum(0);
 this._view.getImageController().getViewDIV().show();
},


/**
* @description Animates the frames sequentially. It hides the first indexed frame(image) number and shows the next. The frames Array gets shifted and pushed
* so that the next time aroud the visible frame(image) gets hidden.
* 
*/  
nextFrame(){
  	this._view.getImageController().hideFrameNum(this._frames[0]);
	this._view.getImageController().showFrameNum(this._frames[1]);
	this._frames.push(this._frames.shift());  
	return (this._frames[0] === this._frames.length - 1);
},

previousFrame(){
  	this._view.getImageController().hideFrameNum(this._frames[0]);
	this._view.getImageController().showFrameNum(this._frames[this._frames.length-1]);
	this._frames.unshift(this._frames.pop());  
	return (this._frames[0] === 0);	
},

getCurrentFrame(){
	return this._frames[0];
},

/**
* @description Resets the frame Array, and hides the selector
* 
*/   
resetFrames(){
  for(var i = 0; i< this._frames.length; i++){
   	this._frames[i] = i;   
  }
  //console.log(this._frames);
  this._view.getImageController().hideFrameNum(this._frames[this._frames.length-1]);
  //this.images[this._frames[this._frames.length-1]].hide();
  
  this._view.getImageController().getViewDIV().hide();
  
  
},

kill:function(){
	
}



});