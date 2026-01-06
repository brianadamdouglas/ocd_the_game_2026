var Timer_View = Tile_View.extend({
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
* @description Initializes the instance
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return 
*/
init: function(controller,data) {
	
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
	/* adding image subclass which adds the images into the currenly empty div*/
	
	
	/* adding image subclass */

	this.setDimensions(width,height);
	this.setLoc(x,y);
	this._visible = true;
	//console.log(this.getLoc());
}, 

  
addTimer: function(duration){
  this._timer = new Timer();
  this._timer.init(duration);
  O(this._timer).addEventListener("updateClock", this.updateDisplay.bind(this));
  this._timer.startClock();
},

updateDisplay: function(str){
  this._div.html( str );
}
  
  
  
  
  
});
