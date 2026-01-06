var ImagesAnimationSequence = ImagesBase.extend({
  construct: function() { 
		this.SC.construct();
  		this._className = "Images Animation Sequence";
  },

  
  /**
  * @description Set the image state of the images DIV -- seems like something to move into it's own class
  * @param {Interger} startFrame // frame to display initially
  */   
  setImagesState: function(startFrame) {
      if(startFrame != null){
     	for(var i = 0; i< this.images.length; i++){
     	    this.hideFrameNum(i);
     	}
     	this.showFrameNum(startFrame);
     }
  }
  
  
  
  
});
