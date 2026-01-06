/**
* @class ThoughtBubble_View
* @description The parent View class for all Tiles
*/
class ThoughtBubble_View extends Tile_View {

	constructor() { 
	super();
	this._stackedAnimationsController;
	this._className = "Tile";
}

	/**
* @description Initializes the instance
* @param {Controller} controller // the controller associated with the view
* @param {Object} data // package of data that include positioning and size 
* @return 
	*/
	init(controller,imageControllerData,stackedAnimationControllerData) {
	
	this._controller = controller;
	
	
  	var container = imageControllerData.container;
  	var id = imageControllerData.id;
  	var className = imageControllerData.className
  	var x = imageControllerData.x;
  	var y = imageControllerData.y;
  	var width = imageControllerData.w;
  	var height = imageControllerData.h;
  	var imgs = imageControllerData.imgs;
  	var startFrame = imageControllerData.startFrame;
  	
  	 

  	
	this.setID(id);
	var newDiv = document.createElement('div');
	newDiv.id = id;
	$('body').append(newDiv);//appends the newly created div into the container. 
	this._div = $('#'+id);//making the jQuery selection reference
	this._div.addClass(className);
	/* adding image subclass which adds the images into the currenly empty div*/
	
	
	var imagesData = {
		id:imageControllerData.id, 
		w:imageControllerData.w, 
		h:imageControllerData.h, 
		imgs:imageControllerData.imgs, 
		startFrame:imageControllerData.startFrame
	}
	this._imageController = new Images_Controller();
	var newView = new Images_View();
	this._imageController.bindView(newView,imagesData); 
	

	this.setDimensions(width,height);
	this.setLoc(x,y);
	this._visible = false;
	this._div.hide();	 
	
	var stackedAnimationsData = { 
		container:imageControllerData.id,
		id:stackedAnimationControllerData.id, 
		x:stackedAnimationControllerData.x, 
		y:stackedAnimationControllerData.y,
		w:stackedAnimationControllerData.w, 
		h:stackedAnimationControllerData.h
	} 
	
	this._stackedAnimationsController = new StackedAnimations_Controller();
	var newStackedView = new StackedAnimations_View();
	this._stackedAnimationsController.bindView(newStackedView,stackedAnimationsData); 
	
}

	/**
* @description 
* @return null
	*/
	getStackedAnimationController(){
		return this._stackedAnimationsController;
	}

	/**
	* Reveal the Thought Bubble
	* 
	*/   
	revealBubble() {
		this._div.fadeIn( "slow", function() { });
	}

	/**
	* Hide the Thought Bubble Selector
	*
	*/ 
	hideBubble(animation) {
		var reference = this;
		this._div.fadeOut( "fast", function() { reference.bubbleHidden(animation);});//animation.resetFrames();
  /* var reference = this;
  var options = {
  	duration: 50,
  	easing: 'swing',
  	complete:jQuery.proxy(this.bubbleHidden, this)
	};
  this._div.fadeOut(options); // */
  
}

	/**
	* Communicates with the OCD instance once the Thought Bubble Selector has hidden
	* 
	*/    
	bubbleHidden(animation){
		/* this._OCDReference.respondedOCDTrigger(); */
		g_eventHandler.dispatchAnEvent("respondedOCDTrigger",{});
		g_eventHandler.dispatchAnEventOneTarget("resetFrames",{target:animation});
	}

  
  

  
  
  
 }