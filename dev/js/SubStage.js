var SubStage = Base.extend({
  construct: function() { 
		this.SC.construct();
		this._className = "SubStage";
		
  },

  /**
  * @description Initializes the instance
  * @param {Selection} container // the selection on the stage that houses the player tile
  * @param {String} id // unique name of the new DIV
  * @param {String} className // space delimited string of CSS classes that are attached to this instance.
  * @param {Interger} x // X coordinate on the stage.
  * @param {Interger} y // Y coordinate on the stage.
  * @param {Interger} width // Max width of the animation tiles.
  * @param {Interger} height // Max height of the animation tiles.
  * @return 
  */

  init: function(container, id, className, x, y, width, height) {
    	this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+id);//making the jQuery selection reference
		this._div.addClass(className);
		this.setDimensions(width,height);
		this.setLoc(x,y);
  }
 
  
  
  
  
  
  
});

