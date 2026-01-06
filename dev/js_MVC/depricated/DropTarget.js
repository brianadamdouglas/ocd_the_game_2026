var DropTarget = Tile.extend({
  construct: function() { 
  		this.SC.construct();
  		this.gameEngineTargetHitCallback;//reference to a unique dropTarget function defined in the gameEngineExtension file, sent from the gameBoard reference
  		this._className = "DropTarget";
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
  init: function(container, id, className, x, y, width, height,  dropTargetFunction) {
    	/* this.setID(IDOverride);
		var newDiv = document.createElement('div');
		newDiv.id = IDOverride;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+IDOverride);//making the jQuery selection reference
		this._div.addClass(className); */
		this.setID(id);
		var newDiv = document.createElement('div');
		newDiv.id = id;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+id);//making the jQuery selection reference
		this._div.addClass(className);
		console.log(this._div);
		
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
		this.setGameEngineLiftedCallback(dropTargetFunction);
  },
 
  /**
  * @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
  * @param {Function} func 
  */  
  setGameEngineLiftedCallback: function(func){    
	this.gameEngineTargetHitCallback = func; 
  },
 
 
  /**
  * @description Public function that calls this.gameEngineTargetHitCallback
  * @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
  */   
  actedUpon: function(droppedClassReference){
   	this.gameEngineTargetHitCallback(this,droppedClassReference);   
  }
  
  
  
});
