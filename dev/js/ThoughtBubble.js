var ThoughtBubble = Base.extend({
  construct: function() { 
  		this.SC.construct();
		this.baseimageDiv;
		this.baseImage;
		this.imageDiv;
		this.images;
		this._animations;
		this._OCDReference;
		this._className = "Thought Bubble";
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
  * @return 
  */ 
  init: function(container, id, className, x, y, width, height, img) {
      
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		$('body').append(newDiv); 
		this._div = $('#'+id);
		this._div.addClass(className);
		/* adding image subclass */
		this.baseimageDiv = document.createElement('div');
		this.baseimageDiv.id = "baseimageDiv"+ id;
		O(id).appendChild(this.baseimageDiv);
		this.baseImage = new AnimationFrame();
		this.baseImage.init("baseimageDiv"+ id, "baseimageDiv"+ id + "img" + 1, 'tile', img, width, height);
		this.imageDiv = document.createElement('div');
		this.imageDiv.id = "imagesDiv"+ id;
		O(id).appendChild(this.imageDiv);
		this.images = new Array();
		this._div.hide();	
		this._animations = new Object();
		
		/* adding image subclass */
		//this.setImagesState(startFrame);
		this.setDimensions(width,height);
		this.setLoc(x,y);
  },

  /**
  * Set the image state of the images DIV
  * @param {Interger} startFrame // frame to display initially
  */     
  setImagesState: function(startFrame) {
      if(startFrame != null){
     	for(var i = 0; i< this.images.length; i++){
     	    this.images[i].hide();
     	}
     	this.images[startFrame].show();
     }
  },

  /**
  * Reveal the Thought Bubble
  * 
  */   
  revealBubble: function() {
      this._div.fadeIn( "slow", function() { });
      
   },

  /**
  * Hide the Thought Bubble Selector
  *
  */ 
   hideBubble: function(animation) {
      var reference = this;
      this._div.fadeOut( "fast", function() { animation.resetFrames();reference.bubbleHidden();});
      /* var reference = this;
      var options = {
      	duration: 50,
      	easing: 'swing',
      	complete:jQuery.proxy(this.bubbleHidden, this)
   	};
      this._div.fadeOut(options); // */
      
   },

  /**
  * Begin the animation and reveal the bubble for the selected thought
  * @param {String} type // the name of the property of the _animations Object toe run 
  */     
   fireLatestThought: function(type){
       this.revealBubble();
       this.runAnimationSequence(type);
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
   addAnimationSequence: function(name, id, className, x, y, width, height, imgs, startFrame){
       this._animations[name] = new AnimationSequence();
       this._animations[name].init("imagesDiv" + this.getID(), id, className, x, y, width, height, imgs, startFrame, this);
   },

  /**
  * Tell the specified Animation Sequence to play
  * @param {String} type // the name of the property of the _animations Object to run 
  */   
   runAnimationSequence: function(type){
       console.log(type);
       this._animations[type].startAnimating();
   },

  /**
  * Add a reference to the OCD instance in the parent level/game engine code
  * @param {Class} MINDreference // reference to the MIND instance
  */     
   addOCDReference: function(MINDreference){
       this._OCDReference = MINDreference;
   },
 
  /**
  * Communicates with the OCD instance once the Thought Bubble Selector has hidden
  * 
  */    
   bubbleHidden: function(){
       this._OCDReference.respondedOCDTrigger();
   }
   
  
  
  
});
