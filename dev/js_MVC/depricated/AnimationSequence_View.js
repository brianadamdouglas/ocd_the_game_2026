var AnimationSequence_View = Tile_View.extend({
  /**
  * Constructor
  * This class creates a time delayed animation, that we can reset unlike an animated gif. There is no way to replay an animated gif except to reload the entire gif. 
  */
  construct: function() {
      	this.SC.construct();
		//this._imageDivJQ// the jQuery reference for the Images Selection/ used for hiding and revealing the entire div
		this._animateInterval;// interval that is used to turn the images, or "frames" on and off
		//this._frames;// an array of intergers that correspond to the images array. The frames array is shifted and pushed to produce the visible frame of the animation
		//this._classContainer;// reference to the containing selectors Class, used for callback functions 
		this._className = "AnimationSequence";
		this._animationComplete;
  },

  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection that houses the animation
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width of the animation tiles.
  * @param {Interger} height // Max height of the animation tiles.
  * @param {Array} imgs // Array of image paths for the animations or various frame states
  * @param {Interger} startFrame // frame that the animation is set on
  * @param {Selection} classContainer // reference to the containing selectors Class instance, used for callback functions
  * @return 
  */	 
  init: function(container, id, className, x, y, width, height, imgs, startFrame, classContainer) {
      
      
      	var container = data.container; 
      	var id = data.id;
      	var className = data.className;
      	var x = data.x;
      	var y = data.y; 
      	var width = data.width; 
      	var height = data.height; 
      	var imgs = data.imgs; 
      	var startFrame = data.startFrame; 
      	var classContainer = data.classContainer;
      	
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		O(container).appendChild(newDiv);//appends the newly created div into the container.
		this._div = $('#'+id);//making the jQuery selection reference
		this._div.addClass(className);
		/* adding image subclass */
		
		this._imageDiv = new ImagesBase();
		this._imageDiv.init(id, id, width, height, imgs, startFrame);
		this._imageDivJQ = $('#'+"imagesDiv"+ id);
		console.log()
		this._frames = new Array();
		// Building out the frame count that corresponds to the images in the imageDiv
		if(Array.isArray(imgs)){
			for(var i = 0; i< imgs.length; i++){
				this._frames[i] = i;
			}
		}else{
			this._frames[0] = 0;
		}
		
		
		/* adding image subclass */
		//this.sequenceLength = this.images.length;//not sure we need
		this._classContainer = classContainer;//establishing the reference to the containing selections class instance for callbacks when animations are complete
		this.hideSequence(startFrame);
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this._animationComplete = false;
  },


  /**
  * @description Hides all the images in the sequence and the image div 
  * @param {Interger} startFrame // frame to display initially
  */   
  /* hideSequence: function(startFrame) {
      if(startFrame != null){
     	for(var i = 0; i< this._frames.length; i++){
     	    this._imageDiv.hideFrameNum(i);
     	}
     	//this.images[startFrame].show();
     }
     this._imageDivJQ.hide();
  }, */
  
  /**
  * @description Starts the animation sequence firing
  * 
  */   
  startAnimating: function(){
      	clearInterval(this._animateInterval);
      	/* this.resetFrames();
		this._imageDiv.showFrameNum(0);
		this._imageDivJQ.show(); */
		this.showSequence();
		this._animateInterval = setInterval(this.animateNextFrame.bind(this), 1500); // use .bind to correct scope
		
		//this.images[0].show();
		
  },
 
  /**
  * @description Animates the frames sequentially. It hides the first indexed frame(image) number and shows the next. The frames Array gets shifted and pushed
  * so that the next time aroud the visible frame(image) gets hidden.
  * 
  */  
  animateNextFrame: function(){
      if(!this._animationComplete){
      	this._imageDiv.hideFrameNum(this._frames[0]);
		this._imageDiv.showFrameNum(this._frames[1]);
		this._frames.push(this._frames.shift());
		if(this._frames[1] == 0){
			this._animationComplete = true;
		}
      }else{
          this._animationComplete = false;
		  clearInterval(this._animateInterval);
		  this._classContainer.hideBubble(this);
      }
      	
  }

  /**
  * @description Resets the frame Array, and hides the selector
  * 
  */   
  /* resetFrames: function(){
      for(var i = 0; i< this._frames.length; i++){
       	this._frames[i] = i;   
      }
      this._imageDiv.hideFrameNum(this._frames[this._frames.length-1]);
      //this.images[this._frames[this._frames.length-1]].hide();
      this._imageDivJQ.hide();
      
      
  } */
  
  
  
});
