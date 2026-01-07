class Timer_View extends Tile_View {
  /**
  * Constructor
  * This class calls on at present one other Class, animationFrame.js
  *	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
  */
  constructor() { 
  		super();
  		this._className = "Tile";
  }
 
 
	/**
* @description Initializes the instance
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return 
	*/
	init(controller,data) {
	
	this._controller = controller;
	
	
  	var container = data.container;
  	var id = data.id;
  	var className = data.className
  	var x = data.x;
  	var y = data.y;
  	var width = data.w;
  	var height = data.h;
  	var imgs = data.imgs;
  	var startFrame = data.startFrame;
  	
  	 

  	
	this.setID(id);
	var newDiv = document.createElement('div');
	newDiv.id = id;
	$('body').append(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+id);//making the jQuery selection reference
	this._div.addClass(className);

	this.setDimensions(width,height);
	this.setLoc(x,y);
	this._visible = true;
}

  
	addTimer(duration){
  this._timer = new Timer();
  this._timer.init(duration);
  O(this._timer).addEventListener("updateClock", this.updateDisplay.bind(this));
  this._timer.startClock();
}

	updateDisplay(str){
  this._div.html( str );
}
  
  
  
  
  
}