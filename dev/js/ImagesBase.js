var ImagesBase = Base.extend({
  construct: function() { 
		this.SC.construct();
  		this._className = "Images";
  },

 /**
  * Initializes the instance
  * @param {Selection} container // the selection on the stage that houses the tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width of the animation tiles.
  * @param {Interger} height // Max height of the animation tiles.
  * @param {Array} imgs // Array of image paths for the animations or various frame states
  * @param {Interger} startFrame // frame that the animation is set on
  * @return 
  */	
  init: function(container, id, width, height, imgs, startFrame) {
    	this.setID("imagesDiv"+id);
		var newDiv = document.createElement('div');
		newDiv.id = "imagesDiv"+id;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+"imagesDiv"+id);//making the jQuery selection reference		
		
		/* adding image subclass which adds the images into the currenly empty div*/
		this.images = new Array();
		if(Array.isArray(imgs)){
			for(var i = 0; i< imgs.length; i++){
				this.images[i] = new AnimationFrame();
				var img = imgs[i];
				this.images[i].init("imagesDiv"+ id, "imagesDiv"+ id + "img" + i, 'tile', img, width, height);
			}
		}else{
			this.images[0] = new AnimationFrame();
			var img = imgs;
			this.images[0].init("imagesDiv"+ id, "imagesDiv"+ id + "img" + 1, 'tile', img, width, height);
		}
		
		this.setImagesState(startFrame);
		
		/* adding image subclass */
		
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
  },
  
  /**
  * @description Display specific "frame" in images
  * @param {Interger} frameNum // frame to display
  */   
  showFrameNum: function(frameNum) {
      this.images[frameNum].show();
  },
  
  /**
  * @description Hide specific "frame" in images
  * @param {Interger} frameNum // frame to display
  */   
  hideFrameNum: function(frameNum) {
      this.images[frameNum].hide();
  },
  
  
  /**
  * @description Returns number of images in a given Selector
  * @returns {Interger} images.length // number of "frames"
  */   
  getImageCount: function() {
      return(this.images.length);
  }
  
  
  
  
});
