/**
* @class Images_Controller
* @description Controller for the Images View instance that is nested in the parent View instance
*/
var Images_Controller = Controller.extend({
construct: function() { 
	this.SC.construct();
	this._className = "Images";
},

/**
* @description Display specific "frame" in the Images View instance
* @param {Interger} frameNum // frame to display
*/   
showFrameNum: function(frameNum) {
	this._view.showFrameNum(frameNum);
},

/**
* @description Hide specific "frame" in the Images View instance
* @param {Interger} frameNum // frame to display
*/   
hideFrameNum: function(frameNum) {
	this._view.hideFrameNum(frameNum);
},


/**
* @description Returns number of images contained in the Images View instance
* @returns {Interger} images.length // number of "frames"
*/   
getImageCount: function() {
	return(this._view.getImageCount());
},


/**
* @description Returns a reference to the Images View instance Selector
* @returns {jQuery} view._div // reference to the Images View instance Selector
*/  
getViewDIV: function(){
  return this._view.getDiv();
}
  
  
  
  
});
