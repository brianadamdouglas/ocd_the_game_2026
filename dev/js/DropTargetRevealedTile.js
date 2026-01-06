var DropTargetRevealedTile = InteractiveTile.extend({
  construct: function() { 
		this.SC.construct();
		this._className = "Drop Target Revealed Tile";
  },
  
  /**
  * @description Initializes the instance
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
  init: function(container, id, className, x, y, width, height, imgs, IDOverride) {
    	this.setID(IDOverride);
		var newDiv = document.createElement('div');
		newDiv.id = IDOverride;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+IDOverride);//making the jQuery selection reference
		this._div.addClass(className);
		/* adding image subclass which adds the images into the currenly empty div*/
		
		this._imageDiv = new ImagesBase();
		var startFrame = 0;
		this._imageDiv.init(IDOverride, IDOverride, width, height, imgs, startFrame); 
		
		/* adding image subclass */
		this.rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};
		//this.setImagesState(startFrame);
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this._div.hide();
		console.log(this);
  },
 
  /**
  * @description Show the hidden this._div
  */    
  interact: function(){
      this._div.show();
  }
  
});
