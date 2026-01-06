var InteractiveTile = Tile.extend({
  construct: function() { 
		this.SC.construct();
		this.interactState = false;
		this.thoughtType;
		this.gameEngineRemoveFromQuadtreeCallback; //reference to removeRect function in the main gameEngine
		this.gameEngineAddToQuadtreeCallback; //reference to registerRect function in the main gameEngine
		this._className = "Interactive Tile";
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
		
		this.rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this.visible = true;
		//this._div.on("tap",this.onPressForInteraction.bind(this));
  },
 
 
  /**
  * @description Set the callback property this.gameEngineRemoveFromQuadtreeCallback to remove items from the quadtree in the main gameEngine
  * @param {Function} func // reference to removeRect funcion
  */  
  setGameEngineRemoveFromQuadtreeCallback: function(func){
	this.gameEngineRemoveFromQuadtreeCallback = func;  
  },
  
  
  /**
  * @description Set the callback property this.gameEngineAddToQuadtreeCallback to remove items from the quadtree in the main gameEngine
  * @param {Function} func // reference to registerRect funcion
  */   
  setGameEngineAddToQuadtreeCallback: function(func){
	this.gameEngineAddToQuadtreeCallback = func;  
  },
 
 
  /**
  * @description Removes all reference to the Class instance in the quadTree in the main gameEngine
  */   
  removeQuads: function(){
       for(var i = 0; i<this.registeredQuads.length; i++){
          this.gameEngineRemoveFromQuadtreeCallback(this.registeredQuads[i]);
      } 
      this.registeredQuads = new Array();
  },
 
  /**
  * @description Repopulates the quadtree with the reference to the Class instance where possible
  */    
  createQuads: function(){
      var id = this.getID().replace("sprite_tile","");
      this.gameEngineAddToQuadtreeCallback(this, Number(id));
  },
  
  
  /**
  * @description Conduit for the mobile "tap", sends a reference to the interactWithStationaryItem function in the main gameEngine
  */ 
  onPressForInteraction:function(){
      interactWithStationaryItem(this);//interactWithStationaryItem_Mobile(this);
  },

  /**
  * @description Set the this.thoughtType property  // reference to removeRect funcion
  */  
  setThoughtType: function(thoughtType) {
      	this.thoughtType = thoughtType;
  },
  
  /**
  * @description Get the this.thoughtType property 
  * @return {String} thoughtType
  */ 
  getThoughtType: function() {
      	return this.thoughtType;
  },

  /**
  * @description Public function that calls the private function this.interact 
  */  
  actedUpon: function() {
      this.interact();
  },


  /**
  * @description At it's most basic it turns this.interactState true and false
  */   
  interact: function(){
      this.interactState = ! this.interactState;
  }
  
});
