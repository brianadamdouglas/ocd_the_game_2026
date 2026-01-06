var TimerDisplay = Tile.extend({
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
  construct: function() { 
  		this.SC.construct();
  		this._timer;
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
  init: function(container, id, className, x, y, width, height) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		$('body').append(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+id);//making the jQuery selection reference
		this._div.addClass(className);
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this.visible = true;
  },
  
  addTimer: function(duration){
      this._timer = new Timer();
	  this._timer.init(duration);
	  O(this._timer).addEventListener("updateClock", this.updateDisplay.bind(this));
	  this._timer.startClock();
  },
  
  updateDisplay: function(){
      console.log('a');
  }
  
  
  
  
  
});
