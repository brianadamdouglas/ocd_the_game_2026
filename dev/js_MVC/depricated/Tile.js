var Tile = Base.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
  construct: function() { 
  		this.SC.construct();
  		this._className = "Tile";
  },
 
  /**
  * I@description nitializes the instance
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
  init: function(container, id, className, x, y, width, height, imgs, startFrame) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+id);//making the jQuery selection reference
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
		this.visible = true;
  },
  
  /**
  * @description Set the location for the Tile in the Stage Selector, as well as firing the setRect function
  * @param {Interger} x // the x position of the Tile Selector
  * @param {Interger} y // the y position of the Tile Selector
  */  
  setLoc: function(x,y) {
      	this._x = x;
      	this._y = y;
     	this._div.css('left',x);
		this._div.css('top',y);
		this.setRect(x,y);
  },
  
  
  /**
  * @description Check to see if the Tile Instance has a listener
  * @return {Boolean} does it have a listening tile
  */    
  hasListener: function (){
   		return false;   
  },
  
  /**
  * @description Check to see if the Tile Instance has a listener
  * @return {Boolean} does it have a listening tile
  */    
  hasMultipleListeners: function (){
   		return false;   
  },
 
  /**
  * @description Get the visibility of the Tile Selector
  * @return {Boolean} is the Tile visible
  */   
  getVisibility: function(){
      return this.visible;
  }
  
  
  
});
