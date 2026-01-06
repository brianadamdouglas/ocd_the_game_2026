const StackedAnimations_View = NonGraphic_View.extend({ // also used for the rotater div , perhaps I should rename this.
/**
* Constructor
* This class calls on at present one other Class, animationFrame.js
*	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
*/
construct() { 
	this.SC.construct();
	
	this._className = "NonGraphic_View";
},



init(controller,data) {
	
	this._controller = controller;
	
	
  	var container = data.container;
  	var id = data.id;
  	var className = data.className
  	var x = data.x;
  	var y = data.y;
  	var width = data.w;
  	var height = data.h;
  	
	this.setID(id);
	var newDiv = document.createElement('div');
	newDiv.id = id;
	

	O(container).appendChild(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+id);//making the jQuery selection reference
	this._div.addClass(className);
	

	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this._visible = true; 

},

/**
* Add a new animation sequence to the thought bubble
* @param {String} name // the name of the animation to be stored as a name:value pair in the this._animations Object 
* @param {String} id // the id in the DOM for the new animation
* @param {String} className // space delimited string of CSS class names
* @param {Interger} x // the x position of the animation Selector
* @param {Interger} y // the y position of the animation Selector
* @param {Interger} width // the width of the animation Selector
* @param {Interger} height // the height of the animation Selector
* @param {Array} imgs // an array of image urls for the sequence
* @param {String} startFrame // the frame to display first on the animation
*/    
addAnimationSequence(data){ //name, id, className, x, y, width, height, imgs, startFrame
    var newController = new AnimationSequence_Controller();
	var newView = new Tile_View();
	newController.bindView(newView,data);
	//console.log(newController.getView());
	return newController;

	
}
  
  
  
});
