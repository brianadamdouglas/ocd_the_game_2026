class MultiPaneMenu_View extends View {
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
	
	const classContainer = data.classContainer
	const container = data.container;
  	const id = data.id;
  	const className = data.className
  	const x = data.x;
  	const y = data.y;
  	const width = data.w;
  	const height = data.h;
  	
	this.setID(id);
	const newDiv = document.createElement('div');
	newDiv.id = id;
	this._classContainer = classContainer;
	// Handle container - if it's "body", use document.body, otherwise use O()
	if(container === "body") {
		document.body.appendChild(newDiv);
	} else {
		O(container).appendChild(newDiv);
	}
	this._div = $(`#${id}`);//making the jQuery selection reference
	this._div.addClass(className);
	
	this.rect = {
		top:0,
		right:0,
		bottom:0,
		left:0
	};
	//this.setImagesState(startFrame);
	this.setDimensions(width,height);
	this.setDefaultLoc(x,y);
	this.setLoc(x,y);
	this.interfaceReferences = {};
	this.currentPage = 0;
	this._visible = false;
	// Don't hide here - let the controller decide when to show/hide
	// this.hide();
}

  
  

  
  
  
}