class MovableTile_Controller extends InteractiveTile_Controller {
	constructor() { 
	super();
	this._moveObject;
	this._canMove;
	this._x_moveCount;
	this._y_moveCount;
	this._className = "MovableTile";
}

	init(){
	this._rect = {
			top:0,
			right:0,
			bottom:0,
			left:0
	};	
	this._canMove = true;
	this._x_moveCount = 0;
	this._y_moveCount = 0;
	
	this.addListners();
}

	/**
* @description Add Listeners to the Global Event Handler
* @return null
	*/
	addListners(){
	g_eventHandler.addAListener("resetPosition", this);
}



	/**
* @description Creates this._moveObject which contains four directions(Up, Right, Down, Left) as well as the rate of movement as well as the x and y maximum distances  
* @param {Object} obj // passed in from the gameBoard.js
	*/ 
	setMoveObject(obj){
  	
  			var x = obj.x;
  			var y = obj.y;
  			var xMin = obj.xMin;
  			var yMin = obj.yMin; 
  			var xMax = obj.xMax;
  			var yMax = obj.yMax; 
  			var up = obj.up;
  			var down = obj.down;
  			var left = obj.left;
  			var right = obj.right;
		this._moveObject = {
			UP:{x:0, y:0, xMax:xMax, yMax:yMax, xMin:xMin, yMin:yMin, active:false},
			RIGHT:{x:0, y:0, xMax:xMax, yMax:yMax, xMin:xMin, yMin:yMin, active:false},
			DOWN:{x:0, y:0, xMax:xMax, yMax:yMax, xMin:xMin, yMin:yMin, active:false},
			LEFT:{x:0, y:0, xMax:xMax, yMax:yMax, xMin:xMin, yMin:yMin, active:false}
		};
			if(up){
				this._moveObject.UP.active = true;
				this._moveObject.UP.y = -y;
				 //= {x:0, y:-y, xMax:xMax, yMax:-yMax, xMin:0, yMin:0, active:true};	
			}
			if(right){
				this._moveObject.RIGHT.active = true;
				this._moveObject.RIGHT.x = x;
				//this._moveObject.RIGHT = {x:x, y:0, xMax:xMax, yMax:yMax, xMin:0, yMin:0, active:true};	
			}
			if(down){
				this._moveObject.DOWN.active = true;
				this._moveObject.DOWN.y = y;
				//this._moveObject.DOWN = {x:0, y:y, xMax:xMax, yMax:yMax, xMin:0, yMin:0, active:true};	
			}
			if(left){
				this._moveObject.LEFT.active = true;
				this._moveObject.LEFT.x = -x;
				//this._moveObject.LEFT = {x:-x, y:0, xMax:-xMax, yMax:yMax, xMin:0, yMin:0,active:true};	
			}
			
			
										
	
}


	/**
* @description Public function that calls the private function this.interact
* @param {String} direction
	*/    
	actedUpon(direction) {
  this.interact(direction);
}


	/**
* @description removes the references from the quadtree, moves the MovableTile instance in the direction specified up to it's max and then registers the instance again in the quadtree
* @param {String} direction
	*/ 
	interact(direction){
  	
  	//get direction they are moving
	var moveInfo = this._moveObject[String(direction)];
	
	//if you can add the increment and no equal the max or min then you can move.
	if(moveInfo.x<0){//left
		if(this._x_moveCount > moveInfo.xMin) {
			this.removeQuads();
			this.setViewLoc(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this._x_moveCount += moveInfo.x; 
			//console.log(this._x_moveCount)
			this.setRect(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this.createQuads();
		}
	}else if(moveInfo.x>0){//right 
		if(this._x_moveCount < moveInfo.xMax) {
			this.removeQuads();
			this.setViewLoc(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this._x_moveCount += moveInfo.x; 
			this.setRect(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this.createQuads();
		}
	}else if(moveInfo.y<0){//up
		if(this._y_moveCount > moveInfo.yMin) {
			this.removeQuads();
			this.setViewLoc(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this._y_moveCount += moveInfo.y; 
			this.setRect(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this.createQuads();
		}  
	}else if(moveInfo.y>0){//down
		if(this._y_moveCount < moveInfo.yMax) {
			this.removeQuads();
			this.setViewLoc(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this._y_moveCount += moveInfo.y; 
			this.setRect(this.getViewX() +  moveInfo.x, this.getViewY() +  moveInfo.y);
			this.createQuads();
		}
	}

}

	resetPosition(){
	this.removeQuads();
	this.getView().resetPosition();
	this.createQuads();
}

  
}