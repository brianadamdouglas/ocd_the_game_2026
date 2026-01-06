var MovableTile = InteractiveTile.extend({
  construct: function() { 
		this.SC.construct();
		this._moveObject;
		this._canMove;
		this.x_moveCount;
		this.y_moveCount;
		this._className = "Movable Tile";
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
  init: function(container, id, className, x, y, width, height, imgs, startFrame, moveObject) {
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
		this.x_moveCount = 0;
		this.y_moveCount = 0;
		this._canMove = true;
		this.setLoc(x,y);
		this.visible = true;
		this.setMoveObject(moveObject);
		this._div.on("tap",this.onPressForInteraction.bind(this));
  },

   /**
  * @description Creates this._moveObject which contains four directions(Up, Right, Down, Left) as well as the rate of movement as well as the x and y maximum distances  
  * @param {Object} obj // passed in from the gameBoard.js
  */ 
  setMoveObject: function(obj){
      	
      			var x = obj.x;
      			var y = obj.y;
      			var xMax = obj.xMax;
      			var yMax = obj.yMax; 
      			var up = obj.up;
      			var down = obj.down;
      			var left = obj.left;
      			var right = obj.right;
				this._moveObject = 		{
  										UP:{x:0, y:0, xMax:0, yMax:0, active:false},
  										RIGHT:{x:0, y:0, xMax:0, yMax:0, active:false},
  										DOWN:{x:0, y:0, xMax:0, yMax:0, active:false},
  										LEFT:{x:0, y:0, xMax:0, yMax:0, active:false},
										};
				if(up){
					this._moveObject.UP = {x:0, y:-y, xMax:xMax, yMax:-yMax, active:true};	
				}
				if(right){
					this._moveObject.RIGHT = {x:x, y:0, xMax:xMax, yMax:yMax, active:true};	
				}
				if(down){
					this._moveObject.DOWN = {x:0, y:y, xMax:xMax, yMax:yMax, active:true};	
				}
				if(left){
					this._moveObject.LEFT = {x:-x, y:0, xMax:-xMax, yMax:yMax, active:true};	
				}
				
  										
		
  },
  
  
  /**
  * @description Public function that calls the private function this.interact
  * @param {String} direction
  */    
  actedUpon: function(direction) {
      this.interact(direction);
  },
  
  
  /**
  * @description removes the references from the quadtree, moves the MovableTile instance in the direction specified up to it's max and then registers the instance again in the quadtree
  * @param {String} direction
  */ 
  interact: function(direction){
      	if(this._canMove){
			var moveInfo = this._moveObject[String(direction)];
			this.removeQuads();
			this.setLoc(this._x +  moveInfo.x, this._y +  moveInfo.y);
			if(moveInfo.xMax!=0){
				if(this.x_moveCount!= moveInfo.xMax){
					this.x_moveCount += moveInfo.x;
				}else{
					//this._canMove = false;
				}
				
			}
			if(moveInfo.yMax!=0){
				if(this.y_moveCount!= moveInfo.yMax){
					this.y_moveCount += moveInfo.y;
				}else{
					//this._canMove = false;
				}
				
			}
			this.setRect(this._x +  moveInfo.x, this._y +  moveInfo.y);
			this.createQuads();
			
      	}

  }
  
});
