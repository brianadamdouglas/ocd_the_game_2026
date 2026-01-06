var Button = Tile.extend({
  construct: function() { 
		this.SC.construct();
		this.interactState = false;
		this._classContainer;
		this.gameEngineButtonCallback;
		this._className = "Button";
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
  init: function(classContainer, container, id, className, x, y, width, height, imgs, startFrame, buttonFunction, IDOverride) {
        var myID = id;
        
        /* if(IDOverride != undefined){
      		var myID = IDOverride;
      	}else{
      		var myID = id; 
      	} */
    	this.setID(myID);
		var newDiv = document.createElement('div');
		newDiv.id = myID;
		this._classContainer = classContainer;
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
		this._div = $('#'+myID);//making the jQuery selection reference
		this._div.addClass(className);
		/* adding image subclass which adds the images into the currenly empty div*/
		
		this._imageDiv = new ImagesBase();
		this._imageDiv.init(myID, myID, width, height, imgs, startFrame);
		
		this.rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
		};
		this.setDimensions(width,height);
		this.setLoc(x,y);
		this.setGameEngineButtonCallback(buttonFunction);
		this._div.on("tap",this.actedUpon.bind(this));
		this.hide();
  },

 
  
  
  /**
  * @description Conduit for the mobile "tap", sends a reference to the interactWithStationaryItem function in the main gameEngine
  */ 
  onPressForInteraction:function(){
      console.log("Do Something");
      //interactWithStationaryItem(this);//interactWithStationaryItem_Mobile(this);
  },

  
  /**
  * @description Set the callback property this.gameEngineTargetHitCallback which is used to give unique functionality to interactions with the dropTargets
  * @param {Function} func 
  */  
  setGameEngineButtonCallback: function(func){  
	this.gameEngineButtonCallback = func; 
  },
 
 
  /**
  * @description Public function that calls this.gameEngineTargetHitCallback
  * @param {Class} droppedClassReference // a reference to the Stick Object instance that is placed on the DropTarget instance 
  */   
  actedUpon: function(){
   	this.gameEngineButtonCallback();   
  }
  
});
