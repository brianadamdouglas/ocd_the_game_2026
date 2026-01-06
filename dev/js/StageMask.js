var StageMask = Base.extend({
  construct: function() { 
		this.SC.construct();
		this._className = "StageMask";
  },

  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection on the stage that houses the player tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width .
  * @param {Interger} height // Max height .
  * @return 
  */

  init: function(container, id, className, x, y, width, height, imgs, startFrame) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		$('body').append(newDiv); 
		this._div = $('#'+id);
		this._div.addClass(className);
		/* adding image subclass which adds the images into the currenly empty div*/
		
		this._imageDiv = new ImagesBase();
		this._imageDiv.init(id, id, width, height, imgs, startFrame);
		
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
		this.hide();
  },
 

  /**
  * @description Set the location for the Player tile in the Stage Selector
  * @param {Interger} x // the x position of the Player tile Selector
  * @param {Interger} y // the y position of the Player tile Selector
  */   
  setLoc: function(x,y) {
      	this._x = x;
      	this._y = y;
     	this._div.css('left',x);
		this._div.css('top',y);
		this.setRect(x,y);
  },

  
  /**
  * @description Return the dimensions of the PLayer tile;
  * @return {Object} the dimensions Object(width, height); 
  */    
  getDimensions: function() {
      	return {width:this._width,height:this._height};
  }
  
  
  
  
  
});

