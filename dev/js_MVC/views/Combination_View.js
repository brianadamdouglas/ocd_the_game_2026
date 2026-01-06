class Combination_View extends View {
	/**
	* Constructor
	* This class calls on at present one other Class, animationFrame.js
	*	As I continue to refine the code, I will delegate a subclass that deals strictly with the images
	*/
	constructor() { 
	super();
	this._className = "Tile";
}

	init(controller,data) {
	this._controller = controller;
	
	var classContainer = data.classContainer
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
	this._classContainer = classContainer;
	if(container === "body"){
		$('body').append(newDiv); //appends the newly created div into the container. 
	}else{
		O(container).appendChild(newDiv);//appends the newly created div into the container. 
	}
	
	this._div = $('#'+id);//making the jQuery selection reference
	this._div.addClass(className);
	
	this.rect = {
		top:0,
		right:0,
		bottom:0,
		left:0
	};
	//this.setImagesState(startFrame);
	this.setDimensions(width,height);
	this.setLoc(x,y);
	this.interfaceReferences = new Object();
	this.currentPage = 0;
	this.hide();
}

  
  

  
  
  
}